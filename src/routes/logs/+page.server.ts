import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 10;

export const load: PageServerLoad = async ({ url }) => {
	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	const search = url.searchParams.get('search')?.trim() || '';
	const kategori = url.searchParams.get('kategori') || '';
	const status = url.searchParams.get('status') || '';
	const dateFrom = url.searchParams.get('dateFrom') || '';
	const dateTo = url.searchParams.get('dateTo') || '';

	// Build where clause
	const where: any = {};

	if (search) {
		where.deskripsi = { contains: search };
	}

	if (kategori) {
		where.kategori = kategori;
	}

	if (status) {
		where.status = status;
	}

	if (dateFrom || dateTo) {
		where.tanggal = {};
		if (dateFrom) {
			where.tanggal.gte = new Date(dateFrom);
		}
		if (dateTo) {
			where.tanggal.lte = new Date(dateTo + 'T23:59:59.999Z');
		}
	}

	const [logs, total] = await Promise.all([
		prisma.dailyLog.findMany({
			where,
			orderBy: [{ tanggal: 'desc' }, { jam_mulai: 'desc' }],
			skip: (page - 1) * PAGE_SIZE,
			take: PAGE_SIZE
		}),
		prisma.dailyLog.count({ where })
	]);

	const kategoriList = await prisma.kategori.findMany({
		orderBy: { nama: 'asc' }
	});

	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

	return {
		logs: logs.map((log) => ({
			...log,
			tanggal: log.tanggal.toISOString(),
			createdAt: log.createdAt.toISOString()
		})),
		total,
		page,
		totalPages,
		kategoriList,
		filters: { search, kategori, status, dateFrom, dateTo }
	};
};
