export function getUrl() {
	if (import.meta.env.VITE_NODE_ENV === 'production') {
		return 'https://chataroo-backend.onrender.com/api/';
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

export const getSender = (loggedUser, users) => {
	return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderDetails = (loggedUser, users) => {
	return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, currentMessage, index, loggedUserId) => {
	return (
		index < messages.length - 1 &&
		(messages[index + 1].sender._id !== currentMessage.sender._id ||
			messages[index + 1].sender._id === undefined) &&
		messages[index].sender._id !== loggedUserId
	);
};

export const isLastMessage = (messages, index, loggedUserId) => {
	return (
		index === messages.length - 1 &&
		messages[messages.length - 1].sender._id !== loggedUserId &&
		messages[messages.length - 1].sender._id
	);
};

export const isSameSenderMargin = (messages, currentMessage, index, loggedUserId) => {
	if (index < messages.length - 1 &&
    messages[index + 1].sender._id === currentMessage.sender._id &&
    messages[index].sender._id !== loggedUserId) return 33;

	else if (
		(index < messages.length - 1 &&
			messages[index + 1].sender._id !== currentMessage.sender._id &&
			messages[index].sender._id !== loggedUserId) ||
		(index === messages.length - 1 && messages[index].sender._id !== loggedUserId)
	)
		return 0;

	else return 'auto';
};

export const isSameUser = (messages, currentMessage, index) => {
	return index > 0 && messages[index - 1].sender._id === currentMessage.sender._id;
};
