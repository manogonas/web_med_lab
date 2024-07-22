/* eslint-disable no-unused-vars */
import LoginForm from '../components/LoginForm'
import { useEffect, useState } from 'react'
import { AuthService } from '../services/auth.service'

const authService = new AuthService()

function Login() {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [currentUserInfo, setCurrentUserInfo] = useState({id: "", login: ""})

	function fetchData() {
		authService.checkSession().then(res => {
			if (res.success) {
				setCurrentUserInfo(res.userInfo)
				setIsLoggedIn(true)
			}
		})
	}

	useEffect(() => {
		fetchData()
	}, [])
	return (
		<>
			<LoginForm setCurrentUserInfo={v => setCurrentUserInfo(v)} setIsLoggedIn={() => setIsLoggedIn(true)} />
		</>
	)
}

export default Login