import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Table } from 'antd'
import { useState, useEffect } from 'react'
import { ApiService } from '../services/api.service'

const columns = [
	{ title: 'Исследуемые параметры', dataIndex: 'name', key: 'name' }
]

const apiService = new ApiService()

function Request() {
    const location = useLocation()
    const item = location.state
    const [param, setParams] = useState([null])
    
    useEffect(() => {
        function getParams() {
            apiService.get('/parameters/' + item.id).then(res => {
                setParams(res)
            })
        }
		getParams()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
    return (
        <><div className="desc">
            <div>
                <Link
                    className="back-link"
                    to="/"
                >Назад</Link>
            </div>
            <div className="desc_head">
                <div>{item.name}</div>
            </div>
            <div>
                <Table
                    pagination={false}
                    dataSource={param}
                    columns={columns}
                    size="small"
                    className="params-table"
                ></Table>
            </div>
            <div>
                <div className="headline">Описание:</div>
                <div className="details-text">{item.description}</div>
            </div>
            <div>
                <div className="headline">Рекоммендации к сдаче анализов:</div>
                <div className="details-text">{item.recommendations}</div>
            </div>
            <div className='border-top'>
            <div className='item-char_2'>
            <div>Стоимость обычного исследования: {item.price} руб.</div>
            <div>Стоимость срочного исследования: {item.extra_price} руб.</div>
            </div>
            <div className='item-char_2'>
                <div>Длительность обычного исследования: {item.time} {item.deadline} </div>
                <div>Длительность срочного исследования: {item.extra_time} {item.deadline} </div>
            </div>
            </div>
            <div>
                <Link
                    className="center-link"
                    to="/request"
                    state={item}
                >Оставить заявку</Link>
            </div>
            </div>
        </>
    )
}

export default Request