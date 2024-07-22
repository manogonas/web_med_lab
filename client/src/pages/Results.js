import { Table, Input, Button, Form } from 'antd'
import { ApiService } from '../services/api.service'
import { useState } from 'react'
import FormItem from 'antd/es/form/FormItem'

const columns = [
	{ title: 'Анализ', dataIndex: 'service', key: 'service'},
	{ title: 'Параметр', dataIndex: 'parameter', key: 'parameter' },
    { title: 'Нормальное значение', dataIndex: 'norm', key: 'norm' },
	{ title: 'Результат', dataIndex: 'result', key: 'result' },
	{ title: 'Мера измерения', dataIndex: 'measure', key: 'measure' }
]

const validateMessages = {
	required: 'Обязательное поле!'
}

async function agreementValidation(formRecord) {
	const numberField = formRecord.getFieldValue('number')
	const reg = new RegExp("^\\d{6}$")
	if (!reg.test(numberField) && (numberField !== undefined)) {
		throw Error('Это поле должно содержать 6 цифр.')
	}
}

async function textValidation(formRecord) {
	const textField = formRecord.getFieldValue('surname')
	const reg = new RegExp("^[a-zA-Zа-яА-Я]+$")
	if (!reg.test(textField) && (textField !== "")) {
		throw Error('Это поле может содержать только буквы русского и английского алфавита.')
	}
}

async function dateValidation(formRecord) {
	const dateField = formRecord.getFieldValue('date')
	const reg = new RegExp("^\\d\\d\\.\\d\\d\\.\\d\\d\\d\\d$")
	if (!reg.test(dateField) && (dateField !== undefined)) { 
		throw Error('Дата должна быть представлена в формате "ДД.ММ.ГГГГ".')
	}
}

const apiService = new ApiService()

function Results() {
    const [results, setResults] = useState('')
	const [visible, setVisible] = useState(false)
	const [mistake, setMistake] = useState(false)
	const [form] = Form.useForm()
	const [options, setOptions] = useState({number: "-1", surname: "-1", date: "-1"})

	function findInfo() {
		form.validateFields()
		.then(async () =>{
			await apiService.get('/results/' + options.number + '/' + options.surname + '/' + options.date).then(res => {
				if (res.success) {
					setResults(res.res)
					setVisible(true)
					setMistake(false)
				}
				else {
					setVisible(false)
					setMistake(true)
				}
	  	})}).catch(err => {
		console.log('error', err)
	})
	}
    
	return (
		<div className='request-base'>
		<Form labelAlign='left' labelCol={{span: 6}} wrapperCol={{span: 18}} form={form} validateMessages={validateMessages}>
			<FormItem label='Введите номер договора'
			name='number'
			rules={[
				{
					required: true
				},
				form => ({
					validator() {
						return agreementValidation(form)
					}
				})
			]}>
				<Input
					onChange={(v) => 
						setOptions(prevState => {
							return { ...prevState, number: v.target.value }
						})
					}
					value={options.number}
				/>
			</FormItem>
			<FormItem label='Введите фамилию'
			name='surname'
			rules={[
				{
					required: true
				},
				form => ({
					validator() {
						return textValidation(form)
					}
				})
			]}>
				<Input
					onChange={(v) => 
						setOptions(prevState => {
							return { ...prevState, surname: v.target.value }
						})
					}
					value={options.surname}
				/>
			</FormItem>
			<FormItem label='Введите дату рождения'
			name='date'
			rules={[
				{
					required: true
				},
				form => ({
					validator() {
						return dateValidation(form)
					}
				})
			]}>
				<Input
					onChange={(v) => 
						setOptions(prevState => {
							return { ...prevState, date: v.target.value }
						})
					}
					value={options.date}
				/>
			</FormItem>
		</Form> 
		<Button className='send-button'
			onClick = {() =>
				findInfo()}
		>Найти</Button>
		{visible ? (
		<Table
			pagination={false}
			dataSource={results}
			columns={columns}
			className='table'
		></Table>
		) : (<></>)}
		{mistake ? (<div>Нет результатов для введённых данных.</div>) : (<></>)}
		</div>
	)
}

export default Results