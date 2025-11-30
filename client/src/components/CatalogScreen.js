import { useContext, useState, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import SongSearchFilters from "./SongSearchFilters";
import PlaylistsList from "./PlaylistsList";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

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
    setSongs();
  }, []);

  // Handle searching for songs by filter
  const handleSearch = async () => {
    console.log("filters:", filters);
    const songs = await store.findSongsByFilter(filters);
    console.log("Songs from search:", songs);
    setSongs(songs);
  };

  return (
    <Box id="playlist-screen">
      <Grid container>
        <Grid item xs={6}>
          <SongSearchFilters
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />
        </Grid>

        
        <Grid item xs={6}>
          <PlaylistsList playlists={playlists} />
        </Grid>
      </Grid>
    </Box>
  );
}
