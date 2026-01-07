"use client";

import React from "react";

const View = ({ bill, onClose }) => {
  if (!bill) return null;

  return (
    <div style={{ padding: 20, background: "white", borderRadius: 8, maxWidth: 400 }}>
      <h2>Bill Details</h2>
      <p><strong>Name:</strong> {bill.name}</p>
      <p><strong>Amount:</strong> ₹{bill.amount}</p>

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default View;
