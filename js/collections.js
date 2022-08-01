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
(async function () {
	const currentBooru = new (await import(userData.source)).API();
	DEBUG.currentBooru = currentBooru;

	const SETTAGS = document.querySelector('#SetTagsHeader');
	SETTAGS.addEventListener('click', () => {
		tagSearch(userData.tags, currentBooru).then(saveUserData);
	});

	const SETPERMTAGS = document.querySelector('#SetAlwaysTagsHeader');
	SETPERMTAGS.addEventListener('click', () => {
		tagSearch(userData.alwaysTags, currentBooru).then(saveUserData);
	});

	// Get important DOM Elements

	const colDiv = document.querySelector('#collections');
	const createButton = document.querySelector('#CreateCurrent');

	createButton.addEventListener('click', () => {
		userData.collections[Date.now()] = userData.tags;
		saveUserData();

		location.href = location.href;
	});

	const tagModeSwitch = document.querySelector('#TagMode');
	tagModeSwitch.textContent =
		'TagMode: ' + userData.tagMode[0].toUpperCase() + userData.tagMode.slice(1);
	const nextMode = { all: 'indiv', indiv: 'all' };
	tagModeSwitch.addEventListener('click', () => {
		userData.tagMode = nextMode[userData.tagMode];
		saveUserData();

		location.href = location.href;
	});

	/*
<div class="collection container">
				<h3>
					Pens <span style="color: var(--acc)">Load</span>
					<span style="color: var(--acc)">LoadExtend</span>
					<span style="color: var(--acc)">Add</span>
				</h3>
				<span class="tag">pens</span>
				<span class="tag">pens</span>
				<span class="tag">pens</span>
				<span class="tag">pens</span>
			</div>
			*/

	function disableTag(tag) {
		userData.tags.delete(tag);
		saveUserData();

		for (const tagSpan of document.querySelectorAll(
			'span[tag="' + tag + '"]'
		)) {
			tagSpan.classList.remove('selected');
		}
	}

	function enableTag(tag) {
		userData.tags.add(tag);
		saveUserData();

		for (const tagSpan of document.querySelectorAll(
			'span[tag="' + tag + '"]'
		)) {
			tagSpan.classList.add('selected');
		}
	}

	function toggleTag(tag) {
		if (userData.tags.has(tag)) {
			disableTag(tag);
		} else {
			enableTag(tag);
		}
	}

	for (const col in userData.collections) {
		const collection = userData.collections[col];
		const div = document.createElement('div');
		div.classList.add('collection');
		div.classList.add('container');
		const h3 = document.createElement('h3');
		h3.textContent = col + ' ';

		const renameButton = document.createElement('span');
		renameButton.textContent = 'Rename ';
		renameButton.style.color = 'var(--acc)';
		h3.appendChild(renameButton);

		renameButton.addEventListener('click', async () => {
			// TODO: Add rename functionality
			const newName = [...(await tagSearch(new TagSet()))][0];
			if (newName) {
				userData.collections[newName] = userData.collections[col];
				delete userData.collections[col];
				saveUserData();

				location.href = location.href;
			}
		});

		const load = document.createElement('span');
		load.textContent = 'Load ';
		load.style.color = 'var(--acc)';
		h3.appendChild(load);

		load.addEventListener('click', () => {
			for (const oldTag of userData.tags) {
				disableTag(oldTag);
			}
			for (const tag of collection) {
				enableTag(tag);
			}
			saveUserData();
		});

		const loadExtend = document.createElement('span');
		loadExtend.textContent = 'LoadExtend ';
		loadExtend.style.color = 'var(--acc)';
		h3.appendChild(loadExtend);

		loadExtend.addEventListener('click', () => {
			for (const tag of collection) {
				enableTag(tag);
			}
			saveUserData();
		});

		const add = document.createElement('span');
		add.textContent = 'Add ';
		add.style.color = 'var(--acc)';
		h3.appendChild(add);

		add.addEventListener('click', () => {
			for (const userTag of userData.tags) collection.add(userTag);
			saveUserData();
			location.href = location.href;
		});

		const removeButton = document.createElement('span');
		removeButton.textContent = 'Remove ';
		removeButton.style.color = 'var(--acc)';
		h3.appendChild(removeButton);

		removeButton.addEventListener('click', () => {
			for (const userTag of userData.tags) collection.delete(userTag);
			saveUserData();
			location.href = location.href;
		});

		const deleteButton = document.createElement('span');
		deleteButton.textContent = 'Delete';
		deleteButton.style.color = 'var(--acc2)';
		h3.appendChild(deleteButton);

		deleteButton.addEventListener('click', () => {
			for (const oldTag of userData.tags) {
				disableTag(oldTag);
			}
			for (const tag of collection) {
				enableTag(tag);
			}

			delete userData.collections[col];
			saveUserData();
			location.href = location.href;
		});

		div.appendChild(h3);
		for (const tag of collection) {
			const span = document.createElement('span');
			span.classList.add('tag');
			span.textContent = tag;
			span.setAttribute('tag', tag);
			if (userData.tags.has(tag)) {
				span.classList.add('selected');
			}

			span.addEventListener('click', () => {
				toggleTag(tag);
			});
			div.appendChild(span);
		}
		colDiv.appendChild(div);
	}
})();
