<script lang="ts">
	import '../app.css';
	import { page, navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import Toast from '$lib/components/Toast.svelte';
	import {
		LayoutDashboard,
		PlusCircle,
		List,
		Tag,
		Menu,
		X
	} from 'lucide-svelte';

	let sidebarOpen = false;

	const navItems = [
		{ href: '/', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/logs/new', label: 'Tambah Log', icon: PlusCircle },
		{ href: '/logs', label: 'Semua Log', icon: List },
		{ href: '/kategori', label: 'Kategori', icon: Tag }
	];

	function handleKeydown(e: KeyboardEvent) {
		const target = e.target as HTMLElement;
		const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable;

		if (e.key === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey && !isInput) {
			e.preventDefault();
			goto('/logs/new');
		}
	}

	function closeSidebar() {
		sidebarOpen = false;
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<Toast />

{#if $navigating}
	<div class="fixed top-0 left-0 w-full h-1 bg-indigo-100 z-[100]">
		<div class="h-full bg-indigo-600 animate-pulse transition-all duration-300 w-full origin-left" style="animation: progress 2s infinite ease-in-out;"></div>
	</div>
{/if}

<style>
	@keyframes progress {
		0% { transform: scaleX(0); transform-origin: left; }
		50% { transform: scaleX(1); transform-origin: left; }
		50.1% { transform: scaleX(1); transform-origin: right; }
		100% { transform: scaleX(0); transform-origin: right; }
	}
</style>

<div class="min-h-screen flex">
	<!-- Mobile overlay -->
	{#if sidebarOpen}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="fixed inset-0 bg-black/30 z-40 lg:hidden"
			on:click={closeSidebar}
		></div>
	{/if}

	<!-- Sidebar -->
	<aside
		class="fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0
			{sidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
	>
		<!-- Logo -->
		<div class="px-5 pt-5 pb-4 border-b border-gray-100">
			<div class="bg-gradient-to-br from-indigo-50 via-blue-50 to-orange-50 rounded-xl p-4 text-center">
				<img src="/logo-bri-ykp.png" alt="BRI YKP" class="h-8 object-contain mx-auto" />
				<p class="text-[13px] font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mt-2.5 tracking-tight">#lifeatykpbri</p>
				<p class="text-[10px] text-slate-400 mt-0.5 tracking-wide">Personal Daily Tracker</p>
			</div>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 px-3 py-4 space-y-1">
			{#each navItems as item}
				<a
					href={item.href}
					on:click={closeSidebar}
					class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
						{$page.url.pathname === item.href
							? 'bg-indigo-50 text-indigo-700'
							: 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'}"
				>
					<svelte:component this={item.icon} size={18} />
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- Keyboard shortcut hint -->
		<div class="px-6 py-4 border-t border-gray-100">
			<p class="text-xs text-slate-400">
				Tekan <kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono font-semibold text-slate-500">N</kbd> untuk tambah log baru
			</p>
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex-1 min-w-0">
		<!-- Mobile Header -->
		<header class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 lg:hidden">
			<div class="flex items-center justify-between px-4 h-14">
				<button on:click={() => (sidebarOpen = !sidebarOpen)} class="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors">
					{#if sidebarOpen}
						<X size={20} class="text-slate-600" />
					{:else}
						<Menu size={20} class="text-slate-600" />
					{/if}
				</button>
				<span class="text-sm font-semibold text-slate-700">#lifeatykpbri</span>
				<div class="w-9"></div>
			</div>
		</header>

		<!-- Page Content -->
		<main class="p-4 sm:p-6 lg:p-8 max-w-6xl flex-1 relative">
			<slot />
		</main>
	</div>
</div>
