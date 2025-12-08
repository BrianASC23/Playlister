import { useContext, useState } from "react";
import { GlobalStoreContext } from "../../store";
import AuthContext from "../../auth";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

  const [isExpanded, setIsExpanded] = useState(false);

  // Generate initials from playlist owner's name
  const getOwnerInitials = () => {
    if (playlist.ownerName) {
      const names = playlist.ownerName.split(" ");
      if (names.length >= 2) {
        return names[0].charAt(0) + names[names.length - 1].charAt(0);
      } else if (names.length === 1) {
        return names[0].charAt(0);
      }
    }
    return "?";
  };

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

  function expandMore() {
    setIsExpanded(!isExpanded);
  }

  async function handleToggleEdit(playlist_id, playlist) {
    // Open the Edit playlist Modal
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

  function handleCopy(id) {
    store.copyPlaylist(id);
  }

  function handlePlay(playlist) {
    store.showPlayPlaylistModal(playlist);
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
  // Guests will have isOwner = false since auth.user is null
  const isOwner = auth.user && auth.user.email === playlist.ownerEmail;

  let cardElement = (
    <Box
      id={playlist._id}
      sx={{
        mt: 2,
        borderRadius: "5px",
        border: "solid 1px #d7d3d5",
        bgcolor: "#fef7ff",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Main card content */}
      <Box
        sx={{
          px: 2.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* LEFT: avatar + title + username */}
        <Box>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}
          >
            {playlist.ownerAvatar ? (
              <Avatar
                src={playlist.ownerAvatar}
                sx={{ width: 40, height: 40 }}
              />
            ) : (
              <Avatar sx={{ width: 40, height: 40, bgcolor: "#white" }}>
                {getOwnerInitials()}
              </Avatar>
            )}

            <Box sx={{ marginY: 2 }}>
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
          <Typography>Listeners: {playlist.numListeners}</Typography>
        </Box>
        {/* RIGHT: buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 0.5,
            paddingTop: 1,
          }}
        >
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
            {/* Copy - Only show for logged in users, not guests */}
            {auth.loggedIn && (
              <Button
                variant="contained"
                size="small"
                sx={{
                  textTransform: "none",
                  bgcolor: "#2e7d32",
                  "&:hover": { bgcolor: "#1b5e20" },
                }}
                onClick={() => handleCopy(playlist._id)}
              >
                Copy
              </Button>
            )}

            {/* Play - Available for everyone including guests */}
            <Button
              variant="contained"
              size="small"
              sx={{
                textTransform: "none",
                bgcolor: "#ec407a",
                "&:hover": { bgcolor: "#d81b60" },
              }}
              onClick={() => handlePlay(playlist)}
            >
              Play
            </Button>
          </Box>
          <IconButton
            size="small"
            sx={{
              alignSelf: "right",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
            onClick={() => expandMore()}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          maxHeight: isExpanded ? "500px" : "0px",
          opacity: isExpanded ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
          borderTop: isExpanded ? "solid 1px gray" : "none",
        }}
      >
        <Box sx={{ px: 2.5, py: 2 }}>
          {playlist.songs && playlist.songs.length > 0 ? (
            playlist.songs.map((song, index) => (
              <Typography key={index} variant="body2" sx={{ py: 0.5 }}>
                {index + 1}. {song.title} {song.year}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              No songs in this playlist
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
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
