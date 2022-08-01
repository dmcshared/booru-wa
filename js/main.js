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

//#endregion

(async function () {
	const currentBooru = new (await import(userData.source)).API();
	DEBUG.currentBooru = currentBooru;

	// Get important DOM Elements
	const menuDiv = document.querySelector('.menu');
	const contentDiv = document.querySelector('.content');

	//MOCKUP

	let currentPage = 0;
	let currentPages = {};
	let cooldown = 0;

	function addPage() {
		if (Date.now() - cooldown < 2000) {
			return;
		}

		if (userData.tagMode === 'all') {
			currentBooru
				.getPosts(userData.tags, 20, currentPage++, userData.alwaysTags)
				.then((posts) => {
					for (const post of posts) {
						createHTMLFromPost(post, ud, contentDiv);
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
						for (const post of posts) {
							createHTMLFromPost(post, ud, contentDiv);
						}
					});
			}
		}

		cooldown = Date.now();
	}

	addPage();

	let lastScrollHeight = 0;
	contentDiv.addEventListener('scroll', () => {
		if (
			contentDiv.scrollTop + contentDiv.clientHeight * 2 >=
				contentDiv.scrollHeight &&
			lastScrollHeight != contentDiv.scrollHeight
		) {
			addPage();
			lastScrollHeight = contentDiv.scrollHeight;
		}
	});
})();
