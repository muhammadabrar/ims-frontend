import { Close } from "@carbon/icons-react";
import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";

const Order = () => {
  const { id } = useParams();
  const compRef = useRef();
  const [print, setprint] = useState(false);
  const [qty, setqty] = useState(1);
  const [order, setorder] = useState();
  const [loading, setloading] = useState(true);
  const [customer, setcustomer] = useState();
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/orders/${id}`)
      .then((res) => {
        console.log(res.data);
        setorder(res.data)
        axios
        .get(`http://localhost:5000/api/customer/${res.data.customer_id}`)
        .then((res) => {
          console.log(res.data);
          setcustomer(res.data)
          setloading(false);
        })
        .catch((error) => {
          console.log(error);
        });
      })
      .catch((error) => {
        console.log(error);
      });
    
  }, []);
  const [deleted, setdeleted] = useState(false);
  const deleteOrder = () => {
    axios
      .delete(`http://localhost:5000/api/orders/${id}/${customer._id}`)
      .then((res) => {
        setdeleted(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="container-fluid">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/#orders">orders</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {id}
          </li>
        </ol>
      </nav>

     {deleted? <div className="text-muted text-center py-4 my-4">
       <h1>This order has been deleted</h1>
       <Link to="/" className="btn btn-primary">back</Link>
     </div>:
     
     loading? <h1 className="text-center text-muted">Loading...</h1>: <div className="d-flex  justify-content-center">
        <div className="card invoice-card shadow">
          <div className="card-header d-flex justify-content-between align-items-center">
            Order Detail
            <button type="button" className="btn  btn-danger" onClick={()=> deleteOrder()}>
              Delete
            </button>
          </div>
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
                    <p className="meta-value">{order.order}</p>
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
                    <p className="meta-value">{order.date}</p>
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
            <div className="px-3 order-item ">
              <div
                className="order-item-wrap  d-flex  align-items-center border-bottom"
                style={{ width: "100%" }}
              >
                <p className="sr m-0">#</p>
                <div className="product-title">
                  <p className="m-0 ">Product</p>
                </div>
                <h4 className="text-primary product-amount">Total Amount</h4>
              </div>
            </div>
            {order.items.map((item, index)=>
            <div className="px-3 order-item ">
            <div
              className="order-item-wrap d-flex   align-items-center border-bottom"
              style={{ width: "100%" }}
            >
              <p className="sr">{index+1}</p>
              <div className="product-title">
                <p className="m-0  ">{item.title}</p>
                <div className="text-muted d-flex    align-items-center">
                  <p style={{ marginRight: "4rem" }}><b>qty: </b>{item.qty}</p>
                  <p className="ml-4"><b>price/unit:</b> Rs. {item.retail}</p>
                </div>
              </div>

              <div className="product-amount">
                <h4 className="text-primary  ">Rs. {item.Total}</h4>
              </div>
            </div>
          </div>
            
            )
            }
            {/* <hr /> */}
            <div className="d-flex justify-content-end mx-3">
              <table className="table table-bordered price-table">
                <tbody>
                  <tr>
                    <th>Total</th>
                    <td className="text-end">{order.Total}</td>
                  </tr>
                  <tr>
                    <th>Received</th>
                    <td className="text-end">{order.received}</td>
                  </tr>
                  <tr>
                    <th>Balance</th>
                    <td className="text-end">{order.received - order.Total}</td>
                  </tr>
                  <tr>
                      <th>Privous Balance</th>
                      <td className="text-end">{customer.Total - customer.received}</td>
                    </tr>
                  <tr>
                    <th>Net Balance</th>
                    <td className="text-end">{customer.received - customer.Total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-end">
            <ReactToPrint
              trigger={() => (
                <button
                  type="button"
                  className="btn mx-4 btn-warning"
                  onClick={() => setprint(true)}
                >
                  Print
                </button>
              )}
              content={() => compRef.current}
            />
           
          </div>
        </div>
      </div>}
      
    </div>
  );
};

export default Order;
