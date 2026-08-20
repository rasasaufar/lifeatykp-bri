import { prisma } from '$lib/server/prisma';
import { getGreeting, getTodayRange, getWeekRange } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { start: todayStart, end: todayEnd } = getTodayRange();
	const { start: weekStart, end: weekEnd } = getWeekRange();

	// Today's logs
	const todayLogs = await prisma.dailyLog.findMany({
		where: {
			tanggal: { gte: todayStart, lte: todayEnd }
		},
		orderBy: { jam_mulai: 'asc' }
	});

	// Week stats
	const weekLogs = await prisma.dailyLog.findMany({
		where: {
			tanggal: { gte: weekStart, lte: weekEnd }
		}
	});

	// Category stats for pie chart
	const kategoriList = await prisma.kategori.findMany();
	const kategoriMap = new Map(kategoriList.map((k) => [k.nama, k.warna]));

	const kategoriCounts: Record<string, number> = {};
	weekLogs.forEach((log) => {
		kategoriCounts[log.kategori] = (kategoriCounts[log.kategori] || 0) + 1;
	});

	const kategoriStats = Object.entries(kategoriCounts).map(([nama, count]) => ({
		nama,
		count,
		warna: kategoriMap.get(nama) || '#6b7280'
	}));

	// Status stats for bar chart
	const statusCounts: Record<string, number> = {};
	weekLogs.forEach((log) => {
		statusCounts[log.status] = (statusCounts[log.status] || 0) + 1;
	});

	const statusStats = Object.entries(statusCounts).map(([status, count]) => ({
		status,
		count
	}));

	// Calendar: days of current month that have logs
	const now = new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
	const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

	const monthLogs = await prisma.dailyLog.findMany({
		where: {
			tanggal: { gte: monthStart, lte: monthEnd }
		},
		select: { tanggal: true }
	});

	const activeDays = [...new Set(monthLogs.map((l) => new Date(l.tanggal).getDate()))];

	return {
		greeting: getGreeting(),
		todayLogs: todayLogs.map((log) => ({
			...log,
			tanggal: log.tanggal.toISOString(),
			createdAt: log.createdAt.toISOString()
		})),
		todayTotal: todayLogs.length,
		weekTotal: weekLogs.length,
		kategoriStats,
		statusStats,
		activeDays
	};
};
