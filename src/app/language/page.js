'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Paper, Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination,
  Box, Chip, Button, Stack, Typography
} from "@mui/material";

// Import your Layout component
import Layout from "@/components/Layout";

// ---------------- Inline Search Component ----------------
const Search = ({ onSearch, buttonText = "Search" }) => {
  const [term, setTerm] = useState("");
  const handleClick = () => onSearch(term);

  return (
    <Stack direction="row" spacing={1}>
      <input
        type="text"
        placeholder="Search..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        style={{
          flex: 1,
          padding: "6px 8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      {buttonText !== "" && (
        <Button variant="contained" onClick={handleClick} size="small">{buttonText}</Button>
      )}
    </Stack>
  );
};

// ---------------- Localization Page ----------------
const LocalizationPage = () => {
  const [features, setFeatures] = useState([
    { feature: 'Support for multiple languages' },
    { feature: 'Customized branding and UI localization' },
    { feature: 'Timezone and regional date/time format support' },
  ]);
  const [filteredFeatures, setFilteredFeatures] = useState(features);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimerRef = useRef(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => setFilteredFeatures(features), [features]);

  useEffect(() => {
    const filtered = features.filter(f =>
      f.feature.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFeatures(filtered);
    setPage(0);
  }, [searchTerm, features]);

  const handleSearchDebounced = useMemo(() => {
    return (term) => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => setSearchTerm(term || ""), 300);
    };
  }, []);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    <Layout>
      <Box p={2} sx={{ backgroundColor: "#e0f7fa", minHeight: "100vh" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Multi-language & Localization</Typography>
            <Typography variant="body2" color="text.secondary">
              Total features: <strong>{features.length}</strong>
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
            <Box sx={{ minWidth: 240, width: { xs: "100%", sm: 300 } }}>
              <Search onSearch={handleSearchDebounced} buttonText="" />
            </Box>
            <Chip label={`${filteredFeatures.length} results`} color="primary" />
          </Stack>
        </Stack>

        <Paper sx={{ mt: 1, p: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SI.No</TableCell>
                <TableCell>Feature</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFeatures.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((f, idx) => (
                <TableRow key={idx}>
                  <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>{f.feature}</TableCell>
                </TableRow>
              ))}

              {filteredFeatures.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center">No Features Found</TableCell>
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5,10,25]}
                  count={filteredFeatures.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Rows per page:"
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      </Box>
    </Layout>
  );
};

export default LocalizationPage;
