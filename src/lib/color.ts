// Module-level cache for memoization
const contrastCache = new Map<string, string>()

function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
	if(!hex || !hex.startsWith("#")) {
		return null
	}
	let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b
	})

	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result
		? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
		}
		: null
}

/**
 * Parses an rgb color string (rgb(r, g, b)) into RGB values.
 *
 * @param rgbStr - The rgb color string.
 * @returns An object { r, g, b } or null if parsing fails.
 */
function rgbStringToRgb(rgbStr: string): { r: number, g: number, b: number } | null {
	if(!rgbStr || !rgbStr.startsWith("rgb(")) {
		return null
	}
	const result = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i.exec(rgbStr)
	if(!result) return null

	const r = parseInt(result[1], 10)
	const g = parseInt(result[2], 10)
	const b = parseInt(result[3], 10)

	if(isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
		return null // Invalid RGB values
	}

	return { r, g, b }
}


/**
 * Calculates the contrasting text color (black or white) for a given background color.
 * Handles hex (#RRGGBB, #RGB) and rgb(r, g, b) color formats.
 * Defaults to black for unparsable colors or CSS variables.
 * Uses a simplified brightness calculation.
 *
 * @param bgColor - The background color string.
 * @returns "#000000" (black) or "#ffffff" (white).
 */
export function getContrastingTextColor(bgColor: string): string {
	// Check cache first
	if(contrastCache.has(bgColor)) {
		return contrastCache.get(bgColor)!
	}

	// Default to black for CSS variables or invalid/empty colors
	if(!bgColor || bgColor.startsWith("var(")) {
		const fallbackColor = "#000000"
		contrastCache.set(bgColor, fallbackColor) // Cache the fallback for var() etc.
		return fallbackColor
	}

	let rgb: { r: number, g: number, b: number } | null = null

	if(bgColor.startsWith("#")) {
		rgb = hexToRgb(bgColor)
	} else if(bgColor.startsWith("rgb(")) {
		rgb = rgbStringToRgb(bgColor)
	}

	if(!rgb) {
		const fallbackColor = "#000000"
		contrastCache.set(bgColor, fallbackColor) // Cache the fallback for unparsable
		return fallbackColor // Fallback for unparsable formats
	}

	// Calculate perceived brightness using the HSP color model equation (simplified)
	// Alternative: (0.299*R + 0.587*G + 0.114*B)
	const brightness = Math.sqrt(
		0.299 * (rgb.r / 255) ** 2 +
    0.587 * (rgb.g / 255) ** 2 +
    0.114 * (rgb.b / 255) ** 2
	)

	// WCAG recommends a contrast ratio, but a brightness threshold is simpler.
	// Threshold value is somewhat subjective, 0.5 is common for normalized brightness.
	// Adjust this threshold (e.g., 0.6 or 0.7) if contrast feels off.
	const contrastingColor = brightness > 0.5 ? "#000000" : "#ffffff"

	// Store result in cache before returning
	contrastCache.set(bgColor, contrastingColor)

	return contrastingColor
}

/**
 * Clears the contrast color cache. Primarily useful for testing or specific scenarios
 * where cache invalidation might be needed (though unlikely for this use case).
 */
export function clearContrastCache(): void {
	contrastCache.clear()
}
