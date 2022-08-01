/**
 * @extends {Set<string>}
 */
export class TagSet extends Set {
	toJSON() {
		return [...this];
	}
}
