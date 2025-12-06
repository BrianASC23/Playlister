import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export default function SongSearchFilter({ filters, setFilters, onSearch }) {
  const updateField = (field) => (e) => {
    setFilters({
      ...filters,
      [field]: e.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(filters);
  };

  const onClear = () => {
    const empty = {
      title: "",
      artist: "",
      year: "",
    };

    setFilters(empty);
  };

  return (
    <Container component="section" maxWidth="sm">
      <CssBaseline />
      <Box elevation={3} sx={{ p: 1, mt: 4 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ mb: 2, color: "#c20cb9", fontWeight: "bold" }}
        >
          Songs Catalog
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="by Title"
                fullWidth
                sx={{ backgroundColor: "#e6e0e9" }}
                value={filters.title}
                onChange={updateField("title")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="by Artist"
                sx={{ backgroundColor: "#e6e0e9" }}
                fullWidth
                value={filters.artist}
                onChange={updateField("artist")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="by Year"
                sx={{ backgroundColor: "#e6e0e9" }}
                fullWidth
                value={filters.year}
                onChange={updateField("year")}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button type="submit" variant="contained">
              Search
            </Button>
            <Button variant="outlined" onClick={onClear}>
              Clear
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
