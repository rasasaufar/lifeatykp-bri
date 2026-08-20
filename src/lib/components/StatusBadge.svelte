<script lang="ts">
	import { getStatusColor } from '$lib/utils';

	export let status: string;

	$: colors = getStatusColor(status);
</script>

<span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold {colors.bg} {colors.text}">
	{status}
</span>
