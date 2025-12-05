import { useContext, useState, useEffect, useRef } from "react";
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
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Typography, Grid } from "@mui/material";

export default function MUIPlayPlaylistModal() {
  const { store } = useContext(GlobalStoreContext);
  const [playlistName, setPlaylistName] = useState(
    store.currentList?.name || ""
  );

  const [player, setPlayer] = useState(null);
  const playerRef = useRef(null);

  // This code loads the IFrame Player API code asynchronously.
  useEffect(() => {
    if (!window.YT) {
      let tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      let firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Recreate player when playlist changes
  useEffect(() => {
    // Destroy old player first
    if (player) {
      player.destroy();
      setPlayer(null);
    }

    // Create new player if everything is ready
    if (store.currentList) {
      // set a timer to make sure the old player is destroyed + DOM is ready with its new div.
      setTimeout(() => {
        if (window.YT && window.YT.Player && playerRef.current) {
          createPlayer();
        } else {
          // Try again if not ready
          setTimeout(() => {
            if (window.YT && window.YT.Player) {
              createPlayer();
            }
          }, 500);
        }
      }, 100);
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [store.currentList?._id]);

  // Create the YouTube player
  function createPlayer() {
    if (
      playerRef.current &&
      store.currentList?.songs?.[store.currentSongIndex]?.youTubeId &&
      !player
    ) {
      let newPlayer = new window.YT.Player(playerRef.current, {
        height: "300",
        width: "100%",
        videoId: store.currentList.songs[store.currentSongIndex].youTubeId,
        playerVars: {
          playsinline: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
      setPlayer(newPlayer);
    } else {
      console.log("Skipping player creation");
    }
  }

  function changeSong() {
    console.log("changeSong()");
    if (
      player &&
      store.currentSongIndex >= 0 &&
      store.currentList?.songs?.[store.currentSongIndex]
    ) {
      player.loadVideoById(
        store.currentList.songs[store.currentSongIndex].youTubeId
      );
    }
  }

  // Update player when song changes
  useEffect(() => {
    changeSong();
  }, [store.currentSongIndex]);

  // Automatically plays video when the created player is ready
  function onPlayerReady(event) {
    console.log("onPlayerReady()");
    event.target.playVideo();
  }

  // When the video pauses, etc.
  function onPlayerStateChange(event) {
    console.log("onPlayerStateChange() event.data: " + event.data);
    let playerStatus = event.data;
    if (playerStatus == -1) {
      // VIDEO UNSTARTED
      console.log("Video unstarted");
    } else if (playerStatus == 0) {
      // THE VIDEO HAS COMPLETED PLAYING
      console.log("Video ended");
      handleNextSong();
      changeSong();
    } else if (playerStatus == 1) {
      // THE VIDEO IS PLAYING
      console.log("Video playing");
    } else if (playerStatus == 2) {
      // THE VIDEO IS PAUSED
      console.log("Video paused");
    } else if (playerStatus == 3) {
      // THE VIDEO IS BUFFERING
      console.log("Video buffering");
    } else if (playerStatus == 5) {
      // THE VIDEO HAS BEEN CUED
      console.log("Video cued");
    }
  }

  function handlePlayPause() {
    if (player) {
      const state = player.getPlayerState();
      if (state === 1) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  }

  function handlePreviousSong() {
    store.prevSong();
  }

  function handleNextSong() {
    store.nextSong();
  }

  function handleClose() {
    store.closeCurrentList();
  }

  function handleSwitchSongs(index){
    store.setCurrentSong(index);
  }

  console.log("MUIPLAY STORE CURRENT LIST:", store.currentList);

  return (
    <Modal open={store.isPlayPlaylistModalOpen()} onClose={handleClose}>
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
            Play Playlist
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
                }}
              >
                <Box
                  sx={{
                    bgcolor: "white",
                    flex: 1,
                    overflowY: "scroll",
                    maxHeight: "500px",
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                  }}
                >
                  <Typography color="black">{playlistName}</Typography>
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
                        color: "black",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        onClick={() => handleSwitchSongs(index)}
                      >
                        <Box component="span" sx={{ fontWeight: "bold" }}>
                          {index + 1}.
                        </Box>
                        <Box component="span" sx={{ fontWeight: "bold" }}>
                          {song.title} by {song.artist} ({song.year})
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* YOUTUBE PLAYER IS HERE */}

            <Grid item xs={3} md={3}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "black",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <div key={store.currentList?._id} ref={playerRef}></div>
                </Box>

                <Box sx={{ textAlign: "center", width: "100%" }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    Now Playing:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "black" }}>
                    {store.currentList?.songs?.[store.currentSongIndex]
                      ?.title || "No song selected"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "gray" }}>
                    Song {store.currentSongIndex + 1} of{" "}
                    {store.currentList?.songs?.length || 0}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                  <IconButton
                    onClick={handlePreviousSong}
                    disabled={store.currentSongIndex === 0}
                    sx={{
                      bgcolor: "#2196f3",
                      color: "white",
                      "&:hover": { bgcolor: "#1976d2" },
                      "&:disabled": { bgcolor: "#ccc" },
                    }}
                  >
                    <SkipPreviousIcon />
                  </IconButton>
                  <IconButton
                    onClick={handlePlayPause}
                    sx={{
                      bgcolor: "#4caf50",
                      color: "white",
                      "&:hover": { bgcolor: "#45a049" },
                    }}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleNextSong}
                    disabled={
                      store.currentSongIndex >=
                      (store.currentList?.songs?.length || 0) - 1
                    }
                    sx={{
                      bgcolor: "#2196f3",
                      color: "white",
                      "&:hover": { bgcolor: "#1976d2" },
                      "&:disabled": { bgcolor: "#ccc" },
                    }}
                  >
                    <SkipNextIcon />
                  </IconButton>
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
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}
