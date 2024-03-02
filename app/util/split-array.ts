export function splitArray<T>(arr: T[], predicate: (value: T) => boolean): [T[], T[]] {
	return arr.reduce(
		([pass, fail], elem) =>
			predicate(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]],
		[[], []] as [T[], T[]],
	);
}
