import './App.css';
import StockComponent from './components/StockComponent.js';
import TransactionComponent from './components/TransactionComponent.js';
import Navigation from './components/Navigation.js';
import AdminComponent from './components/AdminComponent.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes ,Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Navigation/>
      <Router>
      <Routes>     
        <Route path='/transaction' element={<TransactionComponent/>}/>
        <Route path='/stock' element={<StockComponent/>}/>           
        <Route path='/admin' element={<AdminComponent/>}/>
        <Route path='/statistic' element={<h1>Statistic</h1>}/>
        <Route path='/' element={<h1>Catalogue</h1>}/>             
      </Routes>
      </Router>
    </div>
  );
}

export default App;
