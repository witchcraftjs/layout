// todo move to utils

export function clampNumber(
	num: number,
	lowerLimit: number,
	upperLimit: number
): number {
	return num <= lowerLimit ? lowerLimit : num >= upperLimit ? upperLimit : num
}
