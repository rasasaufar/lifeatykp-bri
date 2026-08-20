<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft, Save, Clock } from 'lucide-svelte';
	import { addToast } from '$lib/stores/toast';
	import { STATUS_OPTIONS } from '$lib/utils';

	export let data;
	export let form;

	let isSubmitting = false;

	let tanggal = form?.tanggal || new Date().toISOString().split('T')[0];
	let jam_mulai = form?.jam_mulai || '08:00';
	let kategori = form?.kategori || (data.kategoriList[0]?.nama || '');
	let deskripsi = form?.deskripsi || '';
	let status = form?.status || 'Done';
	let catatan = form?.catatan || '';

	$: if (form?.error) {
		addToast(form.error, 'error');
	}

	function handleSuccess() {
		addToast('Log berhasil ditambahkan!', 'success');
	}
</script>

<svelte:head>
	<title>Tambah Log — Work Log</title>
</svelte:head>

<div class="max-w-2xl space-y-6">
	<!-- Header -->
	<div class="mb-6">
		<a href="/logs" class="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4">
			<ArrowLeft size={16} />
			Kembali
		</a>
		<h1 class="text-2xl font-bold text-slate-800">Tambah Log Baru</h1>
		<p class="text-sm text-slate-500 mt-1">Catat aktivitas pekerjaan Anda.</p>
	</div>

	<!-- Form -->
	<form
		method="POST"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}}
		class="card p-6 space-y-5"
	>
		<!-- Date & Time -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div>
				<label for="tanggal" class="label-text">Tanggal</label>
				<input type="date" id="tanggal" name="tanggal" bind:value={tanggal} class="input-field" required />
			</div>
			<div>
				<label for="jam_mulai" class="label-text">Waktu Mulai</label>
				<input type="time" id="jam_mulai" name="jam_mulai" bind:value={jam_mulai} class="input-field" required />
			</div>
		</div>

		<!-- Category & Status -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div>
				<label for="kategori" class="label-text">Kategori</label>
				<select id="kategori" name="kategori" bind:value={kategori} class="input-field" required>
					{#each data.kategoriList as k}
						<option value={k.nama}>{k.nama}</option>
					{/each}
				</select>
			</div>
			<div>
				<label class="label-text">Status</label>
				<div class="flex gap-2 mt-0.5">
					{#each STATUS_OPTIONS as s}
						<label class="flex-1">
							<input type="radio" name="status" value={s} bind:group={status} class="peer sr-only" />
							<div class="text-center px-3 py-2.5 text-sm font-medium rounded-xl border cursor-pointer transition-all duration-200
								peer-checked:bg-indigo-50 peer-checked:border-indigo-300 peer-checked:text-indigo-700
								border-gray-200 text-slate-500 hover:bg-gray-50">
								{s}
							</div>
						</label>
					{/each}
				</div>
			</div>
		</div>

		<!-- Description -->
		<div>
			<label for="deskripsi" class="label-text">Deskripsi</label>
			<input
				type="text"
				id="deskripsi"
				name="deskripsi"
				bind:value={deskripsi}
				placeholder="Apa yang Anda kerjakan?"
				class="input-field"
				required
			/>
		</div>

		<!-- Notes -->
		<div>
			<label for="catatan" class="label-text">
				Catatan <span class="text-slate-400 font-normal">(opsional)</span>
			</label>
			<textarea
				id="catatan"
				name="catatan"
				bind:value={catatan}
				rows="3"
				placeholder="Detail tambahan, catatan, referensi..."
				class="input-field resize-none"
			></textarea>
		</div>

		<!-- Actions -->
		<div class="flex justify-end gap-3 pt-2">
			<a href="/logs" class="btn-secondary" class:opacity-50={isSubmitting}>
				Batal
			</a>
			<button type="submit" class="btn-primary min-w-[120px] justify-center" disabled={isSubmitting}>
				{#if isSubmitting}
					<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
					Menyimpan...
				{:else}
					<Save size={16} />
					Simpan Log
				{/if}
			</button>
		</div>
	</form>
</div>
