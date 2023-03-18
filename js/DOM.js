import { ImageAPIInstance } from './apis/interface.js';

const postSet = new Set();

/**
 * @param {ImageAPIInstance} post
 */
export function createHTMLFromPost(post, [userData, saveUserData], parent) {
	if (postSet.has(post.getIdent())) return;
	postSet.add(post.getIdent());

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

		// img.addEventListener('click', () => {
		// 	tagsList.hidden = !tagsList.hidden;
		// });

		let touchStart = 0;
		let initialTouchPos = [0, 0];
		let touchPos = [0, 0];
		let likedstate = 0;

		img.addEventListener('touchstart', (e) => {
			// tagsList.hidden = !tagsList.hidden;
			touchStart = Date.now();
			initialTouchPos = [e.touches[0].clientX, e.touches[0].clientY];
			touchPos = [e.touches[0].clientX, e.touches[0].clientY];
		});

		img.addEventListener('touchmove', (e) => {
			// e.preventDefault();
			// save touch position
			touchPos = [e.touches[0].clientX, e.touches[0].clientY];
		});

		img.addEventListener('touchend', () => {
			if (!(Date.now() - touchStart < 500)) return;

			// if swipes left, or right
			if (
				Math.abs(touchPos[0] - initialTouchPos[0]) > 50 &&
				Math.abs(touchPos[1] - initialTouchPos[1]) <
					Math.abs(touchPos[0] - initialTouchPos[0])
			) {
				if (touchPos[0] < initialTouchPos[0]) {
					// swipe left (dislike)

					// loop thru tags
					for (const tag of post.getTags()) {
						if (!(tag in userData.userPreferences)) {
							userData.userPreferences[tag] = 0;
						}
						userData.userPreferences[tag] -= likedstate;
					}

					likedstate = -1;

					// loop thru tags
					for (const tag of post.getTags()) {
						userData.userPreferences[tag] += likedstate;
					}

					saveUserData();

					item.classList.add('disliked');
					item.classList.remove('liked');
				} else {
					// swipe right

					// loop thru tags
					for (const tag of post.getTags()) {
						if (!(tag in userData.userPreferences)) {
							userData.userPreferences[tag] = 0;
						}
						userData.userPreferences[tag] -= likedstate;
					}

					likedstate = 1;

					// loop thru tags
					for (const tag of post.getTags()) {
						userData.userPreferences[tag] += likedstate;
					}

					saveUserData();

					item.classList.add('liked');
					item.classList.remove('disliked');
				}
			} else if (
				Math.abs(touchPos[0] - initialTouchPos[0]) < 100 &&
				Math.abs(touchPos[1] - initialTouchPos[1]) < 100
			) {
				tagsList.hidden = !tagsList.hidden;
			}
		});
	});

	return item;
}
