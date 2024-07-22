import './App.css';
import Content from './components/Content'
import Footer from './components/Footer'
import Header from './components/Header'

function App(props) {
  return (
    <>
      <div className="App">
        <Header loggedIn = {props.loggedIn} userName = {props.userName} />
				<Content loggedIn = {props.loggedIn} userName = {props.userName} />
				<Footer />
      </div>
    </>
  );
}

export default App;
