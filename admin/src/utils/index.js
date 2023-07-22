export function getUrl() {
	if (process.env.NODE_ENV === 'development') {
		return 'http://localhost:5000/api';
	}
	return `${window.location.origin}/api/`;
}

export function asyncWrap(promise) {
	return promise.then((result) => [result]).catch((err) => [null, err]);
}
