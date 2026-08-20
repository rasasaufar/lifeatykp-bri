import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const kategoriList = await prisma.kategori.findMany({
		orderBy: { nama: 'asc' }
	});

	// Count logs per kategori
	const logCounts: Record<string, number> = {};
	const counts = await prisma.dailyLog.groupBy({
		by: ['kategori'],
		_count: { id: true }
	});
	counts.forEach((c) => {
		logCounts[c.kategori] = c._count.id;
	});

	return { kategoriList, logCounts };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const nama = formData.get('nama')?.toString().trim();
		const warna = formData.get('warna')?.toString() || '#6b7280';

		if (!nama) {
			return fail(400, { error: 'Nama kategori wajib diisi', nama, warna });
		}

		try {
			await prisma.kategori.create({
				data: { nama, warna }
			});
			return { success: true, message: 'Kategori berhasil ditambahkan' };
		} catch (e: any) {
			if (e.code === 'P2002') {
				return fail(400, { error: 'Kategori sudah ada', nama, warna });
			}
			return fail(500, { error: 'Gagal menambahkan kategori', nama, warna });
		}
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const nama = formData.get('nama')?.toString().trim();
		const warna = formData.get('warna')?.toString() || '#6b7280';

		if (!nama) {
			return fail(400, { error: 'Nama kategori wajib diisi' });
		}

		try {
			await prisma.kategori.update({
				where: { id },
				data: { nama, warna }
			});
			return { success: true, message: 'Kategori berhasil diperbarui' };
		} catch (e: any) {
			if (e.code === 'P2002') {
				return fail(400, { error: 'Nama kategori sudah ada' });
			}
			return fail(500, { error: 'Gagal memperbarui kategori' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		try {
			await prisma.kategori.delete({ where: { id } });
			return { success: true, message: 'Kategori berhasil dihapus' };
		} catch {
			return fail(500, { error: 'Gagal menghapus kategori' });
		}
	}
};
