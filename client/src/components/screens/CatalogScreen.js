import { useContext, useState, useEffect, useRef } from "react";
import { GlobalStoreContext } from "../../store";
import SongSearchFilter from "../lists/SongSearchFilter";
import CatalogList from "../lists/CatalogList";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MUIEditSongModal from "../modals/MUIEditSongModal";
import MUIDeleteSongModal from "../modals/MUIDeleteSongModal";

export default function CatalogScreen() {
  const { store } = useContext(GlobalStoreContext);

  const [filters, setFilters] = useState({});
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const playerRef = useRef(null);
  const [hasListenCount, setHasListenCount] = useState(false);

  // This code loads the IFrame Player API code asynchronously.
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Create YouTube player when song is selected
  useEffect(() => {
    if (!selectedSong || !selectedSong.youTubeId) {
      if (playerRef.current) {
        playerRef.current.innerHTML = "";
      }
      return;
    }

    // Reset listen counter when song changes
    setHasListenCount(false);

    console.log(`Creating player for song: ${selectedSong.title}. YouTube ID: ${selectedSong.youTubeId}`);

    function createPlayer() {
      if (window.YT && window.YT.Player) {
        console.log("Creating player");
        if (playerRef.current) {
          playerRef.current.innerHTML = "";
          const playerDiv = document.createElement("div");
          playerDiv.id = "youtube-player-" + Date.now();
          playerRef.current.appendChild(playerDiv);

          new window.YT.Player(playerDiv, {
            // I don't know what the smallest size is LOL
            height: "300",
            width: "100%",
            videoId: selectedSong.youTubeId,
            playerVars: {
              playsinline: 1,
            },
            events: {
              onStateChange: (event) => {
                // When video starts playing (state = 1), increment listener count
                if (event.data === 1 && !hasListenCount) {
                  if (selectedSong?._id) {
                    store.updateSongListeners(selectedSong._id);
                    setHasListenCount(true);
                  }
                }
              }
            }
          });
        }
      } else {
        setTimeout(createPlayer, 100);
      }
    };

    setTimeout(createPlayer, 100);
  }, [selectedSong]);

  // load the lists to the store
  // get the lists from the store and setPlaylist to it
  useEffect(() => {
    // Should use user's email to find it > req.user_id > email
    // Should load into a Global variable that stores the songs owned by User
    store.getSongByUser();
  }, []);

  // Update local songs in Catalog when there are song changes
  useEffect(() => {
    setSongs(store.songlist);
  }, [store.songlist]);

  // Handle searching for songs by filter
  const handleSearch = async () => {
    console.log("filters:", filters);
    const songs = await store.findSongsByFilter(filters);
    console.log("Songs from search:", songs);
    setSongs(songs); // Don't know if I need this if I have a global songlist
  };

  const handleAddNewSong = async () => {
    //Should open the Add/Edit Song Modal
    // Once I fill out everything and hit complete
    // It should fill out and create a new song

    store.showEditSongModal(-1, null);
  };

  // if I click on edit/add a new song, store should update and show the edit song modal
  let modalJSX = "";
  if (store.isEditSongModalOpen()) {
    modalJSX = <MUIEditSongModal />;
  }
  if (store.isDeleteSongModalOpen()) {
    modalJSX = <MUIDeleteSongModal />;
  }

  return (
    <Box id="playlist-screen">
      <Grid container>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <SongSearchFilter
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />

          {selectedSong && (
            <Box
              ref={playerRef}
              sx={{
                mt: 2,
                width: "450px",
                height: "300px",
                bgcolor: "#000",
              }}
            />
          )}
        </Grid>
        <Grid item xs={6}>
          <CatalogList
            songs={songs}
            selectedSong={selectedSong}
            onSelectSong={setSelectedSong}
          />
          <Button onClick={handleAddNewSong}>+ New Songs</Button>
        </Grid>
      </Grid>
      {modalJSX}
    </Box>
  );
}
