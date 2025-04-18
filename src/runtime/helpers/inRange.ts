export function inRange(coord: number, lowerLimit: number, upperLimit: number, inclusive = true): boolean {
	return inclusive
		? coord >= lowerLimit && coord <= upperLimit
		: coord > lowerLimit && coord < upperLimit
}
