<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { toasts } from '$lib/stores/toast';
	import { X, CheckCircle2, AlertCircle, Info } from 'lucide-svelte';

	const iconMap = {
		success: CheckCircle2,
		error: AlertCircle,
		info: Info
	};

	const colorMap = {
		success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
		error: 'bg-rose-50 border-rose-200 text-rose-800',
		info: 'bg-blue-50 border-blue-200 text-blue-800'
	};
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
	{#each $toasts as toast (toast.id)}
		<div
			in:fly={{ x: 100, duration: 300 }}
			out:fade={{ duration: 200 }}
			class="flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg {colorMap[toast.type]}"
		>
			<svelte:component this={iconMap[toast.type]} size={18} />
			<p class="text-sm font-medium flex-1">{toast.message}</p>
			<button
				on:click={() => toasts.remove(toast.id)}
				class="opacity-60 hover:opacity-100 transition-opacity"
			>
				<X size={14} />
			</button>
		</div>
	{/each}
</div>
