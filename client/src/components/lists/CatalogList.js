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
  const [selectedSongId, setSelectedSongId] = useState(null);

  const sortedSongs = useMemo(() => {
      if (!songs || songs.length === 0) return [];

      const arr = [...songs];

      switch (sortBy){
          case "listener-hi":
              return arr.sort((a, b) => (a.listeners || 0) - (b.listeners || 0));
          case "listener-lo":
              return arr.sort((a, b) => (b.listeners || 0) - (a.listeners || 0));
          case "playlist-hi":
              return arr.sort((a, b) => (a.playlists || 0) - (b.playlists || 0));
          case "playlist-lo":
              return arr.sort((a, b) => (b.playlists || 0) - (a.playlists || 0));
          case "title-az":
              return arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
          case "title-za":
              return arr.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
          case "artist-az":
              return arr.sort((a, b) => (a.artist || "").localeCompare(b.artist || ""));
          case "artist-za":
              return arr.sort((a, b) => (b.artist || "").localeCompare(a.artist || ""));
          case "year-hi":
              return arr.sort((a, b) => (a.year || 0) - (b.year || 0));
          case "year-lo":
              return arr.sort((a, b) => (b.year || 0) - (a.year || 0));
          default:
              return arr;
      }
  }, [songs, sortBy]);

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
            <MenuItem value="playlist-hi">Number of Playlists (Hi-Lo)</MenuItem>
            <MenuItem value="playlist-lo">Number of Playlists (Lo-Hi)</MenuItem>
            <MenuItem value="title-az">Song Title (A-Z)</MenuItem>
            <MenuItem value="title-za">Song Title (Z-A)</MenuItem>
            <MenuItem value="artist-az">Song Artist (A-Z)</MenuItem>
            <MenuItem value="artist-za">Song Artist (Z-A)</MenuItem>
            <MenuItem value="year-hi">Song Year (Hi-Lo)</MenuItem>
            <MenuItem value="year-lo">Song Year (Lo-Hi)</MenuItem>
          </Select>
        </Box>
        <Typography variant="h6">{songs.length} Songs</Typography>
      </Box>
      <Grid container spacing={2} sx={{overflowY:'scroll', maxHeight: '600px'}}>
        {sortedSongs.map((song) => (
          <Grid item xs={12} key={song._id}>
            <CatalogCard
              song={song}
              selected={selectedSongId === song._id}
              onSelect={() => setSelectedSongId(song._id)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
