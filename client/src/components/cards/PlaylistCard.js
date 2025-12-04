import { useContext, useState } from "react";
import { GlobalStoreContext } from "../../store";
import AuthContext from "../../auth";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its
    name or deleting it.

    @author McKilla Gorilla
*/

// THERE SHOULD BE DELETE, EDIT, COPY & PLAY
// DELETE AND EDIT SHOULD BE ONLY IF THE PLAYLIST BELONGS TO USER

function PlaylistCard({ playlist }) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [editActive, setEditActive] = useState(false);
  const [text, setText] = useState("");

  const avatar = auth.getUserAvatar();

  function handleLoadList(event, id) {
    console.log("handleLoadList for " + id);
    if (!event.target.disabled) {
      let _id = event.target.id;
      if (_id.indexOf("list-card-text-") >= 0)
        _id = ("" + _id).substring("list-card-text-".length);

      console.log("load " + event.target.id);

      // CHANGE THE CURRENT LIST
      store.setCurrentList(id);
    }
  }

  async function handleToggleEdit(playlist_id, playlist) {
    store.showEditPlaylistModal(playlist);
  }

  function toggleEdit() {
    let newActive = !editActive;
    if (newActive) {
      store.setIsListNameEditActive();
    }
    setEditActive(newActive);
  }

  // For OnDelete
  async function handleDeleteList(event, id) {
    event.stopPropagation();
    //let _id = event.target.id;
    //_id = ("" + _id).substring("delete-list-".length);
    store.markListForDeletion(id);
  }

  function handleKeyPress(event) {
    if (event.code === "Enter") {
      let id = event.target.id.substring("list-".length);
      store.changeListName(id, text);
      toggleEdit();
    }
  }

  function handleUpdateText(event) {
    setText(event.target.value);
  }

  // Check if the playlist's owner email is the same as our current user.
  // Depending on this boolean, we render the option to edit & delete
  const isOwner = auth.user.email === playlist.ownerEmail;

  let cardElement = (
    <ListItem
      id={playlist._id}
      sx={{
        mt: 2,
        px: 2.5,
        py: 1,
        borderRadius: "5px",
        border: "solid 1px #d7d3d5",
        bgcolor: "#fef7ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {/* LEFT: avatar + title + username */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
        <Avatar src={avatar} sx={{ width: 40, height: 40 }} />

        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, lineHeight: 1.2 }}
          >
            {playlist.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.2 }}
          >
            {playlist.ownerName}
          </Typography>
        </Box>
      </Box>

      {/* RIGHT: buttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Delete */}

        {isOwner && (
          <>
            <Button
              variant="contained"
              size="small"
              sx={{
                textTransform: "none",
                bgcolor: "#e53935",
                "&:hover": { bgcolor: "#c62828" },
              }}
              onClick={(event) => handleDeleteList(event, playlist._id)}
            >
              Delete
            </Button>
            {/* Edit */}
            <Button
              variant="contained"
              size="small"
              sx={{
                textTransform: "none",
                bgcolor: "#3949ab",
                "&:hover": { bgcolor: "#283593" },
              }}
              onClick={() => handleToggleEdit(playlist._id, playlist)}
            >
              Edit
            </Button>
          </>
        )}
        {/* Copy */}
        <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: "none",
            bgcolor: "#2e7d32",
            "&:hover": { bgcolor: "#1b5e20" },
          }}
          // Gotta implement Copy Logic
        >
          Copy
        </Button>

        {/* Play */}
        <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: "none",
            bgcolor: "#ec407a",
            "&:hover": { bgcolor: "#d81b60" },
          }}
          // Open Play Playlist Modal
        >
          Play
        </Button>
      </Box>
    </ListItem>
  );

  if (editActive) {
    cardElement = (
      <TextField
        margin="normal"
        required
        fullWidth
        id={"list-" + playlist._id}
        label="Playlist Name"
        name="name"
        autoComplete="Playlist Name"
        className="list-card"
        defaultValue={playlist.name}
        inputProps={{ style: { fontSize: 48 } }}
        InputLabelProps={{ style: { fontSize: 24 } }}
        autoFocus
      />
    );
  }
  return cardElement;
}

export default PlaylistCard;
