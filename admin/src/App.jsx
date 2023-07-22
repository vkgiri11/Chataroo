import { Navigate, Route, Routes } from 'react-router-dom';

import { setAxiosDefault } from './axiosDefaults';

import HomePage from './components/HomePage';
import ChatsPage from './components/ChatsPage';

function App() {
	setAxiosDefault();

	return (
		<>
			<Routes>
				<Route path="*" element={<Navigate to="/home" replace />} />
				<Route path="home" element={<HomePage />} />
				<Route path="chats" element={<ChatsPage />} />
			</Routes>
		</>
	);
}

export default App;
