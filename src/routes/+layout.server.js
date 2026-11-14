import { getUser } from '#lib/server/db/index.js';

export async function load() {
	const user = await getUser(1);
	return {
		user
	};
}
