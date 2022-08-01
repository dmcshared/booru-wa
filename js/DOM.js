import { ImageAPIInstance } from './apis/interface.js';

/**
 * @param {ImageAPIInstance} post
 */
export function createHTMLFromPost(post, [userData, saveUserData], parent) {
	const item = document.createElement('div');
	item.classList.add('item');
	item.hidden = true;

	const tagsList = document.createElement('div');
	tagsList.hidden = true;
	tagsList.classList.add('tagsList');
	for (const tag of post.tags) {
		const span = document.createElement('span');
		span.textContent = tag;
		span.setAttribute('tag', tag);

		if (userData.tags.has(tag)) span.classList.add('selected');

		span.addEventListener('click', () => {
			if (userData.tags.has(tag)) {
				userData.tags.delete(tag);
				saveUserData();

				for (const tagSpan of document.querySelectorAll(
					'span[tag="' + tag + '"]'
				)) {
					tagSpan.classList.remove('selected');
				}
			} else {
				userData.tags.add(tag);
				saveUserData();

				for (const tagSpan of document.querySelectorAll(
					'span[tag="' + tag + '"]'
				)) {
					tagSpan.classList.add('selected');
				}
			}
		});

		tagsList.appendChild(span);
	}

	const images = post.getImageURLs().map((x) => {
		const img = document.createElement('img');
		img.src = x;
		return img;
	});
	let complete = false;

	images.forEach((img) => {
		img.addEventListener('load', () => {
			if (complete) return;
			complete = true;

			item.appendChild(img);
			item.appendChild(tagsList);

			if (parent) parent.appendChild(item);
			item.hidden = false;
		});

		img.addEventListener('click', () => {
			tagsList.hidden = !tagsList.hidden;
		});
	});

	return item;
}
