import { Avatar } from '@chakra-ui/react';
import ScrollableFeed from 'react-scrollable-feed';

import { ChatState } from '../../context/chatProvider';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../utils';

const ScrollableChat = ({ messages }) => {
	const { user } = ChatState();

	return (
		<>
			<ScrollableFeed>
				{messages &&
					messages.map((item, index) => (
						<div style={{ display: 'flex' }} key={item._id}>
							{(isSameSender(messages, item, index, user._id) ||
								isLastMessage(messages, index, user._id)) && (
								<Avatar
									mt="7px"
									mr={1}
									size="sm"
									cursor="pointer"
									name={item.sender.name}
									src={item.sender.pic}
								/>
							)}
							<span
								style={{
									backgroundColor: `${item.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'}`,
                  marginLeft: isSameSenderMargin(messages, item, index, user._id),
                  marginTop: isSameUser(messages, item, index, user._id) ? 3 : 10,
									borderRadius: '20px',
									padding: '5px 15px',
									maxWidth: '75%',
								}}>
								{item.content}
							</span>
						</div>
					))}
			</ScrollableFeed>
		</>
	);
};
export default ScrollableChat;
