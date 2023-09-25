import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search } from "@carbon/icons-react";
import axios from "axios";
const Header = () => {
  const title = useSelector((state) => state.title.value);
  // const title  =  "Dashboard"
  const [customers, setcustomers] = useState([]);
  const [loading, setloading] = useState(true);
  const [inventoriesloading, setinventoriesloading] = useState(true);
  const [ordersloading, setordersloading] = useState(true);

  const [inventories, setinventories] = useState([]);
  const [orders, setorders] = useState([]);
  const [data, setdata] = useState([]);
  const [resetFile, setresetFile] = useState('');
  const [resetloading, setresetloading] = useState(false);
  const [resetmsg, setresetmsg] = useState('');

      useEffect(() => {
        let all= {
            customers: customers,
            inventories: inventories,
            orders: orders
        }
        console.log(all);
        setdata(all)
    }, [orders, inventories, customers]);
  const downloadFile = async () => {
   await axios
   .get(`http://localhost:5000/api/customer`)
   .then((res) => {
     console.log(res.data);
     setcustomers(res.data);
     setloading(false);
     axios
     .get(`http://localhost:5000/api/inventory`)
     .then((res) => {
       console.log(res.data);
       setinventories(res.data);
       setinventoriesloading(false);
       axios
       .get(`http://localhost:5000/api/orders`)
       .then((res) => {
         console.log(res.data);
         setorders(res.data);
         setordersloading(false);
         downloadfiles()
   
       })
       .catch((error) => {
         console.log(error);
       });
 
     })
     .catch((error) => {
       console.log(error);
     });
   })
   .catch((error) => {
     console.log(error);
   });

   
   
   }

   async function downloadfiles() {

    const fileName = "file";
    const json = JSON.stringify(data);
    const blob = new Blob([json],{type:'application/json'});
    const href =  await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
   }
  return (
    <>
      <div className="header bg-primary">
        <h1 className="page-title text-white">{title}</h1>
        {/* <div className="search-bar">
          <select id="country" className="search-cat" name="country">
            <option value="Inventory">Inventory</option>
            <option value="Orders">Orders</option>
            <option value="Customers">Customers</option>
          </select>
          <div>
            <input
              className="search-input"
              placeholder="search..."
              type={"text"}
            ></input>
          </div>
          <button className="search-btn"><Search/></button>
        </div> */}
        <div className="nav--bar">
          <Link
            className={`nav-item ${title == "Dashboard" && "active"}`}
            to="/"
          >
            Home
          </Link>
          <Link
            className={`nav-item ${title == "Inventory" && "active"}`}
            to="/inventory"
          >
            Inventory
          </Link>
          <Link
          to={'backup'}
          // onClick={()=> downloadFile()}
            className={`btn btn-info `}
   
          >
            Backup
          </Link>
         
           {/* <button type="button" className="btn btn-info mx-3">
                  Dashboard
                </button>
                <button type="button" className="btn btn-warning">
                  Inventory
                </button> */}
          
          {/* <a
            className={`nav-item ${title == "Orders" && "active"}`}
            href="/orders"
          >
            Orders
          </a>
          <a
            className={`nav-item ${title == "Customers" && "active"}`}
            href="/orders"
          >
            Customers
          </a> */}
        
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Header;
