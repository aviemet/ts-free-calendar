/**
 * A collection that maintains items in sorted order using lazy sorting.
 *
 * This class provides array-like functionality while ensuring items are sorted
 * according to a provided comparison function. It defers sorting until the
 * first read operation, making it efficient for batch insertions.
 *
 * @template T The type of elements in the array
 *
 * @example
 * ```typescript
 * const sorted = new SortedArray<number>((a, b) => a - b);
 * sorted.push(3);
 * sorted.push(1);
 * sorted.push(2);
 *
 * // Items are sorted only when accessed
 * for (const item of sorted) {
 *   console.log(item); // Outputs: 1, 2, 3
 * }
 * ```
 *
 * @implements {Iterable<T>}
 */
export class SortedArray<T> implements Iterable<T> {
	private items: T[] = []
	private compareFn: (a: T, b: T) => number
	private isDirty = false

	/**
	 * Creates a default comparison function for basic comparable types.
	 * Works with numbers and strings using their natural ordering.
	 *
	 * @example
	 * ```typescript
	 * // For numbers
	 * const numbers = new SortedArray(SortedArray.defaultCompare);
	 * numbers.push(3, 1, 2); // Will sort as [1, 2, 3]
	 *
	 * // For strings
	 * const strings = new SortedArray(SortedArray.defaultCompare);
	 * strings.push("c", "a", "b"); // Will sort as ["a", "b", "c"]
	 * ```
	 */
	static defaultCompare<U extends string | number>(a: U, b: U): number {
		if(a < b) return - 1
		if(a > b) return 1
		return 0
	}

	constructor(compareFn: (a: T, b: T) => number = SortedArray.defaultCompare as (a: T, b: T) => number) {
		this.compareFn = compareFn
	}

	private ensureSorted(): void {
		if(!this.isDirty) return

		this.items.sort(this.compareFn)
		this.isDirty = false
	}

	push(item: T): number {
		this.items.push(item)
		this.isDirty = true

		return this.items.length
	}

	get(index: number): T {
		this.ensureSorted()

		return this.items[index]
	}

	// Make the class iterable
	[Symbol.iterator](): Iterator<T> {
		this.ensureSorted()

		return this.items[Symbol.iterator]()
	}

	// Array-like methods
	map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[] {
		this.ensureSorted()

		return this.items.map(callbackfn)
	}

	get length(): number {
		return this.items.length
	}

	filter(predicate: (value: T, index: number, array: T[]) => boolean): T[] {
		this.ensureSorted()

		return this.items.filter(predicate)
	}

	forEach(callbackfn: (value: T, index: number, array: T[]) => void): void {
		this.ensureSorted()

		this.items.forEach(callbackfn)
	}
}
