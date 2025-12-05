import { useContext, useState, useEffect } from "react";
import { GlobalStoreContext } from "../../store";
import PlaylistSearchFilters from "../lists/PlaylistSearchFilters";
import PlaylistsList from "../lists/PlaylistsList";
import MUIEditPlaylistModal from "../modals/MUIEditPlaylistModal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MUIDeleteModal from "../modals/MUIDeleteModal";

export default function PlaylistScreen() {
  const { store } = useContext(GlobalStoreContext);

  const [filters, setFilters] = useState({});
  const [playlists, setPlaylists] = useState([]);

  // load the lists to the store
  // get the lists from the store and setPlaylist to it
  useEffect(() => {
    store.loadUserPlaylists();
  }, []);

  // Update local playlists when store.idNamePairs changes
  useEffect(() => {
    setPlaylists(store.userPlaylists);
    console.log("User Playlist in Screen", store.userPlaylists);
  }, [store.userPlaylists]);

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

  return (
    <Box id="playlist-screen">
      <Grid container>
        <Grid item xs={6}>
          <PlaylistSearchFilters
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />
        </Grid>
        <Grid item xs={6}>
          <PlaylistsList playlists={playlists} />
          <Button onClick={addNewPlaylist}>+ New Playlist</Button>
        </Grid>
      </Grid>
      {modalJSX}
    </Box>
  );
}
