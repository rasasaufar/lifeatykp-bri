import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 10));
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

	const [logs, total] = await Promise.all([
		prisma.dailyLog.findMany({
			where,
			orderBy: [{ tanggal: 'desc' }, { jam_mulai: 'desc' }],
			skip: (page - 1) * limit,
			take: limit
		}),
		prisma.dailyLog.count({ where })
	]);

	return json({
		logs,
		total,
		page,
		totalPages: Math.ceil(total / limit)
	});
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { tanggal, jam_mulai, jam_selesai, kategori, deskripsi, status, catatan } = body;

		if (!tanggal || !jam_mulai || !jam_selesai || !kategori || !deskripsi || !status) {
			return json({ error: 'Semua field wajib diisi' }, { status: 400 });
		}

		const log = await prisma.dailyLog.create({
			data: {
				tanggal: new Date(tanggal),
				jam_mulai,
				jam_selesai,
				kategori,
				deskripsi,
				status,
				catatan: catatan || null
			}
		});

		return json(log, { status: 201 });
	} catch (e) {
		return json({ error: 'Gagal membuat log' }, { status: 500 });
	}
};
