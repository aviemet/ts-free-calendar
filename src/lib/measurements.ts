export const rem = (pixels: number): string => {
	const baseFontSize = 16
	return `${pixels / baseFontSize}rem`
}
