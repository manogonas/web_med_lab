import { Button, Form, Input } from 'antd'
import { useState } from 'react'
import { AuthService } from '../services/auth.service'
import { useNavigate } from 'react-router-dom';

const validateMessages = {
	required: 'Обязательное поле!'
}

const authService = new AuthService()

function LoginForm(props) {
	const [isLogin, setIsLogin] = useState(true)
	const [authErrorMessage, setAuthErrorMessage] = useState('')
	const [form] = Form.useForm()
	const navigate = useNavigate();

	async function auth() {
		form
			.validateFields()
			.then(async () => {
				if (form.getFieldsValue().passwordRepeat) {
					await authService.register(form.getFieldsValue())
					.then((res) => {
						if (res.success) {
						navigate('/')
						document.location.reload()
						} else {
							setAuthErrorMessage('Неверные данные или повторяющийся логин!')
					}})
				} else {
					await authService.login(form.getFieldsValue())
					.then((res) => {
						if (res.success) {
						navigate('/')
						document.location.reload()
						} else {
						props.setCurrentUserInfo({id: "", login: ""})
						setAuthErrorMessage('Не верные логин или пароль!')
					}})
				}
			})
			.catch(err => {
				console.log('error', err)
			})
	}

	function changeAuthType() {
		setAuthErrorMessage('')
		setIsLogin(!isLogin)
		form.resetFields()
	}

	async function repeatPasswordFieldValidation(formRecord) {
		const passwordField = formRecord.getFieldValue('password')
		const passwordRepeatField = formRecord.getFieldValue('passwordRepeat')
		if (passwordRepeatField && passwordField !== passwordRepeatField) {
			throw Error('Пароли не совпадают!')
		}
	}

	async function PasswordFieldValidation(formRecord) {
		const passwordField = formRecord.getFieldValue('password')
		if (passwordField !== undefined) {
		const checkLanguage = new RegExp(".*[а-яА-Я].*")
		const checkNumbers = new RegExp(".*\\d.*")
		const checkLowerCase = new RegExp(".*[a-z].*")
		const checkUpperCase = new RegExp(".*[A-Z].*")
		const checkSpecialSymbols = new RegExp(".*[\\W_].*")
		if (checkLanguage.test(passwordField)) {
			throw Error('В пароле допускаются буквы только латинского алфавита')
		}
		else if (passwordField.length < 8) {
			throw Error('Пароль должен содержать не менее 8 символов')
		}
		else if (!checkNumbers.test(passwordField)) {
			throw Error('Пароль должен содержать цифры')
		}
		else if (!checkLowerCase.test(passwordField)) {
			throw Error("Пароль должен содержать буквы нижнего регистра")
		}
		else if (!checkUpperCase.test(passwordField)) {
			throw Error("Пароль должен содержать буквы верхнего регистра")
		}
		else if (!checkSpecialSymbols.test(passwordField)) {
			throw Error("Пароль должен содержать специальные символы")
		}
		}
	}

	return (
		<>
			<div>
				<div className='request-base'>
					<div className="desc_head"><div>{isLogin ? 'Авторизация' : 'Регистрация'}</div></div>
					<div className='request-form'>
					<Form
						labelAlign='left'
						labelCol={{ span: 7 }}
						wrapperCol={{ span: 18 }}
						form={form}
						validateMessages={validateMessages}
					>
                        {!isLogin ? (
							<Form.Item
								label='ID работника'
								name='id'
								rules={[
									{
										required: true
									},
								]}
							>
								<Input allowClear />
							</Form.Item>
						) : (
							<></>
						)}
						{!isLogin ? (
							<Form.Item
								label='Фамилия работника'
								name='surname'
								rules={[
									{
										required: true
									},
								]}
							>
								<Input allowClear />
							</Form.Item>
						) : (
							<></>
						)}
						<Form.Item
							label='Логин'
							name='login'
							rules={[
								{
									required: true
								}
							]}
						>
							<Input allowClear />
						</Form.Item>
						<Form.Item
							label='Пароль'
							name='password'
							rules={[
								{
									required: true
								},
								form => ({
									validator() {
										return PasswordFieldValidation(form)
									}
								})
							]}
						>
							<Input.Password allowClear />
						</Form.Item>
						{!isLogin ? (
							<Form.Item
								label='Повтор'
								name='passwordRepeat'
								rules={[
									{
										required: true
									},
									form => ({
										validator() {
											return repeatPasswordFieldValidation(form)
										}
									})
								]}
							>
								<Input.Password allowClear />
							</Form.Item>
						) : (
							<></>
						)}
					</Form>
					</div>
					{authErrorMessage ? <div className='auth-error-message'>{authErrorMessage}</div> : <></>}
					<Button className='send-button' onClick={auth} style={{ width: 200 }}>
						{isLogin ? 'Войти' : 'Зарегистрироваться'}
					</Button>
					<p>
						<Button type='link' onClick={changeAuthType} className='center'>
							{isLogin ? 'Я не зарегистрирован' : 'Я уже зарегистрирован'}
						</Button>
					</p>
				</div>
			</div>
		</>
	)
}

export default LoginForm