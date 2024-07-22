import App from './App';
import { useEffect, useState } from 'react';
import { AuthService } from './services/auth.service';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const authService = new AuthService();

function AppContextProvider() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [loading, setLoading] = useState(false);
	const [currentUserInfo, setCurrentUserInfo] = useState({id: "", login: ""});

	function fetchData() {
		setLoading(true);
		authService.checkSession().then(res => {
			if (res.success) {
				setCurrentUserInfo(res.userInfo);
				setIsLoggedIn(true);
			}
			setLoading(false);
		});
	}

	useEffect(() => {
		fetchData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<>
			{!loading ? (
				isLoggedIn ? (
					<App loggedIn={isLoggedIn} userName={currentUserInfo.login} />
				) : (
					<App loggedIn={isLoggedIn} userName={false} />
				)) : (
					<>
					<Spin
						indicator={<LoadingOutlined style={{ fontSize: 100 }} />}
						style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
					/>
				</>
				)
			}
		</>
	);
}

export default AppContextProvider;