import { ApiService } from '../services/api.service'
import { useEffect, useState } from 'react'
import Item from '../components/Item'
import React from 'react';
import { Input, Button, Select, Form, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import FormItem from 'antd/es/form/FormItem'

const biomaterialSelector = [
	{ value: '-1', label: 'Любой'},
	{ value: '1', label: 'Кровь' },
	{ value: '2', label: 'Моча' },
	{ value: '3', label: 'Кал' }
]

async function numberFieldValidation(formRecord, name) {
	const textField = formRecord.getFieldValue(name)
	const reg = new RegExp("^\\d*$")
	if (!reg.test(textField) && (textField !== undefined)) {
		throw Error('Это поле может содержать только цифры.')
	}
}

const apiService = new ApiService()

function Catalog() {
	const [services, setServices] = useState([])
	const [loading, setLoading] = useState(true)
	const [options, setOptions] = useState({material: "-1", lower_price: "-1", upper_price: "-1", lower_time: "-1", upper_time: "-1"})
	const [form] = Form.useForm()

	function fetchData() {
		setLoading(true)
		form.validateFields()
		.then(async () =>{
		if (options.lower_price === "") {
			options.lower_price = "-1"
		}
		if (options.upper_price === "") {
			options.upper_price = "-1"
		}
		if (options.lower_time === "") {
			options.lower_time = "-1"
		}
		if (options.upper_time === "") {
			options.upper_time = "-1"
		}
		apiService.get('/services/' + options.material + '/' + options.lower_price + '/' + options.upper_price + '/' + options.lower_time + '/' + options.upper_time).then(res => {
			setServices(res)
			setLoading(false)
		})}).catch(err => {
		console.log('error', err)})
	}

	useEffect(() => {
		fetchData()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<div>
			<div className='filter-base'>
		<Form form={form}>
			<label className='label'>Фильтр.</label>
			<FormItem className='filter' label='Биоматериал: '>
				<Select options={biomaterialSelector}
					onChange={(value) => 
						setOptions(prevState => {
							return { ...prevState, material: value }
						})
					}
				/>
			</FormItem>
			<FormItem className='filter' label='Цена от: '
				name='lower_price'
				rules={[
					form => ({
						validator() {
							return numberFieldValidation(form, 'lower_price')
						}
					})
				]}>
					<Input
						onChange={(value) => 
							setOptions(prevState => {
								return { ...prevState, lower_price: value.target.value }
							})
						}
						value={options.lower_price}
					/>
				</FormItem>
				<FormItem className='filter' label='до: '
				name='upper_price'
				rules={[
					form => ({
						validator() {
							return numberFieldValidation(form, 'upper_price')
						}
					})
				]}>
					<Input
						onChange={(value) => 
							setOptions(prevState => {
								return { ...prevState, upper_price: value.target.value }
							})
						}
						value={options.upper_price}
					/>
				</FormItem>
				<FormItem className='filter' label='Время подготовки результатов от: '
				name='lower_time'
				rules={[
					form => ({
						validator() {
							return numberFieldValidation(form, 'lower_time')
						}
					})
				]}>
					<Input
						onChange={(value) => 
							setOptions(prevState => {
								return { ...prevState, lower_time: value.target.value }
							})
						}
						value={options.lower_time}
					/>
				</FormItem>
				<FormItem className='filter' label='до: '
				name='upper_time'
				rules={[
					form => ({
						validator() {
							return numberFieldValidation(form, 'upper_time')
						}
					})
				]}>
					<Input
						onChange={(value) => 
							setOptions(prevState => {
								return { ...prevState, upper_time: value.target.value }
							})
						}
						value={options.upper_time}
					/>
				</FormItem>
		</Form>
		<Button className='button' onClick={ () => fetchData() }>Найти</Button>
		</div>
		{!loading ? (
			<div>
				{services.map(item => (
					<div>
						<Item service={item} />
					</div>
				))}
			</div>
		) : (
			<>
				<Spin
					indicator={<LoadingOutlined style={{ fontSize: 100 }} />}
					style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
				/>
			</>
		)}
		</div>
	)
}

export default Catalog