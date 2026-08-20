import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: number;
	message: string;
	type: ToastType;
}

let nextId = 0;

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	function add(message: string, type: ToastType = 'info') {
		const id = nextId++;
		update((toasts) => [...toasts, { id, message, type }]);

		// Auto-dismiss after 3 seconds
		setTimeout(() => {
			remove(id);
		}, 3000);
	}

	function remove(id: number) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	return {
		subscribe,
		add,
		remove
	};
}

export const toasts = createToastStore();

/**
 * Shorthand to add a toast
 */
export function addToast(message: string, type: ToastType = 'info') {
	toasts.add(message, type);
}
