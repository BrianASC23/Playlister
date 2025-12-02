import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState, useMemo } from "react";
import CatalogCard from "../cards/CatalogCard";

// Should take the songs array from the parent CatalogScreen and render it

export default function CatalogList({ songs }) {
  const [sortBy, setSortBy] = useState(null);

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6">Sort By</Typography>
          <Select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
            }}
            variant="standard"
          >
            <MenuItem value="listener-hi">Listener (Hi-Lo)</MenuItem>
            <MenuItem value="listener-lo">Listener (Lo-Hi)</MenuItem>
            <MenuItem value="playlist-az">Playlist Name (A-Z)</MenuItem>
            <MenuItem value="playlist-za">Playlist Name (Z-A)</MenuItem>
            <MenuItem value="username-az">Username (A-Z)</MenuItem>
            <MenuItem value="username-za">Username (Z-A)</MenuItem>
          </Select>
        </Box>
        <Typography variant="h6">{songs.length} Songs</Typography>
      </Box>
      <Grid container spacing={2} sx={{overflowY:'scroll', maxHeight: '600px'}}>
        {songs.map((song) => (
          <Grid item xs={12} key={song._id}>
            <CatalogCard song={song} selected={false} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
