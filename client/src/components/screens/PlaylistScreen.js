import { useContext, useState, useEffect } from "react";
import { GlobalStoreContext } from "../../store";
import AuthContext from "../../auth";
import PlaylistSearchFilters from "../lists/PlaylistSearchFilters";
import PlaylistsList from "../lists/PlaylistsList";
import MUIEditPlaylistModal from "../modals/MUIEditPlaylistModal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MUIDeleteModal from "../modals/MUIDeleteModal";
import MUIPlayPlaylistModal from "../modals/MUIPlayPlaylistModal";

export default function PlaylistScreen() {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  const [filters, setFilters] = useState({});
  const [playlists, setPlaylists] = useState([]);

  // load the lists to the store
  // get the lists from the store and setPlaylist to it
  useEffect(() => {
    // Guests should see all playlists, logged in users see their own
    if (auth.guest) {
      // For guests, do initial search with empty filters to get all playlists
      // Do nothing
    } else {
      store.loadUserPlaylists();
    }
  }, []);


  useEffect(() => {
    setPlaylists(store.userPlaylists);
    console.log("User Playlist in Screen", store.userPlaylists);
  }, [store.userPlaylists]);


  const handleClear = () => {
    // Clear the filter fields
    setFilters({
      playlistName: '',
      userName: '',
      songTitle: '',
      songArtist: '',
      songYear: ''
    });
    
    // Guests should load back to empty list, logged in users reload their own
    if (auth.guest) {
      setPlaylists([]);
    } else {
      store.loadUserPlaylists();
    }
  }

  // Handle searching for playlists by filter
  const handleSearch = async () => {
    console.log("filters:", filters);
    const playlists = await store.findPlaylistsByFilter(filters);
    console.log("Playlists from search:", playlists);
    setPlaylists(playlists);
    console.log("Playlists: ", playlists)
  };

  const addNewPlaylist = async () => {
    await store.createNewList();
  };

  let modalJSX = "";
  if (store.isEditPlaylistModalOpen()) {
    modalJSX = <MUIEditPlaylistModal />;
  }
  if (store.isDeleteListModalOpen()) {
    modalJSX = <MUIDeleteModal/>;
  }
  if (store.isPlayPlaylistModalOpen()) {
    modalJSX = <MUIPlayPlaylistModal/>
  }

  return (
    <Box id="playlist-screen">
      <Grid container>
        <Grid item xs={6}>
          <PlaylistSearchFilters
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </Grid>
        <Grid item xs={6}>
          <PlaylistsList playlists={playlists} />
          {auth.loggedIn && <Button onClick={addNewPlaylist}>+ New Playlist</Button>}
        </Grid>
      </Grid>
      {modalJSX}
    </Box>
  );
}
