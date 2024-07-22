import { Route, Routes } from 'react-router-dom'
import Catalog from '../pages/Catalog'
import Results from '../pages/Results'
import Request from '../pages/Request'
import Details from '../pages/Details'
import Login from '../pages/Login'
import Requests from '../pages/Requests'

function Content(props) {
	return (
		<>
			<div className='html'>
				<div className='content'>
					<Routes>
						<Route path='/' element={<Catalog />} />
						<Route path='/request' element={<Request />} />
						<Route path='/details' element={<Details />} />
						<Route path='/results' element={<Results />} />
						{props.loggedIn ? (
							<>
							<Route path='/requests' element={<Requests />} />
						</>) : (
							<>
							<Route path='/login' element={<Login />} />
							</>
						)}
					</Routes>
				</div>
			</div>
		</>
	)
}

export default Content