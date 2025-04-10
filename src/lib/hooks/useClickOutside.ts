import { useCallback, useEffect, useRef } from "react"

/**
 * A hook that detects clicks outside of a specified element.
 *
 * @param handler - Function to call when a click outside is detected
 * @returns A ref to attach to the element to monitor
 */
export function useClickOutside<T extends HTMLElement>(handler: () => void): React.RefObject<T> {
	const ref = useRef<T>(null)

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if(ref.current && !ref.current.contains(event.target as Node)) {
			handler()
		}
	}, [handler])

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside)

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [handleClickOutside])

	return ref as React.RefObject<T>
}
