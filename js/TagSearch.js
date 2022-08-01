import { ImageAPI } from './apis/interface.js';
import { TagSet } from './TagSet.js';

/**
 * Adds appropriate tags to the prefill object.
 * @param {TagSet} prefill
 * @param {ImageAPI?} booru
 */
export function tagSearch(prefill, booru) {
	// const tags = new TagSet(prefill);
	const tags = prefill;

	const tagSearchWrapper = document.createElement('div');
	tagSearchWrapper.style.position = 'fixed';
	tagSearchWrapper.style.zIndex = '100';
	tagSearchWrapper.style.top = '1cm';
	tagSearchWrapper.style.left = '1cm';
	tagSearchWrapper.style.width = 'calc( 100vw - 2cm )';
	tagSearchWrapper.style.height = 'calc( 100vh - 2cm )';
	tagSearchWrapper.style.backgroundColor = 'var(--bg2)';

	const tagSearchBG = document.createElement('div');
	tagSearchBG.style.position = 'fixed';
	tagSearchBG.style.zIndex = '90';
	tagSearchBG.style.top = '0';
	tagSearchBG.style.left = '0';
	tagSearchBG.style.width = '100vw';
	tagSearchBG.style.height = '100vh';
	tagSearchBG.style.backgroundColor = '#00000088';
	tagSearchBG.appendChild(tagSearchWrapper);
	document.body.appendChild(tagSearchBG);

	const tagInput = document.createElement('input');
	tagInput.type = 'text';
	tagInput.placeholder = 'Search tags';
	tagInput.style.position = 'absolute';
	tagInput.style.top = '0.1cm';
	tagInput.style.left = '0.1cm';
	tagInput.style.height = '0.8cm';
	tagInput.style.width = 'calc( 100vw - 2cm - 0.2cm - 2cm )';

	tagInput.style.backgroundColor = 'var(--bg)';
	tagInput.style.color = 'var(--fg)';
	tagInput.style.border = '1px solid var(--acc)';
	tagInput.style.fontFamily = 'monospace';
	tagSearchWrapper.appendChild(tagInput);

	{
		//Spacer 1.2 cm tall
		const spacer = document.createElement('div');
		spacer.style.height = '1.2cm';

		tagSearchWrapper.appendChild(spacer);
	}

	// Create div for added tags
	const tagList = document.createElement('div');
	tagList.style.paddingLeft = '0.2cm';
	tagList.style.paddingRight = '0.2cm';
	tagList.style.paddingTop = '0.2cm';
	tagList.style.backgroundColor = 'var(--bg)';
	tagSearchWrapper.appendChild(tagList);

	function addTag(tag, force = false) {
		if (!tags.has(tag) || force) {
			tags.add(tag);
			const tagDiv = document.createElement('span');
			tagDiv.textContent = tag;
			tagDiv.classList.add('tag', 'selected');
			tagDiv.addEventListener('click', () => {
				tags.delete(tag);
				tagDiv.remove();
			});
			tagList.appendChild(tagDiv);
		}
	}

	const potentialTagList = document.createElement('div');
	potentialTagList.style.paddingLeft = '0.2cm';
	potentialTagList.style.paddingRight = '0.2cm';
	potentialTagList.style.paddingTop = '0.2cm';
	potentialTagList.style.backgroundColor = 'var(--bg2)';
	tagSearchWrapper.appendChild(potentialTagList);

	function addPotentialTags(tags) {
		// Clear current potential tags
		while (potentialTagList.firstChild) {
			potentialTagList.firstChild.remove();
		}

		// Add new potential tags
		for (const tag of tags) {
			const tagDiv = document.createElement('span');
			tagDiv.textContent = tag;
			tagDiv.classList.add('tag');
			tagDiv.addEventListener('click', () => {
				addTag(tag);
			});
			potentialTagList.appendChild(tagDiv);
		}
	}

	if (booru)
		tagInput.addEventListener('input', () => {
			const search = tagInput.value;
			if (search.length > 0) {
				booru.getTags(search).then((tags) => {
					if (tagInput.value == search) addPotentialTags(tags);
				});
			} else {
				addPotentialTags([]);
			}
		});

	tagInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			const search = tagInput.value;
			if (search.length > 0) {
				addTag(search);
				tagInput.value = '';
			}
		}
	});

	for (const tag of tags) {
		addTag(tag, true);
	}

	const tagSearchClose = document.createElement('div');
	tagSearchClose.style.position = 'absolute';
	tagSearchClose.style.top = '0.1cm';
	tagSearchClose.style.right = '0.1cm';
	tagSearchClose.style.height = '0.9cm';
	tagSearchClose.style.width = '1.7cm';
	tagSearchClose.style.backgroundColor = 'var(--acc)';
	tagSearchClose.style.color = 'var(--fg)';
	tagSearchClose.style.fontFamily = 'monospace';
	tagSearchClose.style.whiteSpace = 'pre';
	tagSearchClose.style.fontSize = '0.3cm';
	tagSearchClose.style.textAlign = 'center';
	tagSearchClose.style.lineHeight = '0.3cm';

	tagSearchClose.textContent = '\nDone';
	tagSearchWrapper.appendChild(tagSearchClose);

	return new Promise((resolve, reject) => {
		tagSearchClose.addEventListener('click', () => {
			tagSearchBG.remove();
			resolve(tags);
		});
	});
}
