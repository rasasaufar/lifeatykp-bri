<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft, Save, Clock } from 'lucide-svelte';
	import { addToast } from '$lib/stores/toast';
	import { calculateDuration, formatDuration, STATUS_OPTIONS } from '$lib/utils';

	export let data;
	export let form;

	let tanggal = form?.tanggal || new Date().toISOString().split('T')[0];
	let jam_mulai = form?.jam_mulai || '08:00';
	let jam_selesai = form?.jam_selesai || '09:00';
	let kategori = form?.kategori || (data.kategoriList[0]?.nama || '');
	let deskripsi = form?.deskripsi || '';
	let status = form?.status || 'Done';
	let catatan = form?.catatan || '';

	$: durasi = calculateDuration(jam_mulai, jam_selesai);
	$: durasiFormatted = durasi > 0 ? formatDuration(durasi) : 'Invalid';

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
	<div class="flex items-center gap-3">
		<a href="/logs" class="p-2 hover:bg-gray-100 rounded-xl transition-colors">
			<ArrowLeft size={18} class="text-slate-500" />
		</a>
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Tambah Log Baru</h1>
			<p class="text-sm text-slate-500 mt-0.5">Catat aktivitas pekerjaan Anda.</p>
		</div>
	</div>

	<form
		method="POST"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'redirect') {
					handleSuccess();
				}
				await update();
			};
		}}
		class="card p-6 space-y-5"
	>
		<!-- Date & Time -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<div>
				<label for="tanggal" class="label-text">Tanggal</label>
				<input type="date" id="tanggal" name="tanggal" bind:value={tanggal} class="input-field" required />
			</div>
			<div>
				<label for="jam_mulai" class="label-text">Jam Mulai</label>
				<input type="time" id="jam_mulai" name="jam_mulai" bind:value={jam_mulai} class="input-field" required />
			</div>
			<div>
				<label for="jam_selesai" class="label-text">Jam Selesai</label>
				<input type="time" id="jam_selesai" name="jam_selesai" bind:value={jam_selesai} class="input-field" required />
			</div>
		</div>

		<!-- Duration Preview -->
		<div class="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
			<Clock size={14} class="text-slate-400" />
			<span class="text-sm text-slate-500">Durasi:</span>
			<span class="text-sm font-semibold {durasi > 0 ? 'text-indigo-600' : 'text-rose-500'}">{durasiFormatted}</span>
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
				Catatan
				<span class="text-slate-400 font-normal">(opsional)</span>
			</label>
			<textarea
				id="catatan"
				name="catatan"
				bind:value={catatan}
				placeholder="Detail tambahan, catatan, referensi..."
				rows="3"
				class="input-field resize-none"
			></textarea>
		</div>

		<!-- Actions -->
		<div class="flex justify-end gap-3 pt-2">
			<a href="/logs" class="btn-secondary">Batal</a>
			<button type="submit" class="btn-primary">
				<Save size={16} />
				Simpan Log
			</button>
		</div>
	</form>
</div>
