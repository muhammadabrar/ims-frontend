import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Customers from '../comp/Customer';
import Orders from '../comp/orders';
import States from '../comp/states';
import { currentTitle } from '../data/title'
import { addcustomer } from '../data/customer'
import { addinvetories } from "../data/inventory";


const Dashboard = () => {

    const [loading, setloading] = useState(true);
  const [Refresh, setRefresh] = useState(1);

    const dispatch = useDispatch()
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/customer`)
      .then((res) => {
        console.log(res);
        // setdata(res.data);
        setloading(false);
        dispatch(addcustomer(res.data))
      })
      .catch((error) => {
        console.log(error);
      });
      axios
      .get(`http://localhost:5000/api/inventory`)
      .then((res) => {
        console.log(res);
        // setdata(res.data);
        setloading(false);
        dispatch(addinvetories(res.data))
      })
      .catch((error) => {
        console.log(error);
      });
  }, [Refresh]);

    useEffect(() => {
        
        dispatch(currentTitle("Dashboard"))
    }, []);
    return (
        <div className='containerfluid'>
           {loading?<h1 className='text-muted text-center py-4 my-4'>Loading...</h1>: <>           
            <States/>
           <div className='wrap d-flex justify-content-between'>
               <div className='col-md-6' ><Orders/></div>
               <div className='col-md-6'><Customers/></div>

           </div>
           </>}

        </div>
    );
}

export default Dashboard;
