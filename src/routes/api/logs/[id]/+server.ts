import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const id = Number(params.id);
	const log = await prisma.dailyLog.findUnique({ where: { id } });

	if (!log) {
		return json({ error: 'Log tidak ditemukan' }, { status: 404 });
	}

	return json(log);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const id = Number(params.id);

	try {
		const body = await request.json();
		const { tanggal, jam_mulai, jam_selesai, kategori, deskripsi, status, catatan } = body;

		const log = await prisma.dailyLog.update({
			where: { id },
			data: {
				...(tanggal && { tanggal: new Date(tanggal) }),
				...(jam_mulai && { jam_mulai }),
				...(jam_selesai && { jam_selesai }),
				...(kategori && { kategori }),
				...(deskripsi && { deskripsi }),
				...(status && { status }),
				catatan: catatan ?? undefined
			}
		});

		return json(log);
	} catch (e) {
		return json({ error: 'Gagal memperbarui log' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	const id = Number(params.id);

	try {
		await prisma.dailyLog.delete({ where: { id } });
		return json({ success: true });
	} catch (e) {
		return json({ error: 'Gagal menghapus log' }, { status: 500 });
	}
};
