import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search')?.trim() || '';
	const kategori = url.searchParams.get('kategori') || '';
	const status = url.searchParams.get('status') || '';
	const dateFrom = url.searchParams.get('dateFrom') || '';
	const dateTo = url.searchParams.get('dateTo') || '';

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
		if (dateFrom) where.tanggal.gte = new Date(dateFrom);
		if (dateTo) where.tanggal.lte = new Date(dateTo + 'T23:59:59.999Z');
	}

	const logs = await prisma.dailyLog.findMany({
		where,
		orderBy: [{ tanggal: 'desc' }, { jam_mulai: 'desc' }]
	});

	// Build CSV
	const headers = ['Tanggal', 'Jam Mulai', 'Kategori', 'Deskripsi', 'Status', 'Catatan'];

	const rows = logs.map((log) => {
		const tanggal = new Date(log.tanggal).toLocaleDateString('id-ID');
		return [
			tanggal,
			log.jam_mulai,
			log.kategori,
			`"${(log.deskripsi || '').replace(/"/g, '""')}"`,
			log.status,
			`"${(log.catatan || '').replace(/"/g, '""')}"`
		].join(',');
	});

	const csv = [headers.join(','), ...rows].join('\n');

	const now = new Date().toISOString().split('T')[0];
	const filename = `work-log-export-${now}.csv`;

	return new Response(csv, {
		status: 200,
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="${filename}"`
		}
	});
};
