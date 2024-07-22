import {Link} from 'react-router-dom'

const Item = ({service}) => {
    return(
    <div className="item">
        <div className='item_border'>
        <div className="item_head">
            <div>{service.name}</div>
        </div>
        <Link to='/details' state={service} className='item-link'>Подробнее</Link>
        <div className='item-description'>
            <div>{service.description}</div>
        </div>
        <div className='item-char'>
            <div>Стоимость обычного исследования: {service.price} руб.</div>
            <div>Стоимость срочного исследования: {service.extra_price} руб.</div>
        </div>
        <div className='item-char'>
            <div>Длительность обычного исследования: {service.time} {service.deadline} </div>
            <div>Длительность срочного исследования: {service.extra_time} {service.deadline} </div>
        </div>
        </div>
    </div>)
}

export default Item;