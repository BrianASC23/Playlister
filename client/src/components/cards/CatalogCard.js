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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function CatalogCard({ song, selected, onSelect }) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [playlistAnchorEl, setPlaylistAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const playlistMenuOpen = Boolean(playlistAnchorEl);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setPlaylistAnchorEl(null);
  };

  const handlePlaylistMenuOpen = (event) => {
    setPlaylistAnchorEl(event.currentTarget);
  };

  const handlePlaylistMenuClose = (event) => {
    setPlaylistAnchorEl(null);
  };

  const handleAddToSpecificPlaylist = (playlistId) => {
    console.log(`Adding song: ${song.name} to playlist: ${playlistId}`);
    handleMenuClose();
  };

  const handleAddToPlaylist = () => {};

  const handleEditSong = () => {};

  const handleRemoveFromCatalog = () => {};

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

          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onMouseEnter={handlePlaylistMenuOpen}>
              Add to Playlist
            </MenuItem>
            <MenuItem onClick={handleEditSong}>Edit Song</MenuItem>
            <MenuItem onClick={handleRemoveFromCatalog}>
              Remove from Catalog
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={playlistAnchorEl}
            open={playlistMenuOpen}
            onClose={handlePlaylistMenuClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            sx={{ ml: 1 }}
          >
            {store.userPlaylists && store.userPlaylists.length > 0 ? (
              store.userPlaylists.map((playlist) => (
                <MenuItem
                  key={playlist._id}
                  onClick={() => handleAddToSpecificPlaylist(playlist._id)}
                >
                  {playlist.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No playlists available</MenuItem>
            )}
          </Menu>
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
