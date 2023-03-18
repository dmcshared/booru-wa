import { createHTMLFromPost } from './DOM.js';
import { TagSet } from './TagSet.js';
import { getUserData } from './userData.js';

const DEBUG = window;
// const DEBUG = {};

//#region Setup user data

const ud = getUserData();
const [userData, saveUserData] = ud;
DEBUG.userData = userData;
DEBUG.saveUserData = saveUserData;

function verifyPost(post) {
	if (userData.filterByPrefs) {
		if (userData.userPreferences) {
			// tally up score of post
			let score = 0;
			for (const tag of post.tags) {
				if (userData.userPreferences[tag]) {
					score += userData.userPreferences[tag];
				}
			}

			console.log('Score: ' + score);

			// if score is positive, return true
			return score > 0;
		}
		return false;
	}
	return true;
}

//#endregion

(async function () {
	/** @type {import("./apis/interface.js").ImageAPI} */
	const currentBooru = new (await import(userData.source)).API();
	DEBUG.currentBooru = currentBooru;

	// Get important DOM Elements
	const menuDiv = document.querySelector('.menu');
	const contentDiv = document.querySelector('.content');

	//MOCKUP

	let currentPage = 0;
	let currentPages = {};
	let cooldown = 0;

	function addPage(force = false) {
		if (!force && Date.now() - cooldown < 2000) {
			return;
		}

		if (userData.tagMode === 'all') {
			currentBooru
				.getPosts(userData.tags, 20, currentPage++, userData.alwaysTags)
				.then((posts) => {
					let total = 0;
					for (const post of posts) {
						if (verifyPost(post)) {
							total++;
							createHTMLFromPost(post, ud, contentDiv);
						}
					}
					if (total === 0) {
						addPage(true);
					}
				});
		} else {
			for (const tag of userData.tags) {
				console.log('Searching for ' + tag);
				currentPages[tag] = currentPages[tag] || 0;

				currentBooru
					.getPosts(
						new TagSet([tag]),
						10,
						currentPages[tag]++,
						userData.alwaysTags
					)
					.then((posts) => {
						let total = 0;
						for (const post of posts) {
							if (verifyPost(post)) {
								total++;
								createHTMLFromPost(post, ud, contentDiv);
							}
						}
						if (total === 0) {
							addPage(true);
						}
					});
			}
		}

		cooldown = Date.now();
	}

	addPage();

	let lastScrollTime = 0;

	contentDiv.addEventListener('scroll', () => {
		if (
			contentDiv.scrollTop + contentDiv.clientHeight * 2 >=
				contentDiv.scrollHeight &&
			Date.now() - lastScrollTime > 1000
		) {
			lastScrollTime = Date.now();
			console.log('Adding page');
			addPage();
			lastScrollHeight = contentDiv.scrollHeight;
		}
	});
})();
