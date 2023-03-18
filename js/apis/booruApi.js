import { TagSet } from '../TagSet.js';
import { ImageAPI, ImageAPIInstance } from './interface.js';

class BooruEntryRaw {
	preview_url = '';
	sample_url = '';
	file_url = '';
	directory = 0;
	hash = '';
	height = 0;
	id = 0;
	image = '';
	change = 0;
	owner = '';
	parent_id = 0;
	rating = '';
	sample = 1;
	sample_height = 0;
	sample_width = 0;
	score = 0;
	tags = '';
	width = 0;

	parentBooru = new Booru('');
}

export class Instance extends ImageAPIInstance {
	/**
	 * @param {BooruEntryRaw} raw
	 */
	constructor(raw) {
		super();
		this.raw = raw;

		this.tags = new TagSet(raw.tags.split(' '));
		this.parentBooru = raw.parentBooru;

		this.sample_url = new URL(raw.sample_url);
		this.file_url = new URL(raw.file_url);

		this.width = raw.width;
		this.height = raw.height;

		this.sample = raw.sample;
	}

	/**
	 * @override
	 */
	getImageURLs() {
		let timg = this.sample_url.href;
		if (/[^/]\/images/.test(timg)) timg = timg.replace('/images', '//images');
		else if (/[^/]\/samples\//.test(timg))
			timg = timg.replace('/samples', '//samples');

		return [
			this.sample_url.href,
			timg,
			timg.replace('api-cdn', 'us'),
			timg + '?' + this.raw.id,
			timg.replace('api-cdn', 'us') + '?' + this.raw.id,
		];
	}

	getIdent() {
		return this.raw.id;
	}

	getTags() {
		return this.tags;
	}
}

export class API extends ImageAPI {
	source = '';

	constructor() {
		super();
		this.source = new URL(import.meta.url).search.slice(1);
	}

	/** @returns {Promise<ImageAPIInstance[]>} */
	async getPosts(
		tags = new TagSet(),
		count = 10,
		page = 0,
		alwaysTags = new TagSet()
	) {
		const url = new URL(
			`https://${this.source}/index.php?page=dapi&json=1&s=post&q=index&tags=${[
				...tags,
				...alwaysTags,
			].join('+')}&limit=${count}&pid=${page}`
		);
		const response = await fetch(url);
		const json = await response.json();

		return json.map((raw) => new Instance({ ...raw, parentBooru: this }));
	}

	async getTags(tag = '') {
		const url = new URL(`https://${this.source}/autocomplete.php?q=${tag}`);
		const response = await fetch(url);
		const json = await response.json();

		return new TagSet(json.map((x) => x.value));
	}
}
