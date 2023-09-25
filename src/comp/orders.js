import { Search } from "@carbon/icons-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Orders = () => {
  const [data, setdata] = useState([]);
  const [loading, setloading] = useState(true);
  const [Deleted, setDeleted] = useState(false);
  const [Refresh, setRefresh] = useState(1);
const [deleteOrderPop, setdeleteOrderPop] = useState(false);
const [orderid, setorderid] = useState();
const [search, setsearch] = useState();
const [row, setrow] = useState(data);

const [date, setdate] = useState( new Date().toISOString().slice(0, 10));
useEffect(() => {
  searchResult();
}, [search]);
const searchResult = async (e) => {
  if (search) {
    const results = data.filter(
      (data) =>
        data.Name.toLowerCase().includes(search) ||
        data.ph.toLowerCase().includes(search) ||
        data.order.toLowerCase().includes(search) 
    );
    console.log("result :", results);
    setrow(results);
  } else {
    setrow(data);
    console.log("row :", row);
  }
};
const handlesearch = (event) => {
  if (event.target.value) {
    setsearch(event.target.value);
  } else {
    setrow(data);
  }
};
  useEffect( () => {
  
       axios
      .get(`http://localhost:5000/api/orders/date/${date}`)
      .then((res) => {
        console.log(res.data);
        setdata(res.data)
        setrow(res.data)
        setloading(false)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [Refresh, date]);

  const deletePopUp = (id, customer_id) => {
    setorderid({id,customer_id});
    setdeleteOrderPop(true);
  };
  const deletePopdown = () => setdeleteOrderPop(false);

  const deleteOrder = () => {
    axios
      .delete(`http://localhost:5000/api/orders/${orderid.id}/${orderid.customer_id}`)
      .then((res) => {
        setDeleted(true);
        setRefresh(Refresh + 1);
        deletePopdown()
        setTimeout(() => {
          setDeleted(false);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="orders card " id="orders">
      <div className="card-header d-flex justify-content-between align-items-center bg-white">
        <h3 className="card-title">Orders</h3>
   
      </div>
      {Deleted && (
          <div class="alert alert-danger mx-4" role="alert">
            Order has been deleted
          </div>
        )}
     {loading? <h1 className="text-center text-muted px-4">loading..</h1>:
     
   
     
     <div className="card-body p-0">

        <div className="row p-3">
          <div className="col-md-6">
            {/* <input type="text" className="form-control" placeholder='Search...' /> */}
            <>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control shadow-none"
                  id="inlineFormInputGroupUsername"
                  placeholder="Order Search..."
                  onChange={(event)=> handlesearch(event)}
                />
                <div className="input-group-prepend">
                  <div className="input-group-text bg-primary text-white">
                    <Search />
                  </div>
                </div>
              </div>
            </>
          </div>
          <div className="col-md-6">
            <input
              type="date"
              className="form-control shadow-none"
              value={date}
              onChange={(e)=> setdate(e.target.value)}

            />
          </div>
        </div>
       { data.length<1 ? <h1 className="text-muted text-center my-4">You have No order yet</h1>:
        row.map((order, index)=><div className="px-3 item">

          <div
            className="item-wrap d-flex justify-content-between align-items-center border-bottom"
          >
            <>
            <p>{index+1}</p>

            <Link to={`/order/${order._id}`} className="link">
              <p className="m-0">Order# {order.order}</p>
              <p className="text-muted m-0">{order.date}</p>
            </Link>
            <div> 
            <Link to={`/customer/${order.customer_id}`} className="link m-0">{order.Name}</Link>
            <p className="m-0 "><a href={`tel: ${order.ph}`} className="text-muted link" >{order.ph}</a></p>
            </div>

            <h4 className="text-primary">Rs. {order.Total}</h4>
            </>
            <button className="btn btn-danger shadow-none" onClick={()=> deletePopUp(order._id, order.customer_id)}>Delete</button>
          </div>
        </div>)}
        
    
    
      </div>}
      <div className="card-footer">{data.length} Orders On {date}</div>
      <Modal show={deleteOrderPop} onHide={deletePopdown}>
       
       <Modal.Body className="text-center">
         <h3>Delete Order</h3>
         <h4 className="text-muted p-4">Are you sure You want to delete this Order?</h4>
       </Modal.Body>
       <Modal.Footer>
   <Button variant="secondary" onClick={()=> deletePopdown()}>Close</Button>
   <Button variant="danger" onClick={()=> deleteOrder()}>Delete</Button>
 </Modal.Footer>
     </Modal>
    </div>
  );
};

export default Orders;
