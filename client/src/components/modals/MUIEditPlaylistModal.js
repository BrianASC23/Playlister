import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { GlobalStoreContext } from "../../store";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { Typography, Grid } from "@mui/material";

export default function MUIEditPlaylistModal() {
  const { store } = useContext(GlobalStoreContext);
  const history = useHistory();
  const [playlistName, setPlaylistName] = useState(
    store.currentList?.name || ""
  );

  function handleClose() {
    store.closeCurrentList();
  }

  function handleClear() {}

  function handleUpdatePlaylistName(event) {
    setPlaylistName(event.target.value);
  }

  // For changing the list name
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      store.changeListName(store.currentList._id, playlistName);
    }
  }

  function handleAddSong() {
    store.closeCurrentList();
    history.push('/catalog');
  }

  function handleCopySong() {}

  function handleUndo() {
    store.undo();
  }

  function handleRedo() {
    store.redo();
  }

  function handleRemoveSong(index) {
    store.markSongForDeletion(index);
  }

  console.log("MUIEDIT STORE CURRENT LIST:", store.currentList);

  return (
    <Modal open={store.isEditPlaylistModalOpen()} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          height: "80%",
          bgcolor: "#b0ffb5",
          border: "2px solid #000",
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Navbar */}
        <Box
          sx={{
            bgcolor: "#0e8503",
            color: "white",
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Edit Playlist
          </Typography>
        </Box>

        <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header with playlist name and close button */}
          <Grid container spacing={2}>
            <Grid item xs={9} md={9}>
              <Box
                sx={{
                  color: "white",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                  backgroundColor: "#e6e0e9",
                }}
              >
                <TextField
                  value={playlistName}
                  onChange={handleUpdatePlaylistName}
                  onKeyPress={handleKeyPress}
                  variant="standard"
                  size="small"
                  sx={{
                    bgcolor: "#e6e0e9",
                    borderRadius: 1,
                    p: 1,
                    flex: 1,
                    mr: 2,
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:before": {
                      borderBottom: "none",
                    },
                  }}
                />
                <IconButton
                  onClick={handleClear}
                  sx={{ color: "white", backgroundColor: "#e6e0e9" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={3} md={3}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddSong}
                  sx={{
                    bgcolor: "#7c4dff",
                    borderRadius: "20px",
                    "&:hover": {
                      bgcolor: "#651fff",
                    },
                  }}
                >
                  + ♪
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              bgcolor: "#e8e8ff",
              flex: 1,
              overflowY: "scroll",
              maxHeight: "500px",
              p: 2,
              mb: 2,
              borderRadius: 1,
            }}
          >
            {store.currentList?.songs?.map((song, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: "#ffffaa",
                  p: 1.5,
                  mb: 1.5,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    {index + 1}.
                  </Box>
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    {song.title} by {song.artist} ({song.year})
                  </Box>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleCopySong(index)}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveSong(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<UndoIcon />}
                onClick={handleUndo}
                disabled={!store.canUndo()}
                sx={{
                  bgcolor: "#7c4dff",
                  borderRadius: "20px",
                  "&:hover": {
                    bgcolor: "#651fff",
                  },
                }}
              >
                Undo
              </Button>
              <Button
                variant="contained"
                startIcon={<RedoIcon />}
                onClick={handleRedo}
                disabled={!store.canRedo()}
                sx={{
                  bgcolor: "#7c4dff",
                  borderRadius: "20px",
                  "&:hover": {
                    bgcolor: "#651fff",
                  },
                }}
              >
                Redo
              </Button>
            </Box>
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                bgcolor: "#4caf50",
                borderRadius: "20px",
                px: 4,
                "&:hover": {
                  bgcolor: "#45a049",
                },
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
