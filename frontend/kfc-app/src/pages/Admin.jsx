import React, { useEffect, useState } from "react";

const API = "https://kfc-clone-ulag.onrender.com/api/product/menu";
const empty = { image: "", title: "", desc: "", price: "", type: "snacks" };

const Admin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      const res = await fetch(API);
      setItems(await res.json());
    } catch (err) {
      setMsg("Could not reach the backend. Is it running on port 8080?");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE or UPDATE
  const handleSave = async () => {
    if (!form.title || !form.price || !form.type) {
      setMsg("Title, price and type are required.");
      return;
    }
    const url = editId ? `${API}/${editId}` : API;
    const method = editId ? "PUT" : "POST";
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setMsg(editId ? "Product updated." : "Product added.");
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      setMsg("Save failed.");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      image: item.image || "",
      title: item.title || "",
      desc: item.desc || "",
      price: item.price || "",
      type: item.type || "",
    });
    window.scrollTo(0, 0);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      setMsg("Product deleted.");
      load();
    } catch (err) {
      setMsg("Delete failed.");
    }
  };

  const box = { display: "block", width: "100%", padding: "8px", margin: "6px 0" };

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto", padding: "0 16px" }}>
      <h1>ADMIN: MANAGE MENU</h1>
      {msg && <p style={{ color: "#e4002b", fontWeight: "bold" }}>{msg}</p>}

      <h2>{editId ? "Edit product" : "Add product"}</h2>
      <input style={box} name="image" placeholder="Image link" value={form.image} onChange={handleChange} />
      <input style={box} name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <input style={box} name="desc" placeholder="Description" value={form.desc} onChange={handleChange} />
      <input style={box} name="price" placeholder="Price" value={form.price} onChange={handleChange} />
      <input style={box} name="type" placeholder="Type (e.g. snacks)" value={form.type} onChange={handleChange} />
      <button onClick={handleSave} style={{ padding: "10px 20px", background: "#e4002b", color: "white", border: "none", borderRadius: "20px", cursor: "pointer" }}>
        {editId ? "Save changes" : "Add product"}
      </button>
      {editId && (
        <button onClick={() => { setEditId(null); setForm(empty); }} style={{ padding: "10px 20px", marginLeft: "10px", cursor: "pointer" }}>
          Cancel
        </button>
      )}

      <h2 style={{ marginTop: "40px" }}>All products ({items.length})</h2>
      {items.map((el) => (
        <div key={el._id} style={{ display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid #ddd", padding: "10px 0" }}>
          <img src={el.image} alt={el.title} width="70" height="70" style={{ objectFit: "cover" }} />
          <div style={{ flex: 1 }}>
            <b>{el.title}</b> - {el.price}
            <div style={{ fontSize: "14px", color: "#666" }}>type: {el.type}</div>
          </div>
          <button onClick={() => handleEdit(el)} style={{ cursor: "pointer", padding: "6px 12px" }}>Edit</button>
          <button onClick={() => handleDelete(el._id)} style={{ cursor: "pointer", padding: "6px 12px" }}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Admin;