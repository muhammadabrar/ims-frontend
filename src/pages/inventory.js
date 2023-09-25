import { Edit } from "@carbon/icons-react";
import { Search } from "@carbon/icons-react";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { currentTitle } from "../data/title";
import { Close } from "@carbon/icons-react";
import { Link, useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { Menu } from "@carbon/icons-react";
import { OverflowMenuVertical } from "@carbon/icons-react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { addcustomer } from "../data/customer";

import Addinventory from "../comp/addinventory";
import Editinventorycomp from "../comp/editinventory";
import produce from "immer";
import Customers from "../comp/Customer";
import Addcustomer from "../comp/addcustomer";

const Inventory = () => {
  const [addinventory, setaddinventory] = useState(false);
  const [inventories, setinventories] = useState([]);
  const [print, setprint] = useState(false);
  const [IsMenu, setIsMenu] = useState(false);
  const [Refresh, setRefresh] = useState(1);
  const [Deleted, setDeleted] = useState(false);
  const [editinventory, seteditinventory] = useState(false);
  const [inventory, setinventory] = useState();
  const [deleteinventory, setdeleteinventory] = useState(false);
  const [qty, setqty] = useState(1);
  const [Loading, setloading] = useState(true);
  const [invetryrow, setinvetryrow] = useState(inventories);


  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/inventory`)
      .then((res) => {
        console.log(res.data);
        setinventories(res.data);
        setinvetryrow(res.data);
        setloading(false);
      })
      .catch((error) => {
        console.log(error);
      });
    // Update the document title using the browser API
    dispatch(currentTitle("Inventory"));
  }, [Refresh]);

  const searchinventoriesResult = async (e) => {
    if (search) {
      const results = inventories.filter(
        (inventories) =>
        inventories.title.toLowerCase().includes(search) 
      );
      console.log("result :", results);
      setinvetryrow(results);
    } else {
      setinvetryrow(inventories);
      console.log("row :", row);
    }
  };
  const handleinventoriessearch = (event) => {
    if (event.target.value) {
      setsearch(event.target.value);
    searchinventoriesResult();

    } else {
      setinvetryrow(inventories);
    }
  };
  const handleAddClose = () => setaddinventory(false);
  const handleeditClose = () => seteditinventory(false);
  const handledeleteClose = () => setdeleteinventory(false);

  const editinventoryShow = (title, id, price, retail, qty) => {
    setinventory({
      title,
      id,
      price,
      retail,
      qty,
    });
    seteditinventory(true);
  };
  const deleteinventoryShow = (id) => {
    setinventory(id);
    setdeleteinventory(true);
  };

  const deleteCutomer = (id) => {
    axios
      .delete(`http://localhost:5000/api/inventory/${id}`)
      .then((res) => {
        setDeleted(true);
        setRefresh(Refresh + 1);
        handledeleteClose();
        setTimeout(() => {
          setDeleted(false);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const Refreshdata = () => {
    setRefresh(Refresh + 1);
  };

  const handlemenu = async (id) => {
    setIsMenu(id == inventory ? !IsMenu : true);
    setinventory(id);
  };

  //cart
  const [customer, setcustomer] = useState({
    Name: "",
    phone: "",
    customer_id: "",
    received: 0,
    Total: 0,
    saleman: "",
  });
  const [customers, setcustomers] = useState([]);
  const [Iscustomer, setIscustomer] = useState(false);
  const [items, setitems] = useState([]);
  const [Total, setTotal] = useState(0);
  const [received, setreceived] = useState(0);
  const [balance, setbalance] = useState(0);
  const [Netbalance, setNetbalance] = useState(0);
  const [stock, setstock] = useState(0);
  const [Issubmit, setIssubmit] = useState(false);
  const [addCustomer, setaddCustomer] = useState(false);
  const [Customeradded, setCustomeradded] = useState(false);

  const [search, setsearch] = useState();
  const [row, setrow] = useState(customers);
  const handleAddcustomer = () => setaddCustomer(false);
  //cart

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/customer`)
      .then((res) => {
        console.log(res.data);
        setcustomers(res.data);
        setrow(res.data)
        setloading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let t = 0;
    let s = 0;

    items.forEach((element) => {
      t = t + element.Total;
      s = s + element.stock;
      console.log(t, s);
    });
    setstock(s);
    setTotal(t);
    setbalance(t - received);
    setNetbalance(
      ( Number(customer.Total) - Number(customer.received) )+ (t-received)
    );
  console.log("Netbalance: "+ Number(customer.Total) - Number(customer.received)+ (t-received));

  }, [items, received, customer]);
  function additemsInCart(title, id, price, retail,qty, sold ) {
    
    let item = {
      title,
      id,
      price,
      retail,
      qty: 1,
      Total: retail,
      stock: price,
    };
    setitems(
      produce((draft) => {
        let check = draft.find((check) => check.id === id);
        if (check ) {
          
          check.qty += 1;
          check.Total = check.qty * check.retail;
          check.stock = check.qty * check.price;
        
        } else {
          draft.push(item);
        }
      })
    );
  }
  function addcustomer(customerData) {
    setcustomer(customerData);
    setIscustomer(false);
    setCustomeradded(true)
  }

  const changePrice = (id, value) => {
    setitems(
      produce((draft) => {
        const item = draft.find((item) => item.id === id);
        item.retail = value;
        item.Total = item.qty * value;
        item.stock = item.qty * item.price;
      })
    );
  };
  const changeQty = (id, value) => {
    setitems(
      produce((draft) => {
        const item = draft.find((item) => item.id === id);
        item.qty = value;
        item.Total = item.qty * item.retail;
        item.stock = item.qty * item.price;
      })
    );
  };
  const incDecQty = (id, value) => {
    setitems(
      produce((draft) => {
        const item = draft.find((item) => item.id === id);
        item.qty += value;
        item.Total = item.qty * item.retail;
        item.stock = item.qty * item.price;
      })
    );
  };

  function removeItem(id) {
    setitems(items.filter((item) => item.id !== id));
  }
  console.log("items: " + items);
  console.log("Total: " + Total);
  function clearcart() {
    setitems([]);
    setcustomer({
      Name: "",
      phone: "",
      customer_id: "",
      received: 0,
      Total: 0,
      saleman: "",
    });
    setreceived(0);
  }
  const [orderloading, setorderloading] = useState(true);
  const [successMsg, setsuccessMsg] = useState(false);
  const [errorMsg, seterrorMsg] = useState(false);
  const [orderNo, setorderNo] = useState();
  useEffect( () => {
     axios
      .get(`http://localhost:5000/api/orders/count`)
      .then((res) => {
        console.log(res.data);
        let date = new Date().toISOString().slice(2, 4);
       

        setorderNo(String(date) + String(res.data+1));
        console.log(orderNo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [successMsg]);
  async function postorder() {
    setIssubmit(true);

    await axios
      .post("http://localhost:5000/api/orders", {
        Total,
        stock,
        customer_id: customer.customer_id,
        Name: customer.Name,
        received,
        ph: customer.ph,
        order: orderNo,
        items: items,
        bill: Math.floor(1000 + Math.random() * 9000),
        month: new Date().toISOString().slice(0, 7),
        date: new Date().toISOString().slice(0, 10)
      })
      .then(function (response) {
        console.log(response);
        console.log("sublited");
        setorderloading(false);
        setsuccessMsg(true);
        seterrorMsg(false);
        setRefresh(Refresh +1)
      })
      .catch(function (error) {
        console.log(error);
        setorderloading(false);

        seterrorMsg(true);
        setsuccessMsg(false);
        setTimeout(() => {
          seterrorMsg(false);
        }, 10000);
      });
  }
  const compRef = useRef();

  function cashCustomer() {


     axios
        .post("http://localhost:5000/api/customer", {
          Name: `Cash# ${orderNo}`,
          phone: "",
          customer_id: "",
          received: 0,
          Total: 0,
          saleman: `Cash# ${orderNo}`,
          date: Date(),
        })
        .then(function (response) {
          console.log(response);
          console.log("sublited");
          setcustomer({
            Name: `Cash# ${orderNo}`,
          phone: "",
          customer_id: response.data.data._id,

          received: 0,
          Total: 0,
          saleman: `Cash# ${orderNo}`,
          });
          setIscustomer(false);
          setCustomeradded(true)
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
 
  }



  useEffect(() => {
    searchResult();
  }, [search]);
  const searchResult = async (e) => {
    if (search) {
      const results = customers.filter(
        (customers) =>
        customers.Name.toLowerCase().includes(search) ||
        customers.ph.toLowerCase().includes(search) ||
        customers.address.toLowerCase().includes(search) 
      );
      console.log("result :", results);
      setrow(results);
    } else {
      setrow(customers);
      console.log("row :", row);
    }
  };
  const handlesearch = (event) => {
    if (event.target.value) {
      setsearch(event.target.value);
    } else {
      setrow(customers);
    }
  };
  return (
    <div className="container-fluid">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>

          <li className="breadcrumb-item active" aria-current="page">
            Inventory
          </li>
        </ol>
      </nav>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center bg-white">
              <h3 className="card-title">Inventory</h3>
              <div
                className="btn-group"
                role="group"
                aria-label="Basic example"
              >
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setaddinventory(true)}
                >
                  Add Inventory
                </button>
               
              </div>
            </div>
            <div className="card-body">
              <div className="input-group mb-4 pb-4">
                <input
                  type="text"
                  className="form-control shadow-none"
                  
                  onChange={(e)=> handleinventoriessearch(e)}
                  placeholder="Search Product..."
                />
                <div className="input-group-prepend">
                  <div className="input-group-text bg-primary text-white">
                    <Search />
                  </div>
                </div>
              </div>
              {Deleted && (
                <div class="alert alert-danger">Inventory has been deleted</div>
              )}
              {invetryrow.map((item, index) => (
                <div className="px-3  " key={item._id}>
                  <>
                    <div
                      className=" d-flex   align-items-center border-bottom"
                      style={{ width: "100%" }}
                    >
                      <p className="sr">{index + 1}</p>
                      <div className="product-title">
                        <p className="m-0  ">{item.title} </p>
                        <div className="text-muted d-flex    align-items-center">
                          <p>
                            <b>qty:</b> {item.qty - item.sold}
                          </p>
                          <p className="ml-2">
                            <b>price:</b> {item.price}
                          </p>
                          <p className="ml-2">
                            <b>sold:</b> {item.sold}
                          </p>
                          <p className="ml-2">
                            <b>Total Stock:</b> {(item.qty - item.sold) * item.price}
                          </p>
                        </div>
                      </div>

                      <div className="product-amount">
                        <p className="m-0">Re. price</p>
                        <h4 className="text-primary  ">Rs. {item.retail}</h4>
                      </div>
                      <div className="">
                        <div className="product-actions btn-group">
                          <button
                            type="button "
                            className="btn shodow-none btn-warning"
                            disabled={item.qty - item.sold  == 0}
                            onClick={() =>
                              additemsInCart(
                                item.title,
                                item._id,
                                item.price,
                                item.retail,
                                item.qty,
                                item.sold 
                              )
                            }
                          >
                            Add to cart
                          </button>
                          <button
                            type="button"
                            onClick={() => handlemenu(item._id)}
                            className="btn shodow-none  btn-primary"
                          >
                            <OverflowMenuVertical />
                          </button>
                          {IsMenu && inventory == item._id && (
                            <>
                              <div
                                className="overlay"
                                onClick={() => setIsMenu(false)}
                              ></div>
                              <div className="drop-menu">
                                <div className="list-group">
                                  <a
                                    href="#"
                                    className="list-group-item list-group-item-action"
                                    onClick={() =>
                                      editinventoryShow(
                                        item.title,
                                        item._id,
                                        item.price,
                                        item.retail,
                                        item.qty
                                      )
                                    }
                                  >
                                    Edit
                                  </a>
                                  <a
                                    href="#"
                                    className="list-group-item list-group-item-action"
                                    onClick={() => deleteCutomer(item._id)}
                                  >
                                    Delete
                                  </a>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              ))}
            </div>
            <div className="card-footer"></div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3>Cart</h3>
              <button className="btn btn-info" onClick={() => clearcart()}>
                Clear
              </button>
            </div>
            <div className="card-body">
              <div
                className="btn-group w-100"
                role="group"
                aria-label="Basic example"
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIscustomer(true)}
                >
                  select exist customer
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setaddCustomer(true)}
                >
                  Add New Customer
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => cashCustomer()}
                >
                  Cash Customer
                </button>
              </div>
              <div className="d-flex mt-5 justify-content-between">
                <div className="col-md-6">
                  <div className="order-meta">
                    <div className="meta ">
                      <p className="meta-title ">Customer:</p>
                      <p className="meta-value">{customer.Name}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="order-meta">
                    <div className="meta ">
                      <p className="meta-title ">Sale Man:</p>
                      <p className="meta-value">{customer.saleman}</p>
                    </div>
                  </div>
                </div>
              </div>
              <hr />

              {items.length < 1 ? (
                <>
                  <h3 className="text-muted text-center py-3">Cart is empty</h3>
                </>
              ) : (
                items.map((item, index) => (
                  <>
                    <div className="px-3 d-flex justify-content-between align-items-center">
                      <div className=" d-flex  align-items-center border-bottom">
                        <p className="sr">{index + 1}</p>
                        <div className="product-title">
                          <p className="m-0">{item.title}</p>
                          <div className="text-muted d-flex    align-items-center">
                            <p style={{ marginRight: "4rem" }}>
                              qty: {item.qty}
                            </p>
                            <div className=" d-flex align-items-center">
                              <p className="ml-4">price/unit: Rs.</p>
                              <input
                                type="Number"
                                className="price-input"
                                onChange={(e) =>
                                  changePrice(item.id, e.target.value)
                                }
                                value={item.retail}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="cart-product-amount">
                          <h4 className="text-primary  ">Rs. {item.Total}</h4>
                          <div className="counter border">
                            <span
                              className="down"
                              onClick={() => incDecQty(item.id, -1)}
                            >
                              -
                            </span>
                            <input
                              type="text"
                              onChange={(e) =>
                                changeQty(item.id, e.target.value)
                              }
                              value={item.qty}
                            />
                            <span
                              className="up"
                              onClick={() => incDecQty(item.id, 1)}
                            >
                              +
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="btn btn-danger"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ))
              )}
              <hr />
              <div className="d-flex justify-content-end">
                <table className="table table-bordered price-table">
                  <tbody>
                    <tr>
                      <th>Total</th>
                      <td className="text-end">{Total}</td>
                    </tr>
                    <tr>
                      <th>Received</th>
                      <td className="text-end">
                        <input
                          type={"number"}
                          className="payment-input"
                          value={received}
                          onChange={(e) => setreceived(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>Balance</th>
                      <td className="text-end">{balance}</td>
                    </tr>
                    <tr>
                      <th>Privous Balance</th>
                      <td className="text-end">{customer.Total - customer.received}</td>
                    </tr>
                    <tr>
                      <th>Net Balance</th>
                      <td className="text-end">{Netbalance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer d-flex justify-content-end">
              {/* <ReactToPrint
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
            /> */}
              <button
                type="button"
                className="btn btn-lg  btn-primary"
                onClick={() => postorder()}
                disabled={!Customeradded || !items.length>0}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal show={addinventory} onHide={handleAddClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Inventory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Addinventory Refreshdata={Refreshdata} onHide={handleAddClose} />
        </Modal.Body>
      </Modal>
      <Modal show={editinventory} onHide={handleeditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Edit Inventory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Editinventorycomp
            data={inventory}
            Refreshdata={Refreshdata}
            onHide={handleAddClose}
          />
        </Modal.Body>
      </Modal>
      <Modal show={Iscustomer} onHide={() => setIscustomer(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="input-group px3">
                <input
                  type="text"
                  className="form-control shadow-none"
                  id="inlineFormInputGroupUsername"
                  placeholder="Customer Search..."
                  onChange={(event)=> handlesearch(event)}
                />
                <div className="input-group-prepend">
                  <div className="input-group-text bg-primary text-white">
                    <Search />
                  </div>
                </div>
              </div>
          {customers.length > 0 ? (
            row.map((customer, index) => (
              <div className="d-flex justify-content-between align-items-center customers">
                <div>
                  <p className="m-0">
                    <b>{customer.Name}</b>
                  </p>
                  <p>{customer.saleman}</p>
                </div>
                <div>
                  <p className="m-0">{customer.address}</p>
                  <p>{customer.ph}</p>
                </div>
                <button
                  className="btn btn-warning"
                  onClick={() =>
                    addcustomer({
                      Name: customer.Name,
                      phone: customer.ph,
                      customer_id: customer._id,
                      received: customer.received,
                      Total: customer.Total,
                      saleman: customer.saleman,
                      ph: customer.ph,
                      address: customer.address,
                    })
                  }
                >
                  Add To Cart
                </button>
              </div>
            ))
          ) : (
            <h3 className="text-center text-muted">
              Sorry No customers Available
            </h3>
          )}
        </Modal.Body>
      </Modal>
      <Modal show={addCustomer} onHide={handleAddcustomer}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Addcustomer
            addcustomer={addcustomer}
            addtocart={true}
            Refreshdata={Refreshdata}
            onHide={handleAddcustomer}
          />
        </Modal.Body>
      </Modal>
      <Modal show={Issubmit} size="lg" onHide={() => setIssubmit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Order Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successMsg && (
            <div class="alert alert-success mx-4" role="alert">
              order has been stored You can printout now
            </div>
          )}
          {orderloading ? (
            <h1 className="text-muted">Loading...</h1>
          ) : errorMsg ? (
            <div class="alert alert-danger mx-4" role="alert">
              something is wrong please try again
            </div>
          ) : (
            <div
            // style={{ display: "none" }}
            >
              {
                <div className="card-body" ref={compRef}>
                  <div className="text-center">
                    <h3>Zaman Hardware Store</h3>
                    <p className="m-0">Topi swabi road (Kotha)</p>
                    <div>
                    <b >Phone.</b> 03488075167
                      <b className="mx-2">WhatsApp.</b> 03149191093

                    </div>

                    <p className="bg-secondary badge">Sale</p>
                  </div>
                  <div className="d-flex mt-5 justify-content-between">
                    <div className="col-md-6">
                      <div className="order-meta">
                        <div className="meta">
                          <p className="meta-title">Invoice#</p>
                          <p className="meta-value">{orderNo}</p>
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
                          <p className="meta-title ">Date</p>
                          <p className="meta-value">
                            {new Date().toISOString().slice(0, 10)}
                          </p>
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
                      <h4 className="text-primary product-amount">
                        Total Amount
                      </h4>
                    </div>
                  </div>
                  {items.length > 0 &&
                    items.map((item, index) => (
                      <div className="px-3 order-item ">
                        <div
                          className="order-item-wrap d-flex   align-items-center border-bottom"
                          style={{ width: "100%" }}
                        >
                          <p className="sr">{index + 1}</p>
                          <div className="product-title">
                            <p className="m-0  ">{item.title} </p>
                            <div className="text-muted d-flex    align-items-center">
                              <p style={{ marginRight: "4rem" }}>
                                <b>qty: </b>
                                {item.qty}
                              </p>
                              <p className="ml-4">
                                <b>price/unit: Rs.</b> {item.retail}
                              </p>
                            </div>
                          </div>

                          <div className="product-amount">
                            <h4 className="text-primary  ">Rs. {item.Total}</h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  <hr />
                  <div className="d-flex justify-content-end">
                    <table className="table table-bordered price-table">
                      <tbody>
                        <tr>
                          <th>Total</th>
                          <td className="text-end">{Total}</td>
                        </tr>
                        <tr>
                          <th>Received</th>
                          <td className="text-end">{received}</td>
                        </tr>
                        <tr>
                          <th>Balance</th>
                          <td className="text-end">{balance}</td>
                        </tr>
                        <tr>
                      <th>Privous Balance</th>
                      <td className="text-end">{customer.Total - customer.received}</td>
                    </tr>
                        <tr>
                          <th>Net Balance</th>
                          <td className="text-end">{Netbalance}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              }
            </div>
          )}
        </Modal.Body>
        <div className="modal-footer">
          <ReactToPrint
            trigger={() => (
              <button
                type="button"
                className="btn btn-lg mx-4 btn-success"
                onClick={() => setprint(true)}
              >
                Print
              </button>
            )}
            content={() => compRef.current}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;
