import {Link} from 'react-router-dom'

function Footer() {
	return (
		<>
			<div className='footer'>
				<ul>
                    <li><Link className='footer-link' to={'/'} >Каталог</Link></li>
                </ul>
			</div>
		</>
	)
}

export default Footer