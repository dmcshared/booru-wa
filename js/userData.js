import { TagSet } from './TagSet.js';
/**
 * @returns {[{
 * 		source: string,
 * 		sources: TagSet,
 * 		tags: TagSet,
 * 		alwaysTags: TagSet,
 * 		collections: {[key:string]: TagSet},
 * 		metaCollections: {[key:string]: {[name:string]: TagSet}},
 * 		tagMode: "all" | "indiv",
 * 		userPreferences: { [key:string]: number }
 *    filterByPrefs: boolean
 *  }, () => void]}
 * */
export function getUserData() {
	const userData = JSON.parse(localStorage.userData ?? '{}');

	userData.source = userData.source ?? '/js/apis/booruApi.js?api.example.com';

	userData.sources = new TagSet(
		userData.sources ?? ['/js/apis/booruApi.js?api.example.com']
	);

	// Contains current tags.
	userData.tags = new TagSet(userData.tags ?? []);
	// Contains tags that should always be added to the request, but invisible to the user. Generally used to filter out unpleasant tags.
	userData.alwaysTags = new TagSet(userData.alwaysTags ?? []);
	// Ex: Characters, Artists, Styles. Used for storing individual tags in groups.
	userData.collections = userData.collections ?? {};
	// Ex: Groups, Genres. Used for storing groups of tags in groups. Only allows enabling all tags.
	userData.metaCollections = userData.metaCollections ?? {};
	// TagMode: All, Indiv
	userData.tagMode = userData.tagMode ?? 'all';

	userData.userPreferences = userData.userPreferences ?? {};

	userData.filterByPrefs = userData.filterByPrefs ?? false;

	for (const col in userData.collections) {
		userData.collections[col] = new TagSet(userData.collections[col]);
	}

	for (const col in userData.metaCollections) {
		for (const name in userData.metaCollections[col]) {
			userData.metaCollections[col][name] = new TagSet(
				userData.metaCollections[col][name]
			);
		}
	}

	function saveUserData() {
		localStorage.userData = JSON.stringify(userData);
	}

	return [userData, saveUserData];
}
