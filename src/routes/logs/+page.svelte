<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		Search,
		Filter,
		Download,
		ChevronLeft,
		ChevronRight,
		ArrowRight,
		Calendar,
		X
	} from 'lucide-svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import { formatDate, formatDateShort, STATUS_OPTIONS } from '$lib/utils';

	export let data;

	let search = data.filters.search;
	let kategori = data.filters.kategori;
	let status = data.filters.status;
	let dateFrom = data.filters.dateFrom;
	let dateTo = data.filters.dateTo;
	let showFilters = !!(kategori || status || dateFrom || dateTo);

	function applyFilters() {
		const params = new URLSearchParams();
		if (search) params.set('search', search);
		if (kategori) params.set('kategori', kategori);
		if (status) params.set('status', status);
		if (dateFrom) params.set('dateFrom', dateFrom);
		if (dateTo) params.set('dateTo', dateTo);
		goto(`/logs?${params.toString()}`);
	}

	function clearFilters() {
		search = '';
		kategori = '';
		status = '';
		dateFrom = '';
		dateTo = '';
		goto('/logs');
	}

	function goToPage(p: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', String(p));
		goto(`/logs?${params.toString()}`);
	}

	async function exportCSV() {
		const params = new URLSearchParams($page.url.searchParams);
		params.delete('page');
		window.location.href = `/api/logs/export?${params.toString()}`;
	}

	function handleSearchKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			applyFilters();
		}
	}
</script>

<svelte:head>
	<title>Semua Log — Work Log</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Semua Log</h1>
			<p class="text-sm text-slate-500 mt-1">{data.total} catatan ditemukan</p>
		</div>
		<div class="flex items-center gap-2">
			<button on:click={exportCSV} class="btn-secondary text-xs py-2">
				<Download size={14} />
				Export CSV
			</button>
			<a href="/logs/new" class="btn-primary text-xs py-2">
				Tambah Log
			</a>
		</div>
	</div>

	<!-- Search & Filter Bar -->
	<div class="card p-4 space-y-3">
		<div class="flex gap-3">
			<div class="relative flex-1">
				<Search size={16} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
				<input
					type="text"
					bind:value={search}
					on:keydown={handleSearchKeydown}
					placeholder="Cari deskripsi..."
					class="input-field pl-9"
				/>
			</div>
			<button
				on:click={() => (showFilters = !showFilters)}
				class="btn-secondary text-xs py-2 {showFilters ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : ''}"
			>
				<Filter size={14} />
				Filter
			</button>
			<button on:click={applyFilters} class="btn-primary text-xs py-2">
				Cari
			</button>
		</div>

		{#if showFilters}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
				<div>
					<label class="label-text">Dari Tanggal</label>
					<input type="date" bind:value={dateFrom} class="input-field" />
				</div>
				<div>
					<label class="label-text">Sampai Tanggal</label>
					<input type="date" bind:value={dateTo} class="input-field" />
				</div>
				<div>
					<label class="label-text">Kategori</label>
					<select bind:value={kategori} class="input-field">
						<option value="">Semua</option>
						{#each data.kategoriList as k}
							<option value={k.nama}>{k.nama}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="label-text">Status</label>
					<select bind:value={status} class="input-field">
						<option value="">Semua</option>
						{#each STATUS_OPTIONS as s}
							<option value={s}>{s}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="flex justify-end">
				<button on:click={clearFilters} class="text-xs text-slate-400 hover:text-slate-600 inline-flex items-center gap-1">
					<X size={12} />
					Reset filter
				</button>
			</div>
		{/if}
	</div>

	<!-- Logs Table (desktop) / Cards (mobile) -->
	{#if data.logs.length === 0}
		<div class="card p-12 text-center">
			<p class="text-sm text-slate-400">Tidak ada log yang ditemukan.</p>
		</div>
	{:else}
		<!-- Desktop Table -->
		<div class="hidden md:block card overflow-hidden">
			<table class="w-full">
				<thead>
					<tr class="border-b border-gray-100 bg-gray-50/50">
						<th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Tanggal</th>
						<th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Waktu Mulai</th>
						<th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Deskripsi</th>
						<th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Kategori</th>
						<th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Status</th>
						<th class="px-5 py-3"></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-50">
					{#each data.logs as log}
						<tr class="hover:bg-gray-50/50 transition-colors group">
							<td class="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{formatDateShort(log.tanggal)}</td>
							<td class="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">{log.jam_mulai}</td>
							<td class="px-5 py-3.5 text-sm text-slate-700 font-medium max-w-xs truncate">{log.deskripsi}</td>
							<td class="px-5 py-3.5 text-sm text-slate-500">{log.kategori}</td>
							<td class="px-5 py-3.5"><StatusBadge status={log.status} /></td>
							<td class="px-5 py-3.5">
								<a href="/logs/{log.id}" class="text-slate-300 group-hover:text-indigo-500 transition-colors">
									<ArrowRight size={16} />
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Mobile Cards -->
		<div class="md:hidden space-y-2">
			{#each data.logs as log}
				<a href="/logs/{log.id}" class="card p-4 block hover:shadow-md transition-shadow">
					<div class="flex items-start justify-between gap-3">
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium text-slate-700 truncate">{log.deskripsi}</p>
							<div class="flex items-center gap-2 mt-1 text-xs text-slate-400">
								<span>{formatDateShort(log.tanggal)}</span>
								<span>·</span>
								<span>{log.jam_mulai}</span>
								<span>·</span>
								<span>{log.kategori}</span>
							</div>
						</div>
						<StatusBadge status={log.status} />
					</div>
				</a>
			{/each}
		</div>

		<!-- Pagination -->
		{#if data.totalPages > 1}
			<div class="flex items-center justify-between">
				<p class="text-sm text-slate-400">
					Halaman {data.page} dari {data.totalPages}
				</p>
				<div class="flex items-center gap-1">
					<button
						on:click={() => goToPage(data.page - 1)}
						disabled={data.page <= 1}
						class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
					>
						<ChevronLeft size={16} class="text-slate-600" />
					</button>

					{#each Array.from({ length: data.totalPages }, (_, i) => i + 1) as p}
						{#if p === 1 || p === data.totalPages || (p >= data.page - 1 && p <= data.page + 1)}
							<button
								on:click={() => goToPage(p)}
								class="w-9 h-9 rounded-lg text-sm font-medium transition-colors
									{p === data.page ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-gray-100'}"
							>
								{p}
							</button>
						{:else if p === data.page - 2 || p === data.page + 2}
							<span class="text-slate-300 px-1">…</span>
						{/if}
					{/each}

					<button
						on:click={() => goToPage(data.page + 1)}
						disabled={data.page >= data.totalPages}
						class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
					>
						<ChevronRight size={16} class="text-slate-600" />
					</button>
				</div>
			</div>
		{/if}
	{/if}
</div>
