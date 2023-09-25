import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { currentTitle } from '../data/title'
const Orders = () => {
        
    const dispatch = useDispatch()
    useEffect(() => {
        // Update the document title using the browser API
        dispatch(currentTitle("Orders"))
    }, []);
    return (
        <div>
            <h1>orders</h1>
        </div>
    );
}

export default Orders;
