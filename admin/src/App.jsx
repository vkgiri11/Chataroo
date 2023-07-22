import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';

import { setAxiosDefault } from './axiosDefaults';
import ChatsPage from './components/Chats';
import HomePage from './components/Home';

function App() {
	setAxiosDefault();

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
