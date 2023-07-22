export function getUrl() {
	if (process.env.NODE_ENV === 'development') {
		return 'http://localhost:5000/api';
	}
	return `${window.location.origin}/api/`;
}

export function asyncWrap(promise) {
	return promise.then((result) => [result]).catch((err) => [null, err]);
}

export const emptyCheck = (data, excluding) => {
	for (let item in data) {
		if (excluding?.includes(item)) continue;

		if (data[item] === '') {
			return true;
		}
	}

	return false;
};
