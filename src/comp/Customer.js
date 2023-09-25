import { Search } from "@carbon/icons-react";
import React, { useEffect, useState } from "react";
import Addcustomer from "./addcustomer";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import EditCustomer from "./editcustomer";
import { addcustomer } from "../data/customer";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Customers = () => {
  const [addCustomer, setaddCustomer] = useState(false);
  const customers = useSelector((state) => state.customers.value);

  //  const [data, setdata] = useState(customers);

  const [Loading, setloading] = useState(true);
  const [Deleted, setDeleted] = useState(false);
  const [editcustomer, seteditcustomer] = useState(false);
  const [search, setsearch] = useState();

  const [Refresh, setRefresh] = useState(1);
  const [customer, setcustomer] = useState();
const [deletecustomer, setdeletecustomer] = useState(false);
  const handleAddClose = () => setaddCustomer(false);
  const handleeditClose = () => seteditcustomer(false);
  const handledeleteClose = () => setdeletecustomer(false);

  const dispatch = useDispatch();
  const [row, setrow] = useState(customers);
  useEffect(() => {
    // axios
    //   .get(`http://localhost:5000/api/customer`)
    //   .then((res) => {
    //     console.log(res.data);
    //     setrow(res.data)
    //     setloading(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    //    
     setrow(customers)


  }, [Refresh, customers]);

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
    searchResult();

    } else {
      setrow(customers);
    }
  };

  const editcustomerShow = (Name, _id, saleman, ph, address, note) => {
    setcustomer({
      Name,
      _id,
      saleman,
      ph,
      address,
      note,
    });
    seteditcustomer(true);
  };

  const deletecustomerShow = (id) => {
    setcustomer(id);
    setdeletecustomer(true);
  };


  const deleteCutomer = () => {
    axios
      .delete(`http://localhost:5000/api/customer/${customer}`)
      .then((res) => {
        setDeleted(true);
        setRefresh(Refresh + 1);
        handledeleteClose()
        axios
          .get(`http://localhost:5000/api/customer`)
          .then((res) => {
            console.log(res.data);
            dispatch(addcustomer(res.data));
          })
          .catch((error) => {
            console.log(error);
          });

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
  return (
    <div className="Customers card " id="Customers">
      <div className="card-header d-flex justify-content-between align-items-center bg-white">
        <h3 className="card-title">Customers</h3>
        <button
          className="btn btn-primary shadow-none"
          onClick={() => setaddCustomer(true)}
        >
          Add New Customer
        </button>
      </div>
      <div className="card-body p-0">
        <div className="row p-3">
          <div className="col-md-12">
            {/* <input type="text" className="form-control" placeholder='Search...' /> */}
            <>
              <div className="input-group">
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
            </>
          </div>
        </div>
        {Deleted && (
          <div class="alert alert-danger mx-4" role="alert">
            Customer has been deleted
          </div>
        )}
        {
        row.map((data, index) => (
          <div key={data._id} className="px-3 item">
            <div className="item-wrap d-flex justify-content-between align-items-center ">
              <p>{index + 1}</p>
              <div>
                <p className="m-0">
                  <Link to={`customer/${data._id}`} className="link">
                    {data.Name}
                  </Link>
                </p>
                <a href={`tel: ${data.ph}`} className="link text-muted m-0">
                  {data.ph}
                </a>
              </div>

              <div>
                <p className="m-0">Sale name</p>
                <p className="text-muted m-0">{data.saleman}</p>
              </div>
              <div
                className="btn-group"
                role="group"
                aria-label="Basic example"
              >
                <button
                  className="btn shadow-none btn-warning"
                  onClick={() =>
                    editcustomerShow(
                      data.Name,
                      data._id,
                      data.saleman,
                      data.ph,
                      data.address,
                      data.note
                    )
                  }
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger shadow-none"
                  onClick={() => deletecustomerShow(data._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {customers.length < 1 && (
          <h1 className="text-center text-muted my-5 py-5">
            Sorry no customer you have
          </h1>
        )}
      </div>
      <div className="card-footer">
        You have total {customers.length} Customer
      </div>
      <Modal show={addCustomer} onHide={handleAddClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Addcustomer Refreshdata={Refreshdata} onHide={handleAddClose} />
        </Modal.Body>
      </Modal>
      <Modal show={editcustomer} onHide={handleeditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditCustomer
            data={customer}
            Refreshdata={Refreshdata}
            onHide={handleeditClose}
          />
        </Modal.Body>
      </Modal>
      <Modal show={deletecustomer} onHide={handledeleteClose}>
       
        <Modal.Body className="text-center">
          <h3>Delete Customer</h3>
          <h4>Are you sure You want to delete this customer?</h4>
          <h5 className="text-danger">Note Orders and payments record will be also deleted of this customer</h5>
        </Modal.Body>
        <Modal.Footer>
    <Button variant="secondary" onClick={()=> handledeleteClose()}>Close</Button>
    <Button variant="danger" onClick={()=> deleteCutomer()}>Delete</Button>
  </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Customers;
