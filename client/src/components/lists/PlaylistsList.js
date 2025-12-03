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
import PlaylistCard from "../cards/PlaylistCard";
import { useState, useMemo } from "react";

export default function PlaylistsList({ playlists }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  // Did not fully implement yet, need to add properties like listeners to playlist
  // const sortedPlaylists = useMemo(() => {

  //     const arr = [...playlists];

  //     switch (sortBy){
  //         case "listener-hi":
  //             return arr.sort((a, b) => a.listeners - b.listeners);
  //         case "listener-lo":
  //             return arr.sort((a, b) => b.listeners - a.listeners);
  //         case "playlist-az":
  //             return arr.sort((a, b) => a.title.localeCompare(b.title));
  //         case "playlist-za":
  //             return arr.sort((a, b) => b.title.localeCompare(a.title));
  //         case "username-az":
  //             return arr.sort((a, b) => a.ownerEmail.localeCompare(b.ownerEmail));
  //         case "username-za":
  //             return arr.sort((a,vb) => b.ownerEmail.localeCompare(a.ownerEmail));
  //         default:
  //             return arr;
  //     }
  // }, [playlists, sortBy]);

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
        <Typography variant="h6">{playlists.length} Playlists</Typography>
      </Box>
      <Grid container spacing={2} sx={{overflowY: 'scroll', maxHeight: '600px' }}>
        {playlists.map((playlist) => (
          <Grid item xs={12} key={playlist._id}>
            <PlaylistCard playlist={playlist} selected={false} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
