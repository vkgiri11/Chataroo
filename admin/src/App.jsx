import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';

import { setAxiosDefault, setToken } from './axiosDefaults';
import ChatsPage from './components/Chats';
import HomePage from './components/Home';

function App() {
	const user = JSON.parse(localStorage.getItem('loggedUserInfo'));

	setAxiosDefault();

	if (user?.token) setToken(user.token);

	return (
		<>
			<div className="main-container">
				<Routes>
					<Route path="*" element={<Navigate to="/home" replace />} />
					<Route path="home" element={<HomePage />} />
					<Route path="chats" element={<ChatsPage />} />
				</Routes>
			</div>
		</>
	);
}

export default App;
