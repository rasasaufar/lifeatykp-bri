import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const kategoriList = await prisma.kategori.findMany({
		orderBy: { nama: 'asc' }
	});
	return json(kategoriList);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { nama, warna } = body;

		if (!nama?.trim()) {
			return json({ error: 'Nama kategori wajib diisi' }, { status: 400 });
		}

		const kategori = await prisma.kategori.create({
			data: {
				nama: nama.trim(),
				warna: warna || '#6b7280'
			}
		});

		return json(kategori, { status: 201 });
	} catch (e: any) {
		if (e.code === 'P2002') {
			return json({ error: 'Kategori sudah ada' }, { status: 400 });
		}
		return json({ error: 'Gagal membuat kategori' }, { status: 500 });
	}
};
