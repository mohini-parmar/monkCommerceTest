import './App.css';
import MainPage from './MainPage';

function App() {
  return (
    <>
      <div className='contaier d-flex mt-5'>
        <div className='col-md-2' />
        <div className='col-md-8'>
          <MainPage/>
        </div>
        <div className='col-md-2' />
      </div>
    </>
  );
}

export default App;
