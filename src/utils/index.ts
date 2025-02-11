export function formatDateString(dt: string | undefined): string {
	if (!dt) return "";
	const date = new Date(dt);
	if (typeof date.getMonth !== "function") return "";
	const formatter = new Intl.DateTimeFormat("nb-NO", {
		year: "2-digit",
		month: "2-digit",
		day: "2-digit",
	});
	return formatter.format(date);
}

export function formatDateLegend(dt: Date): string {
	const hr = dt.getHours().toString();
	return hr.length > 1 ? hr : "0" + hr;
}

export function isTruthy<T>(
	value: T | undefined | null | false | "" | 0,
): value is T {
	return !!value;
}

export function multiplyNumberValues<T extends Record<string, any>>(
	obj: T,
	factor: number,
): T {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [
			key,
			typeof value === "number" ? value * factor : value,
		]),
	) as T;
}
