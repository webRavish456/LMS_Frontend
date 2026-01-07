"use client";

import React, { useState, useEffect } from "react";

const Edit = ({ bill, onClose, onUpdate }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (bill) {
      setName(bill.name);
      setAmount(bill.amount);
    }
  }, [bill]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name || !amount) return alert("Please fill all fields");
    onUpdate({ ...bill, name, amount: parseFloat(amount) });
  };

  return (
    <div style={{ padding: 20, background: "white", borderRadius: 8, maxWidth: 400 }}>
      <h2>Edit Bill</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Bill Name:</label><br />
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Amount:</label><br />
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <button type="submit">Update</button>
        <button type="button" onClick={onClose} style={{ marginLeft: 10 }}>Cancel</button>
      </form>
    </div>
  );
};

export default Edit;
