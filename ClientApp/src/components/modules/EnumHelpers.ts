export function formatCasedString(format: string) {
	var spaced = format
		.replaceAll(/([a-z])([A-Z])/g, "$1 $2")
		.replaceAll(/([A-Z])([A-Z][a-z])/g, "$1 $2");
	return spaced[0].toUpperCase() + spaced.substring(1)
}

export interface IEnumerable {
	[id: number]: string;
}

export function enumMap<T>(src: IEnumerable, fn: (key: number) => T): T[] {
	const result: T[] = [];
	for (let value in src) {
		const key = Number(value);
		if (!isNaN(key))
			result.push(fn(key));
	}
	return result;
}