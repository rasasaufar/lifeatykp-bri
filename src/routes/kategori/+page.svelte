<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Plus, Pencil, Trash2, X, Check } from 'lucide-svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { addToast } from '$lib/stores/toast';

	export let data;
	export let form;

	let showDeleteConfirm = false;
	let deleteId: number | null = null;
	let deleteName = '';
	let editingId: number | null = null;
	let editNama = '';
	let editWarna = '';

	$: if (form?.success) {
		addToast(form.message || 'Berhasil!', 'success');
		editingId = null;
	}
	$: if (form?.error) {
		addToast(form.error, 'error');
	}

	function startEdit(k: any) {
		editingId = k.id;
		editNama = k.nama;
		editWarna = k.warna;
	}

	function cancelEdit() {
		editingId = null;
	}

	function confirmDelete(id: number, nama: string) {
		deleteId = id;
		deleteName = nama;
		showDeleteConfirm = true;
	}

	let deleteForm: HTMLFormElement;

	function handleDeleteConfirm() {
		if (deleteForm) {
			deleteForm.requestSubmit();
		}
	}
</script>

<svelte:head>
	<title>Kategori — Work Log</title>
</svelte:head>

<ConfirmDialog
	bind:show={showDeleteConfirm}
	title="Hapus Kategori"
	message="Apakah Anda yakin ingin menghapus kategori '{deleteName}'? Log yang menggunakan kategori ini tidak akan terpengaruh."
	onConfirm={handleDeleteConfirm}
/>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-slate-800">Kategori</h1>
		<p class="text-sm text-slate-500 mt-1">Kelola kategori pekerjaan Anda.</p>
	</div>

	<!-- Add Category Form -->
	<div class="card p-5">
		<h2 class="text-sm font-semibold text-slate-700 mb-4">Tambah Kategori Baru</h2>
		<form method="POST" action="?/create" use:enhance class="flex flex-col sm:flex-row gap-3">
			<div class="flex-1">
				<input
					type="text"
					name="nama"
					placeholder="Nama kategori..."
					class="input-field"
					required
					value={form?.nama || ''}
				/>
			</div>
			<div class="flex items-center gap-3">
				<div class="flex items-center gap-2">
					<label for="warna" class="text-sm text-slate-500 whitespace-nowrap">Warna:</label>
					<input
						type="color"
						name="warna"
						id="warna"
						value={form?.warna || '#6b7280'}
						class="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
					/>
				</div>
				<button type="submit" class="btn-primary whitespace-nowrap">
					<Plus size={16} />
					Tambah
				</button>
			</div>
		</form>
	</div>

	<!-- Category List -->
	<div class="card divide-y divide-gray-100">
		{#if data.kategoriList.length === 0}
			<div class="p-8 text-center">
				<p class="text-sm text-slate-400">Belum ada kategori.</p>
			</div>
		{:else}
			{#each data.kategoriList as kategori (kategori.id)}
				<div class="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
					{#if editingId === kategori.id}
						<!-- Edit Mode -->
						<form method="POST" action="?/update" use:enhance class="flex items-center gap-3 flex-1">
							<input type="hidden" name="id" value={kategori.id} />
							<input type="color" name="warna" bind:value={editWarna} class="w-8 h-8 rounded-lg cursor-pointer border border-gray-200" />
							<input
								type="text"
								name="nama"
								bind:value={editNama}
								class="input-field flex-1"
								required
							/>
							<button type="submit" class="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors">
								<Check size={16} />
							</button>
							<button type="button" on:click={cancelEdit} class="p-2 hover:bg-gray-100 rounded-lg text-slate-400 transition-colors">
								<X size={16} />
							</button>
						</form>
					{:else}
						<!-- View Mode -->
						<div class="w-4 h-4 rounded-full flex-shrink-0" style="background-color: {kategori.warna}"></div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium text-slate-700">{kategori.nama}</p>
							<p class="text-xs text-slate-400">
								{data.logCounts[kategori.nama] || 0} log
							</p>
						</div>
						<div class="flex items-center gap-1">
							<button
								on:click={() => startEdit(kategori)}
								class="p-2 hover:bg-gray-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
							>
								<Pencil size={14} />
							</button>
							<button
								on:click={() => confirmDelete(kategori.id, kategori.nama)}
								class="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
							>
								<Trash2 size={14} />
							</button>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>

	<!-- Hidden delete form -->
	<form
		bind:this={deleteForm}
		method="POST"
		action="?/delete"
		use:enhance
		class="hidden"
	>
		<input type="hidden" name="id" value={deleteId} />
	</form>
</div>
