import { Table } from 'antd'
import { ApiService } from '../services/api.service'
import { useState, useEffect } from 'react'
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const columns = [
	{ title: 'Анализ', dataIndex: 'service', key: 'service'},
    { title: 'Фамилия', dataIndex: 'surname', key: 'surname' },
	{ title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Отчество', dataIndex: 'patronymic', key: 'patronymic' },
	{ title: 'Номер телефона', dataIndex: 'number', key: 'number' },
	{ title: 'Статус', dataIndex: 'status', key: 'status' },
    { title: 'Срочность', dataIndex: 'extra', key: 'extra' },
    { title: 'Дата', dataIndex: 'date', key: 'date' }
]

const apiService = new ApiService()

function Results() {
    const [requests, setRequests] = useState('')
    const [isFound, setFound] = useState(false)
    const [loading, setLoading] = useState(false);
	//const [options, setOptions] = useState({number: "-1", surname: "-1", date: "-1"})

	function findInfo() {
        setLoading(true);
		apiService.get('/requests').then(res => {
			if (res.success) {
			    setRequests(res.res)
                setFound(true)
			}
            else {
                setFound(false)
            }
            setLoading(false);
	  	}).catch(err => {
		console.log('error', err)
	})
	}
    
    useEffect(() => {
		findInfo();
	}, []);
	return (
        <>
        {!loading ? 
            (isFound ? ( 
            <Table
                //pagination={{ pageSize: 20 }}
                dataSource={requests}
                columns={columns}
                className='table'
            ></Table>
            ) : (<>Заявок не найдено</>)) : (
                <>
					<Spin
						indicator={<LoadingOutlined style={{ fontSize: 100 }} />}
						style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
					/>
				</>
            )
        }
        </>
	)
}

export default Results