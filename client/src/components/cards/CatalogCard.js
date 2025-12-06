import { useContext, useState } from "react";
import { GlobalStoreContext } from "../../store";
import AuthContext from "../../auth";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

export default function CatalogCard({ song, selected, onSelect }) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);



  let isOwned = song.ownerEmail === auth.user.email;


  return (
    <ListItem
      id={song._id}
      sx={{
        mt: 2,
        px: 2.5,
        py: 1.5,
        borderRadius: "12px",
        border: isOwned ? "2px solid #ec5c57" : "2px solid black",
        bgcolor: selected ? "#ffd466" : "#fff7b2",
        width: "100%",
        display: "flex",
      }}
      onClick={onSelect}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {/* Top row: title + year + menu icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {song.title} ({song.year})
          </Typography>

          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Listens:{" "}
            {typeof song.numListeners === "number"
              ? song.numListeners.toLocaleString()
              : song.numListeners}
          </Typography>

          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Playlists: {song.inPlaylists}
          </Typography>
        </Box>
      </Box>
    </ListItem>
  );
}
