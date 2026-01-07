"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  IconButton,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const CreateBranch = ({ onClose, onCreate }) => {
  // Backend compatible fields only
  const [form, setForm] = useState({
    branchName: "",
    branchLocation: "",  // Changed from 'location'
    Contact: "",         // Capital C - exactly as backend expects
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  const Base_url = process.env.NEXT_PUBLIC_BASE_URL;
  
  // Debug log
  console.log("Base URL:", Base_url);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  console.log("Test: Submit clicked");
  
  // Simple test payload
  const testPayload = {
    branchName: "Test Branch",
    branchLocation: "Test Location",
    Contact: "9876543210",
    status: "Active"
  };
  
  console.log("Test Payload:", testPayload);
  
  // Just show success
  toast.success("Test successful!");
  onCreate(true);
  onClose();


    // Contact validation (10 digits)
    if (!/^[0-9]{10}$/.test(form.Contact.trim())) {
      toast.error("Please enter a valid 10-digit contact number");
      return;
    }

    // Get token
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      return;
    }

    setLoading(true);

    try {
      // Prepare payload - EXACTLY as backend expects
      const payload = {
        branchName: form.branchName.trim(),
        branchLocation: form.branchLocation.trim(),
        Contact: form.Contact.trim(),  // Capital C
        status: form.status,
      };

      console.log("Sending to backend:", payload);
      console.log("API Endpoint:", `${Base_url}/branch`);

      // Make API request
      const res = await fetch(`${Base_url}/branch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response Status:", res.status);

      // Handle 401 Unauthorized
      if (res.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
        onClose();
        return;
      }

      // Parse response
      const data = await res.json();
      console.log("Backend Response:", data);

      if (!res.ok) {
        throw new Error(data.message || `Failed to create branch (${res.status})`);
      }

      // Success handling
      if (data.status === "success") {
        toast.success(data.message || "Branch created successfully!");
        
        // Pass success signal to parent
        onCreate(true);
        onClose();
      } else {
        toast.error(data.message || "Failed to create branch");
      }
    } catch (err) {
      console.error("Error creating branch:", err);
      
      // Show user-friendly error messages
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        toast.error("Your session has expired. Please login again.");
      } else if (err.message.includes("409") || err.message.includes("duplicate")) {
        toast.error("Branch Name already exists. Please use a different name.");
      } else if (err.message.includes("400")) {
        toast.error("Invalid data. Please check all fields.");
      } else if (err.message.includes("Failed to fetch")) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(err.message || "Failed to create branch. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>Add New Branch</Typography>
        <IconButton onClick={onClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* Branch Name - matches backend */}
          <TextField
            label="Branch Name *"
            name="branchName"
            value={form.branchName}
            onChange={handleChange}
            required
            fullWidth
            disabled={loading}
            placeholder="e.g., Main Branch"
          />

          {/* Branch Location - NOT 'location' */}
          <TextField
            label="Branch Location *"
            name="branchLocation"
            value={form.branchLocation}
            onChange={handleChange}
            required
            fullWidth
            disabled={loading}
            placeholder="e.g., City Center"
          />

          {/* Contact - Capital C */}
          <TextField
            label="Contact Info *"
            name="Contact"
            value={form.Contact}
            onChange={handleChange}
            required
            fullWidth
            disabled={loading}
            placeholder="10-digit number"
            inputProps={{ maxLength: 10 }}
          />

          {/* Status */}
          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Add Branch"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBranch;