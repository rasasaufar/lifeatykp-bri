import { prisma } from '$lib/server/prisma';
import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const kategoriList = await prisma.kategori.findMany({
		orderBy: { nama: 'asc' }
	});
	return { kategoriList };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const tanggal = formData.get('tanggal')?.toString();
		const jam_mulai = formData.get('jam_mulai')?.toString();
		const kategori = formData.get('kategori')?.toString();
		const deskripsi = formData.get('deskripsi')?.toString()?.trim();
		const status = formData.get('status')?.toString();
		const catatan = formData.get('catatan')?.toString()?.trim() || null;

		if (!tanggal || !jam_mulai || !kategori || !deskripsi || !status) {
			return fail(400, {
				error: 'Semua field wajib diisi',
				tanggal, jam_mulai, kategori, deskripsi, status, catatan
			});
		}

		try {
			await prisma.dailyLog.create({
				data: {
					tanggal: new Date(tanggal),
					jam_mulai,
					kategori,
					deskripsi,
					status,
					catatan
				}
			});
		} catch (e) {
			return fail(500, {
				error: 'Gagal menyimpan log',
				tanggal, jam_mulai, jam_selesai, kategori, deskripsi, status, catatan
			});
		}

		throw redirect(303, '/logs');
	}
};
