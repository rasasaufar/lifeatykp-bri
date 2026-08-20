<script lang="ts">
	import { fade } from 'svelte/transition';
	import { AlertTriangle } from 'lucide-svelte';

	export let show = false;
	export let title = 'Konfirmasi';
	export let message = 'Apakah Anda yakin?';
	export let confirmText = 'Hapus';
	export let cancelText = 'Batal';
	export let onConfirm: () => void = () => {};
	export let onCancel: () => void = () => {};

	function handleConfirm() {
		onConfirm();
		show = false;
	}

	function handleCancel() {
		onCancel();
		show = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') handleCancel();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		transition:fade={{ duration: 150 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
		on:click|self={handleCancel}
	>
		<div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-100">
			<div class="flex items-start gap-4">
				<div class="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
					<AlertTriangle size={20} class="text-rose-600" />
				</div>
				<div class="flex-1">
					<h3 class="text-lg font-semibold text-slate-800">{title}</h3>
					<p class="mt-1 text-sm text-slate-500">{message}</p>
				</div>
			</div>
			<div class="flex justify-end gap-3 mt-6">
				<button on:click={handleCancel} class="btn-secondary">
					{cancelText}
				</button>
				<button on:click={handleConfirm} class="btn-danger">
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}
