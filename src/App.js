import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Header from './comp/header';
import Backup from './pages/backup';
import Customer from './pages/customer';
import Dashboard from './pages/dashboard';
import Inventory from './pages/inventory';
import Order from './pages/order';
import Payments from './pages/payments';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route    path='/' element={<Header /> }>
          <Route   path='/' element={<Dashboard />} />
          <Route   path='/customers' element={<Customer />} />

          <Route   path='/inventory' element={<Inventory />} />
          <Route   path='/order/:id' element={<Order />} />
          <Route   path='/customer/:id' element={<Customer />} />
          <Route   path='/payments' element={<Payments />} />
          <Route   path='/Backup' element={<Backup />} />


          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
