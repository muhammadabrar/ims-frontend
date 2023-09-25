import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
let datatile = [];
const States = () => {
  const [date, setdate] = useState(new Date().toISOString().slice(0, 7));

  const customers = useSelector((state) => state.customers.value);

  const invetories = useSelector((state) => state.inventory.value);

  const [data, setdata] = useState([]);
  const [loading, setloading] = useState(true);
  const [total, settotal] = useState(0);
  const [stock, setstock] = useState(0);
  const [balance, setbalance] = useState(0);
  const [received, setreceived] = useState(0);
  const [totalsale, settotalsale] = useState(0);
  const [availableStock, setavailableStock] = useState(0);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/orders/stats/${date}`)
      .then((res) => {
        console.log(res.data);
        setdata(res.data);
        datatile = res.data;
        let t = 0;
        let s = 0;

        res.data.forEach((element) => {
          t = element.total;
          s = element.stock;
        });
        settotal(t);
        setstock(s);
        setloading(false);
      })
      .catch((error) => {
        console.log(error);
      });
    let received = 0;
    let balance = 0;
    let totalsalec = 0;
    customers.forEach((e) => {
      received = received + e.received;
      totalsalec = totalsalec + e.Total;
      balance = balance + (e.Total - e.received);
    });
    setreceived(received);
    settotalsale(totalsalec);
    setbalance(balance);
    let as = 0;
    invetories.forEach((e) => {
      as = as + (e.qty - e.sold) * e.price;
    });
    setavailableStock(as);
  }, [date, invetories, customers]);
  return (
    <div className="states shadow-sm">
      <div className="Top-states row border-bottom">
        {loading ? (
          <h1 className="text-muted p-4 m-4">Loading...</h1>
        ) : (
          <div className="revenue col-md-9">
            <div className="d-flex justify-content-between align-items-center ">
              <h3>Revenue</h3>
              <input
                type={"month"}
                className="date-input"
                value={date}
                onChange={(e) => setdate(e.target.value)}
              />
            </div>
            <h1 className="text-primary">Rs. {total}</h1>
            {data.length < 1 ? (
              <h1 className="text-center py-4 text-muted">No date to show</h1>
            ) : (
              <ResponsiveContainer width="100%" height={120}>
                <BarChart
                  width={500}
                  height={300}
                  data={data.reverse()}
                  // margin={{
                  //   top: 5,
                  //   right: 30,
                  //   left: 20,
                  //   bottom: 5,
                  // }}
                >
                  <Tooltip content={<CustomTooltip date={date} />} />
                  <Bar dataKey="total" fill="#007BFF" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
        <div className="other-state col-md-3 ">
          <div className="states-item border-bottom ">
            <h3>profite</h3>
            <h1 className="text-primary pt-2 ">Rs. {total - stock}</h1>
            <p className="text-muted">The profit geneterated from orders</p>
          </div>
          <div className="states-item mt-2">
            <h3>Stock</h3>
            <h1 className="text-primary pt-2">Rs. {stock}</h1>
            <p className="text-muted">The stock geneterated from orders</p>
          </div>
        </div>
      </div>
      <div className="sec-states d-flex justify-content-between">
        <div className="states-item ">
          <h3>Total Sale Amount</h3>
          <h1 className="text-primary pt-2">Rs. {totalsale}</h1>
        </div>
        <div className="states-item ">
          <h3>Received Payments</h3>
          <h1 className="text-primary pt-2">Rs. {received}</h1>
        </div>
        <div className="states-item ">
          <h3>Balance</h3>
          <h1 className="text-primary pt-2">Rs. {balance}</h1>
        </div>
        <div className="states-item">
          <h3>Available Stock</h3>
          <h1 className="text-primary pt-2">Rs. {availableStock}</h1>
        </div>
      </div>
    </div>
  );
};

export default States;

const CustomTooltip = ({ active, payload, label, date }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${datatile[label]._id.date} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};
