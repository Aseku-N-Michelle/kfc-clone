import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import "../pages/Cart.css"

// Exchange rate: 1 USD = about 3,700 UGX. Keep it the same as in Cartproduct.jsx.
// Set it to 1 if your database prices are already in shillings.
const RATE = 3700;
const DONATION = 5000;

const RightSide = () => {
  const [input, setInput] = useState(false);
  const [stotal, setstotal] = useState(0);
  const cart = useSelector((state) => state.cart)
  const navigate = useNavigate();
  const location = useLocation();
  let path = location.pathname;

  // Works with prices like "8.99" and "UGX 299"
  useEffect(() => {
    let total = cart.reduce((acc, el) => {
      let price = Number(String(el.price).replace(/[^0-9.]/g, ""));
      return acc + price * el.qty * RATE;
    }, 0)
    setstotal(Math.round(total))
  }, [cart])

  const handleInput = () => {
    setInput(!input);
  };

  const initPayment = (data) => {
    const options = {
      key: "",
      amount: data.amount,
      currency: data.currency,
      name: "Kentucky Fried Chicken",
      description: "You Total Amount",
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyURL = "https://kfc-clone-ulag.onrender.com/api/payment/verify";
          const { data } = await axios.post(verifyURL, response);
          console.log("data:", data);
        } catch (err) {
          console.log("err:", err);
        }
      },
      theme: {
        color: "#a50000",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePayment = async () => {
    try {
      const orderURL = "https://kfc-clone-ulag.onrender.com/api/payment/orders";
      const { data } = await axios.post(orderURL, { amount: stotal });
      console.log("data:", data);
      initPayment(data.data);
    } catch (err) {
      console.log("err:", err);
    }
  };

  const row = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  };

  const grandTotal = !input ? stotal : stotal + DONATION;

  return (
    <>
      <h2 className="reciept_heading">{cart.length} ITEMS</h2>
      <div className="offers_deals_container">
        <img
          src="https://online.kfc.co.in/static/media/Offers_Coupon_Icon.72b94c41.svg"
          alt=""
        />
        <span className="cart_offers_text">Apply Offers & Deals</span>
        <button className="viewAll_button">View All</button>
      </div>

      <div style={row}>
        <div>SubTotal</div>
        <div>UGX {stotal.toLocaleString()}</div>
      </div>
      <div style={row}>
        <div>GST</div>
        <div>UGX {stotal.toLocaleString()}</div>
      </div>
      <div style={row}>
        <div style={{ marginRight: "20px" }}>
          Restaurant Handling (Incl. Taxes)
        </div>
        <div>UGX {stotal.toLocaleString()}</div>
      </div>

      {input ? (
        <div style={row}>
          <div style={{ marginRight: "20px" }}>Add Hope</div>
          <div>UGX {DONATION.toLocaleString()}</div>
        </div>
      ) : (
        ""
      )}

      <hr style={{ color: "grey", marginTop: "20px", marginBottom: "20px" }} />

      <div className="donation_box">
        <div>
          <input onInput={handleInput} type="checkbox" />
        </div>
        <div style={{ marginTop: "-17px" }}>
          <p>Donate UGX {DONATION.toLocaleString()} Tick to Add Hope.</p>
          <p>Our goal is to feed 20 million people by 2022.</p>
        </div>
      </div>

      {path === "/cart" ? (
        <button onClick={() => navigate("/checkout")} className="redButton">
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <p>Checkout</p>
            <p>UGX {grandTotal.toLocaleString()}</p>
          </div>
        </button>
      ) : (
        <button onClick={handlePayment} className="redButton">
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <p>Payment</p>
            <p>UGX {grandTotal.toLocaleString()}</p>
          </div>
        </button>
      )}
    </>
  )
}

export default RightSide