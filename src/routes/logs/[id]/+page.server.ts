import { prisma } from '$lib/server/prisma';
import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);

	const log = await prisma.dailyLog.findUnique({
		where: { id }
	});

	if (!log) {
		throw error(404, 'Log tidak ditemukan');
	}

	const kategoriList = await prisma.kategori.findMany({
		orderBy: { nama: 'asc' }
	});

	return {
		log: {
			...log,
			tanggal: log.tanggal.toISOString().split('T')[0],
			createdAt: log.createdAt.toISOString()
		},
		kategoriList
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const id = Number(params.id);
		const formData = await request.formData();

		const tanggal = formData.get('tanggal')?.toString();
		const jam_mulai = formData.get('jam_mulai')?.toString();
		const kategori = formData.get('kategori')?.toString();
		const deskripsi = formData.get('deskripsi')?.toString()?.trim();
		const status = formData.get('status')?.toString();
		const catatan = formData.get('catatan')?.toString()?.trim() || null;

		if (!tanggal || !jam_mulai || !kategori || !deskripsi || !status) {
			return fail(400, { error: 'Semua field wajib diisi' });
		}

		try {
			await prisma.dailyLog.update({
				where: { id },
				data: {
					tanggal: new Date(tanggal),
					jam_mulai,
					kategori,
					deskripsi,
					status,
					catatan
				}
			});
			return { success: true, message: 'Log berhasil diperbarui' };
		} catch (e) {
			return fail(500, { error: 'Gagal memperbarui log' });
		}
	},

	delete: async ({ params }) => {
		const id = Number(params.id);

		try {
			await prisma.dailyLog.delete({ where: { id } });
		} catch (e) {
			return fail(500, { error: 'Gagal menghapus log' });
		}

		throw redirect(303, '/logs');
	}
};
