import { Search } from "@carbon/icons-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const CustomerOrders = () => {
  const { id } = useParams();
  const [orders, setorders] = useState([]);
  const [Deleted, setDeleted] = useState(false);
const [deleteOrderPop, setdeleteOrderPop] = useState(false);

  const [loading, setloading] = useState(true);
  const [ordersloading, setordersloading] = useState(true);
  const [search, setsearch] = useState();
  const [Refresh, setRefresh] = useState(1);
  const [row, setrow] = useState(orders);
const [orderid, setorderid] = useState();
  const searchResult = async (e) => {
    if (search) {
      const results = orders.filter(
        (orders) =>
          orders.Name.toLowerCase().includes(search) ||
          orders.date == search ||
          orders.order.toLowerCase().includes(search)
      );
      console.log("result :", results);
      setrow(results);
    } else {
      setrow(orders);
      console.log("row :", row);
    }
  };
  const handlesearch = (event) => {
    if (event.target.value) {
      setsearch(event.target.value);
      searchResult();
    } else {
      setrow(orders);
    }
  };
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/orders/customer/${id}`)
      .then((res) => {
        console.log(res.data);
        setorders(res.data);
        setrow(res.data);
        setordersloading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [Refresh]);

  const deletePopUp = (orderid) => {
    setorderid(orderid);
    setdeleteOrderPop(true);
  };
  const deletePopdown = () => setdeleteOrderPop(false);

  const deleteOrder = () => {
    axios
      .delete(`http://localhost:5000/api/orders/${orderid}/${id}`)
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
    <div className="col-md-6">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center bg-white">
          <h3 className="card-title">Orders</h3>
          <Link to="/inventory" className="btn btn-primary">
            Make New Order
          </Link>
        </div>
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
                    onChange={(e) => handlesearch(e)}
                  />
                  <div className="input-group-prepend">
                    <div className="input-group-text bg-primary text-white">
                      <Search />
                    </div>
                  </div>
                </div>
              </>
            </div>
           
          </div>
          {ordersloading ? (
            <h1 className="text-muted text-center">Loading...</h1>
          ) : orders.length > 0 ? (
            row.map((order, index) => (
              <div className="px-3 item">
                <div
                  className="item-wrap d-flex justify-content-between align-items-center border-bottom"
                >
                  <p className="sr">1</p>
                  <div>
                    <p className="m-0 product-title">Order# {order.order}</p>
                    <p className="text-muted m-0">{order.date}</p>
                  </div>
                  <h4 className="text-primary product-amount">Rs. {order.Total}</h4>
                  <button className="btn btn-danger" onClick={()=> deletePopUp(order._id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-muted text-center py-4">No orders yet</h1>
          )}
        </div>
      </div>
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

export default CustomerOrders;
