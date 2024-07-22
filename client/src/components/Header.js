import React from 'react';
import img from './logo.png';
import {Link} from 'react-router-dom'
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons'
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

function Header(props) {
    function logOut() {
		authService.logout().then(() => {
			document.location.reload()
		})
	}
    return (
        <header class="header">
            <div class="logo">
                <Link to='/'>
                    <img src={img} width ={350} height={100} alt="Company Logo" className="logo"/>
                </Link>
            </div>
            <div class="nav">
                <ul>
                    <li><Link to={'/'}>Каталог</Link></li>
                    <li><Link to={'/results'}>Результаты</Link></li>
                    {props.loggedIn ? (<>
                    <li><Link to={'/requests'}>Запросы</Link></li>
                    <li className='green_text'>Здраствуйте, {props.userName}!</li>
                    <li><Button className='link-button' onClick={logOut}><>Выйти</><><LogoutOutlined/></></Button></li>
                    </>) : 
                    (<li><Link to={'/login'}>Войти</Link></li>)}
                </ul>
            </div>
            <div class="clear"></div>
        </header>
    );
}

export default Header;