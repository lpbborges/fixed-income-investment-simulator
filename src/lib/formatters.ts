/**
 * Format a number as Brazilian currency (BRL)
 */
export function formatCurrency(value: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
}

/**
 * Format a number as percentage
 */
export function formatPercent(value: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "percent",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value / 100);
}

/**
 * Format a date as Brazilian date
 */
export function formatDate(dateString?: string) {
	if (!dateString) return "";

	const parts = dateString.split("/");
	if (parts.length !== 3) return dateString;

	const day = parts[0];
	const month = parts[1];
	const year = parts[2];

	return `${day}/${month}/${year}`;
}
