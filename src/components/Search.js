'use client';

import React from "react";
import { Box, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";


const Search = ({
  onSearch,
  onAddClick,
  buttonText = "Add",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        mb: 2,
        width: "100%",
      }}
    >
      <TextField
        size="small"
        placeholder="Search..."
        onChange={(e) => onSearch?.(e.target.value)}
        InputProps={{
          endAdornment: <SearchIcon />,
        }}
      />

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddClick}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

export default Search;
