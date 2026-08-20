<script context="module">
	import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
	Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		ClipboardList,
		Calendar,
		Clock,
		TrendingUp,
		ArrowRight,
		Plus
	} from 'lucide-svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import CalendarWidget from '$lib/components/CalendarWidget.svelte';

	export let data;

	let pieCanvas: HTMLCanvasElement;
	let barCanvas: HTMLCanvasElement;
	let pieChart: Chart | null = null;
	let barChart: Chart | null = null;

	const statusColors: Record<string, string> = {
		Done: 'rgba(16, 185, 129, 0.7)',
		'In Progress': 'rgba(245, 158, 11, 0.7)',
		Pending: 'rgba(244, 63, 94, 0.7)'
	};

	const statusBorderColors: Record<string, string> = {
		Done: '#10b981',
		'In Progress': '#f59e0b',
		Pending: '#f43f5e'
	};

	onMount(() => {
		let animationFrameId: number;

		animationFrameId = requestAnimationFrame(() => {
			// Pie chart — by kategori
			if (pieCanvas && data.kategoriStats.length > 0) {
				pieChart = new Chart(pieCanvas, {
					type: 'doughnut',
					data: {
						labels: data.kategoriStats.map((k: any) => k.nama),
						datasets: [{
							data: data.kategoriStats.map((k: any) => k.count),
							backgroundColor: data.kategoriStats.map((k: any) => k.warna + 'cc'),
							borderColor: data.kategoriStats.map((k: any) => k.warna),
							borderWidth: 2
						}]
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: {
								position: 'bottom',
								labels: {
									padding: 16,
									usePointStyle: true,
									pointStyleWidth: 8,
									font: { family: 'Inter', size: 12 }
								}
							}
						},
						cutout: '65%',
						animation: false
					}
				});
			}

			// Bar chart — by status
			if (barCanvas && data.statusStats.length > 0) {
				barChart = new Chart(barCanvas, {
					type: 'bar',
					data: {
						labels: data.statusStats.map((s: any) => s.status),
						datasets: [{
							label: 'Jumlah',
							data: data.statusStats.map((s: any) => s.count),
							backgroundColor: data.statusStats.map((s: any) => statusColors[s.status] || 'rgba(107,114,128,0.7)'),
							borderColor: data.statusStats.map((s: any) => statusBorderColors[s.status] || '#6b7280'),
							borderWidth: 2,
							borderRadius: 8,
							barPercentage: 0.6
						}]
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: { display: false }
						},
						scales: {
							y: {
								beginAtZero: true,
								ticks: {
									stepSize: 1,
									font: { family: 'Inter', size: 11 }
								},
								grid: { color: 'rgba(0,0,0,0.04)' }
							},
							x: {
								ticks: { font: { family: 'Inter', size: 12 } },
								grid: { display: false }
							}
						},
						animation: false
					}
				});
			}
		});

		return () => {
			if (animationFrameId) cancelAnimationFrame(animationFrameId);
			pieChart?.destroy();
			barChart?.destroy();
		};
	});
</script>

<svelte:head>
	<title>Dashboard — Work Log</title>
</svelte:head>

<div class="space-y-6">
	<!-- Greeting -->
	<div>
		<h1 class="text-2xl font-bold text-slate-800">{data.greeting} 👋</h1>
		<p class="text-sm text-slate-500 mt-1">Berikut ringkasan aktivitas kerja Anda.</p>
	</div>

	<!-- Stat Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<div class="card p-5">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Log Hari Ini</p>
					<p class="text-3xl font-bold text-slate-800 mt-1">{data.todayTotal}</p>
				</div>
				<div class="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
					<ClipboardList size={20} class="text-indigo-600" />
				</div>
			</div>
		</div>

		<div class="card p-5">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Log Minggu Ini</p>
					<p class="text-3xl font-bold text-slate-800 mt-1">{data.weekTotal}</p>
				</div>
				<div class="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
					<TrendingUp size={20} class="text-emerald-600" />
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Today's Logs -->
		<div class="lg:col-span-2 space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-slate-800">Log Hari Ini</h2>
				<a href="/logs/new" class="btn-primary text-xs py-2 px-3">
					<Plus size={14} />
					Tambah
				</a>
			</div>

			{#if data.todayLogs.length === 0}
				<div class="card p-8 text-center">
					<div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
						<ClipboardList size={24} class="text-gray-300" />
					</div>
					<p class="text-sm text-slate-400">Belum ada log hari ini.</p>
					<a href="/logs/new" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2 inline-block">
						Tambah log pertama →
					</a>
				</div>
			{:else}
				<div class="space-y-2">
					{#each data.todayLogs as log}
						<a href="/logs/{log.id}" class="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow duration-200 group block">
							<div class="flex-shrink-0 text-center">
								<p class="text-xs text-slate-400">{log.jam_mulai}</p>
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-slate-700 truncate group-hover:text-indigo-600 transition-colors">{log.deskripsi}</p>
								<div class="flex items-center gap-2 mt-1">
									<span class="text-xs text-slate-400">{log.kategori}</span>
								</div>
							</div>
							<StatusBadge status={log.status} />
							<ArrowRight size={14} class="text-slate-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
						</a>
					{/each}
				</div>
			{/if}

			<a href="/logs" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1">
				Lihat semua log
				<ArrowRight size={14} />
			</a>
		</div>

		<!-- Right Sidebar -->
		<div class="space-y-6">
			<!-- Calendar -->
			<CalendarWidget activeDays={data.activeDays} />

			<!-- Pie Chart -->
			{#if data.kategoriStats.length > 0}
				<div class="card p-4">
					<h3 class="text-sm font-semibold text-slate-700 mb-3">Per Kategori (Minggu Ini)</h3>
					<div class="relative w-full h-48">
						<canvas bind:this={pieCanvas}></canvas>
					</div>
				</div>
			{/if}

			<!-- Bar Chart -->
			{#if data.statusStats.length > 0}
				<div class="card p-4">
					<h3 class="text-sm font-semibold text-slate-700 mb-3">Per Status (Minggu Ini)</h3>
					<div class="relative w-full h-48">
						<canvas bind:this={barCanvas}></canvas>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
