import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store'
import SearchFilters from './SearchFilters';
import PlaylistsList from './PlaylistsList';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';



export default function PlaylistScreen(){
    const { store } = useContext(GlobalStoreContext);

    const [filters, setFilters] = useState({});
    const [playlists, setPlaylists] = useState([]);

    // load the lists to the store
    // get the lists from the store and setPlaylist to it
    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    // Update local playlists when store.idNamePairs changes
    useEffect(() => {
        setPlaylists(store.idNamePairs);
    }, [store.idNamePairs]);

    // Handle searching for playlists by filter
    const handleSearch = async () => {
        console.log("filters:", filters);
        const playlists = await store.findPlaylistsByFilter(filters);
        console.log("Playlists from search:", playlists);
        setPlaylists(playlists);
    }

    return(
        <Box id="playlist-screen">
            <Grid container>
                <Grid item xs={6}><SearchFilters filters={filters} setFilters={setFilters} onSearch={handleSearch}/></Grid>
                <Grid item xs={6}><PlaylistsList playlists={playlists}/></Grid>
            </Grid>
        </Box>
    )

}