import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const kategoriDefaults = [
		{ nama: 'Support', warna: '#3b82f6' },
		{ nama: 'Project', warna: '#8b5cf6' },
		{ nama: 'Meeting', warna: '#f59e0b' },
		{ nama: 'Maintenance', warna: '#10b981' },
		{ nama: 'Lainnya', warna: '#6b7280' }
	];

	for (const k of kategoriDefaults) {
		await prisma.kategori.upsert({
			where: { nama: k.nama },
			update: {},
			create: k
		});
	}

	console.log('✅ Seed selesai: 5 kategori default berhasil ditambahkan');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
