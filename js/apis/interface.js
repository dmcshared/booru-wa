import { TagSet } from '../TagSet.js';

export class ImageAPIInstance {
	/**
	 * @returns { string[]}
	 */
	getImageURLs() {}
}

export class ImageAPI {
	/**
	 * @returns {Promise<ImageAPIInstance[]>}
	 */
	getPosts(
		tags = new TagSet(),
		count = 10,
		page = 0,
		alwaysTags = new TagSet()
	) {}

	/**
	 * @returns {Promise<TagSet>}
	 */
	getTags(tag = '') {}
}
