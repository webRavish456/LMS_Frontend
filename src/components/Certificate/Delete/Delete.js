"use client";
import { Dialog, DialogContent, Button } from "@mui/material";
import { toast } from "react-toastify";

export default function DeleteConfirm({ data, onClose, onSuccess }) {
  const BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const del = async () => {
    const token = localStorage.getItem("token");
    await fetch(`${BASE}/certificates/${data._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Deleted");
    onSuccess();
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogContent>
        <p>Delete certificate of <b>{data.name}</b>?</p>
        <Button color="error" onClick={del}>Delete</Button>
      </DialogContent>
    </Dialog>
  );
}
