import { tagSearch } from './TagSearch.js';
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

const sourceDIV = document.querySelector('#sources');
for (const source of userData.sources) {
	const sourceButton = document.createElement('span');
	sourceButton.classList.add('tag');
	sourceButton.textContent = source;

	if (source == userData.source) sourceButton.classList.add('selected');

	sourceButton.addEventListener('click', () => {
		userData.source = source;
		saveUserData();

		location.href = location.href;
	});
	sourceDIV.appendChild(sourceButton);
}

const modSourcesButton = document.querySelector('#modSources');
modSourcesButton.addEventListener('click', () => {
	tagSearch(userData.sources).then(() => {
		saveUserData();
		location.href = location.href;
	});
});
