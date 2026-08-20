<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let activeDays: number[] = [];

	let currentDate = new Date();
	let year = currentDate.getFullYear();
	let month = currentDate.getMonth();

	const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
	const monthNames = [
		'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
		'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
	];

	$: daysInMonth = new Date(year, month + 1, 0).getDate();
	$: firstDayOfMonth = (() => {
		const d = new Date(year, month, 1).getDay();
		return d === 0 ? 6 : d - 1; // Monday = 0
	})();

	$: today = (() => {
		const now = new Date();
		if (now.getFullYear() === year && now.getMonth() === month) {
			return now.getDate();
		}
		return -1;
	})();

	$: days = (() => {
		const result: (number | null)[] = [];
		for (let i = 0; i < firstDayOfMonth; i++) result.push(null);
		for (let i = 1; i <= daysInMonth; i++) result.push(i);
		return result;
	})();

	function prevMonth() {
		if (month === 0) {
			month = 11;
			year--;
		} else {
			month--;
		}
	}

	function nextMonth() {
		if (month === 11) {
			month = 0;
			year++;
		} else {
			month++;
		}
	}
</script>

<div class="card p-4">
	<div class="flex items-center justify-between mb-4">
		<button on:click={prevMonth} class="p-1 hover:bg-gray-100 rounded-lg transition-colors">
			<ChevronLeft size={16} class="text-slate-500" />
		</button>
		<h3 class="text-sm font-semibold text-slate-700">
			{monthNames[month]} {year}
		</h3>
		<button on:click={nextMonth} class="p-1 hover:bg-gray-100 rounded-lg transition-colors">
			<ChevronRight size={16} class="text-slate-500" />
		</button>
	</div>

	<div class="grid grid-cols-7 gap-1">
		{#each dayNames as name}
			<div class="text-center text-xs font-medium text-slate-400 py-1">{name}</div>
		{/each}

		{#each days as day}
			{#if day === null}
				<div></div>
			{:else}
				<div class="relative flex items-center justify-center">
					<span
						class="w-8 h-8 flex items-center justify-center text-xs rounded-lg transition-colors
							{day === today ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 hover:bg-gray-50'}"
					>
						{day}
					</span>
					{#if activeDays.includes(day)}
						<span class="absolute bottom-0.5 w-1 h-1 rounded-full {day === today ? 'bg-white' : 'bg-indigo-500'}"></span>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
</div>
