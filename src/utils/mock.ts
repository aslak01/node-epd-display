import isOnline from "is-online";

export async function shouldMock(requested?: boolean) {
	if (requested) {
		return true;
	}

	const online = await isOnline();

	if (!online) {
		return true;
	}

	return false;
}
