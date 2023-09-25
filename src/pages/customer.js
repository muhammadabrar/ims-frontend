import { Search } from "@carbon/icons-react";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import CustomerOrders from "../comp/customerOrders";
import { Modal, Button } from "react-bootstrap";
import Addpay from "../comp/addpay";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import EditCustomer from "../comp/editcustomer";

const Customer = () => {
  const { id } = useParams();
  const compRef = useRef();

const [customer, setcustomer] = useState([]);
const [loading, setloading] = useState(true);
const [Deleted, setDeleted] = useState(false);
const [Refresh, setRefresh] = useState(1);
const [paydeletesuccessMsg, setpaydeletesuccessMsg] = useState(false);
const [paydeleteerrorMsg, setpaydeleteerrorMsg] = useState(false);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/customer/${id}`)
      .then((res) => {
        console.log(res.data);
        setcustomer(res.data)
        setloading(false);
      })
      .catch((error) => {
        console.log(error);
      });
    
  }, [Refresh]);
  const deleteCutomer = () => {
    axios
      .delete(`http://localhost:5000/api/customer/${id}`)
      .then((res) => {
        setDeleted(true);

  
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [addpayment, setaddpayment] = useState(false);
function removepayment(pay, pay_id) {
 
     axios
    .put(`http://localhost:5000/api/customer/paypull/${id}`,
    {
      pay,
      pay_id
    }
          
    )
    .then((res) => {
      console.log(res.data);
      setpaydeletesuccessMsg(true)
      setpaydeleteerrorMsg(false)
      setRefresh(Refresh+1)
      setTimeout(() => {
        setpaydeletesuccessMsg(false);
      }, 3000);
    })
    .catch((error) => {
      console.log(error);
      setpaydeletesuccessMsg(false)
      setpaydeleteerrorMsg(true)
    });
  

}

const handlePrint = useReactToPrint({
  content: () => compRef.current,
});
const [printpayment, printsetpayment] = useState({});
function printdate(pay, bill, paydate) {
  printsetpayment({
    pay, bill, paydate
  })
  setTimeout(() => {
    handlePrint();
  }, 500);

}

const [editcustomer, seteditcustomer] = useState(false);
const handleeditClose = () => seteditcustomer(false);

  return (
    <div className="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li class="breadcrumb-item">
            <Link to="/#Customers">Customers</Link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {customer.Name}
          </li>
        </ol>
      </nav>
      {Deleted? <div className="py-4 my-4 text-center text-muted">
        <h1>This Customer has been removed</h1>
        <Link to="/" className="btn btn-primary">Home</Link>
      </div>:
      
      loading ? <h1 className="text-muted text-center py-5 my-5">Loading...</h1>:
      <>
      <div className="card shadow">
        <div className="card-header  bg-primary text-white d-flex justify-content-between align-items-center">
          <h3>{customer.Name}</h3>
          <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-warning" onClick={()=> seteditcustomer(true)}>
              Edit
            </button>
            <button type="button" className="btn btn-danger" onClick={()=> deleteCutomer()}>
              Delete
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 border-end">
              <h3 className="text-muted">received Payment</h3>
              <h2 className="text-primary border-bottom mb-3 pb-3">
                Rs. {customer.received}
              </h2>
              <h3 className="text-muted">Balance</h3>
              <h2 className="text-primary border-bottom mb-3 pb-3">
                Rs. {customer.received - customer.Total}
              </h2>
              <h3 className="text-muted">Total</h3>
              <h2 className="text-primary">Rs. {customer.Total}</h2>
            </div>
            <>
              <div className="col-md-6">
                <h3 className="text-muted">Phone</h3>
                <h2 className=" border-bottom mb-3 pb-3">
                  <a href={`tel: ${customer.ph}`}>{customer.ph}</a>
                </h2>
                <h3 className="text-muted">Address</h3>
                <h2 className="tex border-bottom mb-3 pb-3">{customer.address}</h2>
                <h3 className="text-muted">Note</h3>
                <p className="">
                {customer.note}
                </p>
              </div>
            </>
          </div>
        </div>
      </div>
      <div className="row mt-5">
        <CustomerOrders/>



        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center bg-white">
              <h3 className="card-title">Payments</h3>
              <button onClick={()=> setaddpayment(true)} className="btn btn-primary">
                          Add Payment
                        </button>
              
            </div>
            <div className="card-body p-0">
            {paydeletesuccessMsg && (
          <div class="alert alert-danger m-4 " role="alert">
            payment has been removed
          </div>
        )}
              
             
              {customer.payments.map((pay, index)=>
               <div className="px-3 pay-item">
               <div className="item-wrap d-flex justify-content-between align-items-center border-bottom">
                 <p className="sr ">{index+1}</p>
                 <p className="m-0">{pay.bill}</p>
                 <div className="">
                   <h4 className="text-primary ">Rs. {pay.pay}</h4>

                   <p className="text-muted m-0">{pay.date}</p>
                 </div>

                 <p className="m-0 payment-note">{pay.note}</p>
                 <div className="payment-action">
                 <div
                     className="btn-group"
                     role="group"
                     aria-label="Basic example"
                   >
            
                <button
                  type="button"
                  className="btn  btn-warning"
 onClick={()=> printdate(pay.pay, pay.bill, pay.date)}
                >
                  Print
                </button>
                     <button type="button" className="btn btn-danger" onClick={()=> removepayment(pay.pay, pay._id)}>
                     Remove
                     </button>
                   </div>
                 </div>
               </div>
               </div>
              
              )
             
              }
            </div>
          </div>
        </div>
      </div>
      </>
      }
      <Modal show={addpayment} onHide={()=> setaddpayment(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Addpay Refreshdata={()=> setRefresh(Refresh+1)} onHide={()=> setaddpayment(false)} id={id}/>
        </Modal.Body>
      </Modal>

      <Modal show={editcustomer} onHide={handleeditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditCustomer
            data={customer}
            Refreshdata={()=> setRefresh(Refresh+1)} 
            onHide={handleeditClose}
          />
        </Modal.Body>
      </Modal>
      <div style={{display: "none"}}>
      <div className="card-body" ref={compRef}>
            <div className="text-center">
              <h3>Zaman Hardware Store</h3>
              <p className="m-0">Topi swabi road (Kotha)</p>
                    <div>
                    <b>Phone.</b> 03488075167
                      <b className="mx-2">WhatsApp.</b> 03149191093

                    </div>
              <p className="bg-secondary badge">Sale</p>
            </div>
            <div className="d-flex mt-5 justify-content-between">
              <div className="col-md-6">
                <div className="order-meta">
                  <div className="meta">
                    <p className="meta-title">Invoice#</p>
                    <p className="meta-value">{printpayment.bill}</p>
                  </div>
                  <div className="meta ">
                    <p className="meta-title ">Customer:</p>
                    <p className="meta-value">{customer.Name}</p>
                  </div>
                  <div className="meta ">
                    <p className="meta-title ">Address:</p>
                    <p className="meta-value">{customer.address}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="order-meta">
                  <div className="meta ">
                    <p className="meta-title ">Date:</p>
                    <p className="meta-value">{printpayment.paydate}</p>
                  </div>
                  <div className="meta ">
                    <p className="meta-title ">Sale Man:</p>
                    <p className="meta-value">{customer.saleman}</p>
                  </div>
                  <div className="meta ">
                    <p className="meta-title ">Phone#:</p>
                    <p className="meta-value">{customer.ph}</p>
                  </div>
                </div>
              </div>
            </div>
            <hr />
           
           
            {/* <hr /> */}
            <div className="d-flex justify-content-end mx-3">
              <table className="table table-bordered price-table">
                <tbody>
                  
                  <tr>
                    <th>Paid</th>
                    <td className="text-end">{printpayment.pay}</td>
                  </tr>
                  <tr>
                    <th>Balance</th>
                    <td className="text-end">{customer.received - customer.Total}</td>
                  </tr>
                  <tr>
                    <th>Net Balance</th>
                    <td className="text-end">{customer.received - customer.Total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          </div>
    </div>
  );
};

export default Customer;
