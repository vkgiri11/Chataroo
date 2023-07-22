import { useEffect, useState } from 'react';
import axios from 'axios';

import { asyncWrap } from '../../utils';

const index = () => {
	const [chats, setChats] = useState([]);

	const fetchChatsData = async () => {
		const [res, err] = await asyncWrap(axios.get('chats'));

		if (err) {
			console.log(err.response);
			return;
		}

		setChats(res.data);
	};

	useEffect(() => {
		// fetchChatsData();
	}, []);

	return (
		<>
			{chats.map((item) => (
				<div key={item._id}>{item.chatName}</div>
			))}
		</>
	);
};
export default index;
