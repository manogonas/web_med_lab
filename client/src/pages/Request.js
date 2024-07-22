import { Button, Select, Form, Input } from 'antd'
import { ApiService } from '../services/api.service'
import { useState } from 'react'
import FormItem from 'antd/es/form/FormItem'
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const apiService = new ApiService()

const sexSelector = [
	{ value: '1', label: 'Мужской' },
	{ value: '2', label: 'Женский' }
]

const extraSelector = [
	{ value: 'false', label: 'Обычный' },
	{ value: 'true', label: 'Срочный' }
]

const validateMessages = {
	required: 'Обязательное поле!'
}

async function textFieldValidation(formRecord, name) {
	const textField = formRecord.getFieldValue(name)
	const reg = new RegExp("^[a-zA-Zа-яА-Яё]+$")
	if (!reg.test(textField) && (textField !== "")) {
		throw Error('Это поле может содержать только буквы русского и английского алфавита.')
	}
}

async function phoneFieldValidation(formRecord) {
	const phoneField = formRecord.getFieldValue('phone')
	const reg = new RegExp("^89(\\d){9}$")
	if (!reg.test(phoneField) && (phoneField !== undefined)) {
		throw Error('Телефон должен состоять из 11 цифр и быть представлен в формате "89*********".')
	}
}

async function emailFieldValidation(formRecord) {
	const emailField = formRecord.getFieldValue('email')
	const reg = new RegExp("^[a-zA-Z].+@[a-zA-Z]+\\.[a-zA-Z]+$")
	if (!reg.test(emailField) && (emailField !== undefined)) {
		throw Error('Неправильный email.')
	}
}

async function dateFieldValidation(formRecord) {
	const dateField = formRecord.getFieldValue('date')
	const reg = new RegExp("^\\d\\d\\.\\d\\d\\.\\d\\d\\d\\d$")
	if (!reg.test(dateField) && (dateField !== undefined)) { 
		throw Error('Дата должна быть представлена в формате "ДД.ММ.ГГГГ".')
	}
}

function Request() {
	const location = useLocation()
	const item = location.state
    const [requestRecord, setRequestRecord] = useState({service: item.id, sex: "", name: "", surname: "", patronymic: "", number: "", address: "", email: "", date: "", extra: false })
    const [created, setCreated] = useState(false)
	const [mistake, setMistake] = useState(false)
	const [form] = Form.useForm()

    function AddRequest() {
		form.validateFields()
		.then(async () =>{
			const res = await apiService.post('/request', requestRecord)
			if (res.success) {
				setCreated(true)
				setMistake(false)
			}
			else {
				setCreated(false)
				setMistake(true)
			}
	  	}).catch(err => {
		console.log('error', err)
	})
	}

    return (
        <div className="request-base">
			<Link className='back-link'
			to="/details"
			state={item}
			>Назад</Link>
			{!created ? (<div className='request-form'>
            <Form labelAlign='left' labelCol={{span: 6}} wrapperCol={{ span: 18 }} form={form} validateMessages={validateMessages}>
				<FormItem label='Название'
				rules={[
					{
						required: true
					}
				]}>
					<Input
						value={item.name} disabled = {true}
					/>
				</FormItem>
				<FormItem label='Пол'
				name='sex'
				rules={[
					{
						required: true
					}
				]}>
					<Select options={sexSelector}
						onChange={(value) => 
							setRequestRecord(prevState => {
								return { ...prevState, sex: value }
							})
						}
					/>
				</FormItem>
				<FormItem label='Фамилия'
				name='surname'
				rules={[
					{
						required: true
					},
					form => ({
						validator() {
							return textFieldValidation(form, 'surname')
						}
					})
				]}>
					<Input
						onChange={v =>
							setRequestRecord(prevState => {
								return { ...prevState, surname: v.target.value }
							})
						}
						value={requestRecord.surname}
					/>
				</FormItem>
				<FormItem label='Имя'
				name='name'
				rules={[
					{
						required: true
					},
					form => ({
						validator() {
							return textFieldValidation(form, 'name')
						}
					})
				]}>
					<Input
						onChange={v =>
							setRequestRecord(prevState => {
								return { ...prevState, name: v.target.value }
							})
						}
						value={requestRecord.name}
					/>
				</FormItem>
				<FormItem label='Отчество'
				name='patronymic'
				rules={[
					form => ({
						validator() {
							return textFieldValidation(form, 'patronymic')
						}
					})
				]}>
					<Input
						onChange={v =>
							setRequestRecord(prevState => {
								return { ...prevState, patronymic: v.target.value }
							})
						}
						value={requestRecord.patronymic}
					/>
				</FormItem>
				<FormItem label='Телефон'
				name='phone'
				rules={[
					{
						required: true
					},
					form => ({
						validator() {
							return phoneFieldValidation(form)
						}
					})
				]}>
					<Input
						onChange={v =>
							setRequestRecord(prevState => {
								return { ...prevState, number: v.target.value }
							})
						}
						value={requestRecord.number}
					/>
				</FormItem>
				<FormItem label='Адрес'
				name='address'
				rules={[
					{
						required: true
					}
				]}>
					<Input
						onChange={v =>
							setRequestRecord(prevState => {
								return { ...prevState, address: v.target.value }
							})
						}
						value={requestRecord.address}
					/>
				</FormItem>
				<FormItem label='Email'
				name='email'
				rules={[
					{
						required: true
					},
					form => ({
						validator() {
							return emailFieldValidation(form)
						}
					})
				]}>
					<Input
						onChange={v =>
							setRequestRecord(prevState => {
								return { ...prevState, email: v.target.value }
							})
						}
						value={requestRecord.email}
					/>
				</FormItem>
				<FormItem label='Дата рождения'
				name='date'
				rules={[
					{
						required: true
					},
					form => ({
						validator() {
							return dateFieldValidation(form)
						}
					})
				]}>
					<Input
						onChange={v =>
							setRequestRecord(prevState => {
								return { ...prevState, date: v.target.value }
							})
						}
						value={requestRecord.date}
					/>
				</FormItem>
				<FormItem label='Срочность'
				name='extra'
				rules={[
					{
						required: true
					}
				]}>
                    <Select options={extraSelector}
						onChange={(value) => 
							setRequestRecord(prevState => {
								return { ...prevState, extra: value }
							})
						}
					/>
				</FormItem>
			</Form>
			</div>) : (<></>)}
            {!created ? (<Button className='send-button' onClick={() => AddRequest() }>Отправить</Button>) : (<></>)}
			{mistake ? (<div className='red_head'>Упс, что-то пошло не так.</div>) : (<></>)}
			{created ? (<div className='desc_head'>Заявка успешно создана.</div>) : (<></>)}
    	</div>
    )
}

export default Request