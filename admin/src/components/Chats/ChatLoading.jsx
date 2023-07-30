import { Skeleton, Stack } from '@chakra-ui/react';

const ChatLoading = ({ number }) => {
	return (
		<>
			<Stack>
				{[...Array(number || 8)].map((e, i) => (
					<Skeleton height="45px" key={i} />
				))}
			</Stack>
		</>
	);
};
export default ChatLoading;
