/**
 * Format a Date to locale-friendly string (e.g., "20 Agustus 2026")
 */
export function formatDate(date: Date | string): string {
	const d = new Date(date);
	return d.toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
}

/**
 * Format date to short format (e.g., "20 Agu")
 */
export function formatDateShort(date: Date | string): string {
	const d = new Date(date);
	return d.toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'short'
	});
}

/**
 * Format date to YYYY-MM-DD for input fields
 */
export function formatDateInput(date: Date | string): string {
	const d = new Date(date);
	return d.toISOString().split('T')[0];
}

/**
 * Calculate duration in minutes between two time strings (HH:MM)
 */
export function calculateDuration(jamMulai: string, jamSelesai: string): number {
	const [startH, startM] = jamMulai.split(':').map(Number);
	const [endH, endM] = jamSelesai.split(':').map(Number);
	const startMinutes = startH * 60 + startM;
	const endMinutes = endH * 60 + endM;
	return endMinutes - startMinutes;
}

/**
 * Format duration in minutes to human-readable string (e.g., "2j 30m")
 */
export function formatDuration(minutes: number): string {
	if (minutes <= 0) return '0m';
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (hours === 0) return `${mins}m`;
	if (mins === 0) return `${hours}j`;
	return `${hours}j ${mins}m`;
}

/**
 * Get status badge color classes
 */
export function getStatusColor(status: string): { bg: string; text: string } {
	switch (status) {
		case 'Done':
			return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
		case 'In Progress':
			return { bg: 'bg-amber-100', text: 'text-amber-700' };
		case 'Pending':
			return { bg: 'bg-rose-100', text: 'text-rose-700' };
		default:
			return { bg: 'bg-gray-100', text: 'text-gray-700' };
	}
}

/**
 * Get greeting based on current hour
 */
export function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 11) return 'Selamat Pagi Acaszzz';
	if (hour < 15) return 'Selamat Siang Acaszzz';
	if (hour < 18) return 'Selamat Sore Acaszzz';
	return 'Selamat Malam Acaszzz';
}

/**
 * Get start and end of today
 */
export function getTodayRange(): { start: Date; end: Date } {
	const now = new Date();
	const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
	return { start, end };
}

/**
 * Get start and end of current week (Monday to Sunday)
 */
export function getWeekRange(): { start: Date; end: Date } {
	const now = new Date();
	const day = now.getDay();
	const diff = day === 0 ? 6 : day - 1; // Monday = 0
	const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
	const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6, 23, 59, 59, 999);
	return { start, end };
}

/**
 * Status options
 */
export const STATUS_OPTIONS = ['Done', 'In Progress', 'Pending'] as const;

/**
 * Chart colors (soft pastel)
 */
export const CHART_COLORS = [
	'rgba(59, 130, 246, 0.7)',   // blue
	'rgba(139, 92, 246, 0.7)',   // violet
	'rgba(245, 158, 11, 0.7)',   // amber
	'rgba(16, 185, 129, 0.7)',   // emerald
	'rgba(107, 114, 128, 0.7)',  // gray
	'rgba(236, 72, 153, 0.7)',   // pink
	'rgba(14, 165, 233, 0.7)',   // sky
	'rgba(168, 85, 247, 0.7)',   // purple
];

export const CHART_COLORS_SOLID = [
	'#3b82f6', '#8b5cf6', '#f59e0b', '#10b981',
	'#6b7280', '#ec4899', '#0ea5e9', '#a855f7',
];
