<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Save, Trash2, Pencil, X, Clock } from 'lucide-svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { addToast } from '$lib/stores/toast';
	import { formatDate, calculateDuration, formatDuration, STATUS_OPTIONS } from '$lib/utils';

	export let data;
	export let form;

	let editing = false;
	let showDeleteConfirm = false;

	// Form state
	let tanggal = data.log.tanggal;
	let jam_mulai = data.log.jam_mulai;
	let jam_selesai = data.log.jam_selesai;
	let kategori = data.log.kategori;
	let deskripsi = data.log.deskripsi;
	let status = data.log.status;
	let catatan = data.log.catatan || '';

	$: durasi = calculateDuration(jam_mulai, jam_selesai);
	$: durasiFormatted = durasi > 0 ? formatDuration(durasi) : 'Invalid';

	$: if (form?.success) {
		addToast(form.message || 'Berhasil!', 'success');
		editing = false;
	}
	$: if (form?.error) {
		addToast(form.error, 'error');
	}

	function startEdit() {
		editing = true;
	}

	function cancelEdit() {
		editing = false;
		// Reset to original values
		tanggal = data.log.tanggal;
		jam_mulai = data.log.jam_mulai;
		jam_selesai = data.log.jam_selesai;
		kategori = data.log.kategori;
		deskripsi = data.log.deskripsi;
		status = data.log.status;
		catatan = data.log.catatan || '';
	}

	let deleteForm: HTMLFormElement;

	function handleDeleteConfirm() {
		addToast('Log berhasil dihapus', 'success');
		deleteForm.requestSubmit();
	}
</script>

<svelte:head>
	<title>Detail Log — Work Log</title>
</svelte:head>

<ConfirmDialog
	bind:show={showDeleteConfirm}
	title="Hapus Log"
	message="Apakah Anda yakin ingin menghapus log ini? Tindakan ini tidak dapat dibatalkan."
	onConfirm={handleDeleteConfirm}
/>

<div class="max-w-2xl space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<a href="/logs" class="p-2 hover:bg-gray-100 rounded-xl transition-colors">
				<ArrowLeft size={18} class="text-slate-500" />
			</a>
			<div>
				<h1 class="text-2xl font-bold text-slate-800">
					{#if editing}Edit Log{:else}Detail Log{/if}
				</h1>
				<p class="text-sm text-slate-500 mt-0.5">{formatDate(data.log.tanggal)}</p>
			</div>
		</div>
		{#if !editing}
			<div class="flex items-center gap-2">
				<button on:click={startEdit} class="btn-secondary text-xs py-2">
					<Pencil size={14} />
					Edit
				</button>
				<button on:click={() => (showDeleteConfirm = true)} class="btn-danger text-xs py-2">
					<Trash2 size={14} />
					Hapus
				</button>
			</div>
		{/if}
	</div>

	{#if editing}
		<!-- Edit Form -->
		<form
			method="POST"
			action="?/update"
			use:enhance
			class="card p-6 space-y-5"
		>
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

			<div class="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
				<Clock size={14} class="text-slate-400" />
				<span class="text-sm text-slate-500">Durasi:</span>
				<span class="text-sm font-semibold {durasi > 0 ? 'text-indigo-600' : 'text-rose-500'}">{durasiFormatted}</span>
			</div>

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

			<div>
				<label for="deskripsi" class="label-text">Deskripsi</label>
				<input type="text" id="deskripsi" name="deskripsi" bind:value={deskripsi} class="input-field" required />
			</div>

			<div>
				<label for="catatan" class="label-text">
					Catatan <span class="text-slate-400 font-normal">(opsional)</span>
				</label>
				<textarea id="catatan" name="catatan" bind:value={catatan} rows="3" class="input-field resize-none"></textarea>
			</div>

			<div class="flex justify-end gap-3 pt-2">
				<button type="button" on:click={cancelEdit} class="btn-secondary">
					<X size={16} />
					Batal
				</button>
				<button type="submit" class="btn-primary">
					<Save size={16} />
					Simpan
				</button>
			</div>
		</form>
	{:else}
		<!-- Detail View -->
		<div class="card p-6 space-y-6">
			<div class="flex items-start justify-between">
				<div>
					<h2 class="text-lg font-semibold text-slate-800">{data.log.deskripsi}</h2>
					<div class="flex items-center gap-3 mt-2">
						<StatusBadge status={data.log.status} />
						<span class="text-sm text-slate-400">{data.log.kategori}</span>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
				<div class="bg-gray-50 rounded-xl p-3">
					<p class="text-xs text-slate-400 mb-1">Tanggal</p>
					<p class="text-sm font-medium text-slate-700">{formatDate(data.log.tanggal)}</p>
				</div>
				<div class="bg-gray-50 rounded-xl p-3">
					<p class="text-xs text-slate-400 mb-1">Jam Mulai</p>
					<p class="text-sm font-medium text-slate-700">{data.log.jam_mulai}</p>
				</div>
				<div class="bg-gray-50 rounded-xl p-3">
					<p class="text-xs text-slate-400 mb-1">Jam Selesai</p>
					<p class="text-sm font-medium text-slate-700">{data.log.jam_selesai}</p>
				</div>
				<div class="bg-gray-50 rounded-xl p-3">
					<p class="text-xs text-slate-400 mb-1">Durasi</p>
					<p class="text-sm font-semibold text-indigo-600">
						{formatDuration(calculateDuration(data.log.jam_mulai, data.log.jam_selesai))}
					</p>
				</div>
			</div>

			{#if data.log.catatan}
				<div>
					<p class="text-xs text-slate-400 mb-2 uppercase tracking-wide font-medium">Catatan</p>
					<div class="bg-gray-50 rounded-xl p-4">
						<p class="text-sm text-slate-600 whitespace-pre-wrap">{data.log.catatan}</p>
					</div>
				</div>
			{/if}

			<div class="pt-2 border-t border-gray-100">
				<p class="text-xs text-slate-300">Dibuat: {new Date(data.log.createdAt).toLocaleString('id-ID')}</p>
			</div>
		</div>
	{/if}

	<!-- Hidden delete form -->
	<form
		bind:this={deleteForm}
		method="POST"
		action="?/delete"
		use:enhance={() => {
			return async ({ result, update }) => {
				await update();
			};
		}}
		class="hidden"
	>
	</form>
</div>
