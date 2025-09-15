"use client";

import React, { useState } from "react";

const Create = ({ onCreate, onClose }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) {
      alert("Please fill all fields");
      return;
    }
    onCreate({ name, amount: parseFloat(amount) });
  };

  return (
    <div style={{ padding: 20, background: "white", borderRadius: 8, maxWidth: 400 }}>
      <h2>Create Bill</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Bill Name:</label>
          <br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Amount:</label>
          <br />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ marginRight: 10 }}>
          Create
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default Create;
