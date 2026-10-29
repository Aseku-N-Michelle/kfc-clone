import React from 'react'
import { useState } from 'react'
import styles from "./cart.module.css"
import axios from "axios"
import { useDispatch } from 'react-redux'
import { addcartcount } from '../redux/action'

// Exchange rate: 1 USD = about 3,700 UGX. Check the current rate and change it here.
// Set it to 1 if your database prices are already in shillings.
const RATE = 3700;

const Cartproduct = ({ desc, id, image, price, qty, title, _id, fetchData }) => {
  const dispatch = useDispatch();
  const [count, setCount] = useState(qty);

  // Works with "8.99" and "₹299": removes everything except digits and the dot
  const acprice = Number(String(price ?? "").replace(/[^0-9.]/g, "")) || 0;

  const handleRemove = () => {
    axios
      .delete(`https://kfc-clone-ulag.onrender.com/api/productcart/cart/${id}`)
      .then(() => {
        fetchData();
        console.log("Deleted");
      });
  };

  const handleMinus = () => {
    const el = { id: id, image, price, title, desc, qty: count - 1 };
    axios
      .put(`https://kfc-clone-ulag.onrender.com/api/productcart/cart/${id}`, el)
      .then(() => {
        dispatch(addcartcount(el));
        setCount(count - 1);
      });
  };

  const handlePlus = () => {
    const el = { id: id, image, price, title, desc, qty: count + 1 };
    axios
      .put(`https://kfc-clone-ulag.onrender.com/api/productcart/cart/${id}`, el)
      .then(() => {
        setCount(count + 1);
        dispatch(addcartcount(el));
      });
  };

  return (
    <div className={styles.cartproductmain}>
      <div className={styles.cartproductleft}>
        <img src={image} alt="food" />
        <div>
          <h3>{title}</h3>
          <ul>
            <li>{desc}</li>
          </ul>
          <h3 style={{ cursor: 'pointer' }} onClick={handleRemove}>
            Remove
          </h3>
        </div>
      </div>
      <div className={styles.cartproductright}>
        <button disabled={qty == 1 || count == 1} onClick={handleMinus}>
          &#8211;
        </button>
        <h4>{count}</h4>
        <button onClick={handlePlus}>&#43;</button>
        <h3>UGX {Math.round(acprice * count * RATE).toLocaleString()}</h3>
      </div>
    </div>
  );
};

export default Cartproduct;