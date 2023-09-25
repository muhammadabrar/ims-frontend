import axios from 'axios';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'

const Addinventory = (props) => {
  const [title, settitle] = useState('');
  const [qty, setqty] = useState('');
  const [price, setprice] = useState('');
  const [retail, setretail] = useState('');
  const [loading, setloading] = useState(false);
  const [successMsg, setsuccessMsg] = useState(false);
  const [errorMsg, seterrorMsg] = useState(false);
  const dispatch = useDispatch()


  const handleForm = async (e) => {
    e.preventDefault();
    setloading(true);

    
      await axios
        .post("http://localhost:5000/api/inventory", {
            title,
          qty,
          price,
          retail,
          sold: 0,
          date: Date(),
        })
        .then(function (response) {
          console.log(response);
          console.log("sublited");
          settitle("");
          setprice("");
          setretail("");
          setqty("");
          setloading(false);
          setsuccessMsg(true);
          seterrorMsg(false);
         props.Refreshdata()
        })
        .catch(function (error) {
          console.log(error);
          setloading(false);

          seterrorMsg(true);
          setsuccessMsg(false);
          setTimeout(() => {
            seterrorMsg(false);
          }, 10000);
        });
  
  };

    return (
        <>
       {successMsg? <div className='success text-center'>
            <h1 className='text-success'>Inventory added</h1>
            <button className='btn btn-primary' onClick={()=> setsuccessMsg(false)}>add another Inventory</button>
       
       </div>:<>
      {errorMsg && <div class="alert alert-danger">
    something is wrong please try again
    </div>}
       <form className="form" onSubmit={(e)=> handleForm(e)}>
          <div className="form-group">
            <label for="exampleInputEmail1">Product Title</label>
            <input type="text" className="form-control shadow-none" value={title} onChange={(e)=> settitle(e.target.value)} placeholder="Enter Product Title" required/>
          </div>
          <div className="form-group">
            <label for="exampleInputEmail1">Qty</label>
            <input type="Number" className="form-control shadow-none" value={qty} onChange={(e)=> setqty(e.target.value)} placeholder="Enter qty"/>
          </div>
          <div className="form-group">
            <label for="exampleInputEmail1">price</label>
            <input type="Number" className="form-control shadow-none" value={price} onChange={(e)=> setprice(e.target.value)} placeholder="Enter price"/>
          </div>
          <div className="form-group">
            <label for="exampleInputEmail1">retail</label>
            <input type="Number" className="form-control shadow-none" value={retail} onChange={(e)=> setretail(e.target.value)} placeholder="Enter retail"/>
          </div>
         

          <button type="submit" className="btn btn-primary" disabled={loading}>{loading? "Loading...": "Submit"}</button>
        
        </form></>}
        </>
    );
}

export default Addinventory;
