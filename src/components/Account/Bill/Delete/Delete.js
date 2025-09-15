"use client";

import React from "react";

const Delete = ({ bill, onClose, onConfirm }) => {
  if (!bill) return null;

  return (
    <div style={{ padding: 20, background: "white", borderRadius: 8, maxWidth: 400 }}>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete "{bill.name}"?</p>
      <button onClick={onConfirm} style={{ backgroundColor: "red", color: "white" }}>
        Delete
      </button>
      <button onClick={onClose} style={{ marginLeft: 10 }}>
        Cancel
      </button>
    </div>
  );
};

export default Delete;
