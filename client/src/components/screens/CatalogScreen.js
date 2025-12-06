import { useContext, useState, useEffect } from "react";
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
  if (store.isDeleteSongModalOpen()){
    modalJSX = <MUIDeleteSongModal />
  }



  return (
    <Box id="playlist-screen">
      <Grid container>
        <Grid item xs={6}>
          <SongSearchFilter
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />
        </Grid>
        <Grid item xs={6}>
          <CatalogList songs={songs} />
          <Button onClick={handleAddNewSong}>+ New Songs</Button>
        </Grid>
      </Grid>
      {modalJSX}
    </Box>
  );
}
