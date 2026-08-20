import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request }) => {
	const id = Number(params.id);

	try {
		const body = await request.json();
		const { nama, warna } = body;

		const kategori = await prisma.kategori.update({
			where: { id },
			data: {
				...(nama && { nama: nama.trim() }),
				...(warna && { warna })
			}
		});

		return json(kategori);
	} catch (e: any) {
		if (e.code === 'P2002') {
			return json({ error: 'Nama kategori sudah ada' }, { status: 400 });
		}
		return json({ error: 'Gagal memperbarui kategori' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	const id = Number(params.id);

	try {
		await prisma.kategori.delete({ where: { id } });
		return json({ success: true });
	} catch (e) {
		return json({ error: 'Gagal menghapus kategori' }, { status: 500 });
	}
};
