import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { currentTitle } from '../data/title'
const Backup = () => {
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
    const dispatch = useDispatch()
    useEffect(async() => {
       await axios
        .get(`http://localhost:5000/api/customer`)
        .then((res) => {
          console.log(res.data);
          setcustomers(res.data);
          setloading(false);
        })
        .catch((error) => {
          console.log(error);
        });

        await  axios
        .get(`http://localhost:5000/api/inventory`)
        .then((res) => {
          console.log(res.data);
          setinventories(res.data);
          setinventoriesloading(false);
        })
        .catch((error) => {
          console.log(error);
        });
        await  axios
        .get(`http://localhost:5000/api/orders`)
        .then((res) => {
          console.log(res.data);
          setorders(res.data);
          setordersloading(false);
        })
        .catch((error) => {
          console.log(error);
        });
        // Update the document title using the browser API
        dispatch(currentTitle("Backup"))
       
    }, []);
    useEffect(() => {
        let all= {
            customers: customers,
            inventories: inventories,
            orders: orders
        }
        console.log(all);
        setdata(all)
    }, [orders, inventories, customers]);

    console.log(data);


    const downloadFile = async () => {
        const {myData} = data; // I am assuming that "this.state.myData"
                                     // is an object and I wrote it to file as
                                     // json
        const fileName = [`Backup ${Date()}`];
        const json = JSON.stringify(data);
        const blob = new Blob([json],{type:'application/json'});
        const href = await URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      const handleChange = e => {
        setresetloading(true)

        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
          console.log("e.target.result", e.target.result);
          setresetFile(e.target.result);
        };

        console.log("resetFile: " + resetFile);
         
       axios
      .post("http://localhost:5000/api/customer/reset", {
        resetFile
      })
      .then(function (response) {
        console.log(response);
        console.log("sublited");
        setresetloading(false)
        // setloading(false);
        // setsuccessMsg(true);
        // seterrorMsg(false);
        setresetmsg("submited")
      })
      .catch(function (error) {
        console.log(error);
        // setloading(false);

        // seterrorMsg(true);
        // setsuccessMsg(false);
        // setTimeout(() => {
        //   seterrorMsg(false);
        // }, 10000);
      });
      };
    return (
        <div className='container'>
           <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>

          <li className="breadcrumb-item active" aria-current="page">
            Backup
          </li>
        </ol>
      </nav>

     {loading && ordersloading && inventoriesloading ? <h1 className='text-muted py-4 my-4'>Loading...</h1>:
      <div>
          <button className='btn btn-lg btn-primary' onClick={()=> downloadFile()}>Backup</button><br/>
          {/* <input type={"file"} className="form-control my-4" onChange={(e)=> handleChange(e)} /> */}
      </div>}
      {resetloading ? <h1>Loading...</h1>:<h2>{resetmsg}</h2>}
        </div>
    );
}

export default Backup;
