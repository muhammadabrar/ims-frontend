import axios from 'axios';
import React, { useState } from 'react';

const Addpay = (props) => {
  const [pay, setpay] = useState('');
  const [note, setnote] = useState('');
  const [loading, setloading] = useState(false);
  const [successMsg, setsuccessMsg] = useState(false);
  const [errorMsg, seterrorMsg] = useState(false);


  async function addpayment(e) {
    e.preventDefault();

    await axios
    .put(`http://localhost:5000/api/customer/pay/${props.id}`,
    {
      pay,
      note,
      bill: Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().slice(0, 10)
    }
          
    )
    .then((res) => {
      console.log(res.data);
      setsuccessMsg(true)
      seterrorMsg(false)
      setloading(false);
      props.Refreshdata()
    })
    .catch((error) => {
      console.log(error);
      setsuccessMsg(false)
      seterrorMsg(true)
      setloading(false);
    });
  }

    return (
        <>
       {successMsg? <div className='success text-center'>
            <h1 className='text-success'>Payment added</h1>
            <button className='btn btn-primary my-4' onClick={()=> props.onHide()}>Close</button>
       
       </div>:<>
      {errorMsg && <div class="alert alert-danger">
    something is wrong please try again
    </div>}
       <form className="form" onSubmit={(e)=> addpayment(e)}>
          <div className="form-group">
            <label for="exampleInputEmail1">Payment</label>
            <input type="Number" className="form-control shadow-none" value={pay} onChange={(e)=> setpay(e.target.value)} placeholder="Enter Payment" required/>
          </div>
          <div className="form-group">
            <label for="exampleInputEmail1">Note</label>
            <textarea type="text" className="form-control shadow-none" value={note} onChange={(e)=> setnote(e.target.value)} placeholder="Enter Note"/>
          </div>
         
         

          <button type="submit" className="btn btn-primary" disabled={loading}>{loading? "Loading...": "Submit"}</button>
        
        </form></>}
        </>
    );
}

export default Addpay;
