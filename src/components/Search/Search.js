"use client"

import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const Search = ({ buttonText, onSearch, onAddClick }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <Box
      style={{ 
        display: "flex", 
        justifyContent: "flex-end", 
        width: "100%",
        alignItems: "center", 
        gridColumnGap: "20px", 
        marginBottom: "10px",
        marginRight: "0px"
      }}
    >
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          endAdornment: <SearchIcon style={{ marginRight: 0 }} />,
        }}
        className="search"
      />
      <Box className="buttonContainer">
        <Button 
          variant="contained" 
          color="primary" 
          className="primary_button"   
          sx={{ marginLeft: "0px" }}
          startIcon={<AddIcon />} 
          onClick={onAddClick}
        >
          {buttonText}
        </Button>
      </Box>
    </Box>
  );    
};

export default Search;