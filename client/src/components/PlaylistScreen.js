import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store'
import SearchFilters from './SearchFilters';
import PlaylistsList from './PlaylistsList';
import MUIErrorModal from './MUIErrorModal'
import Copyright from './Copyright'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';


export default function PlaylistScreen(){
    const { store } = useContext(GlobalStoreContext);

    const [filters, setFilters] = useState({});
    const [playlists, setPlaylists] = useState([]); // Will load user's playlist later

    // load the lists to the store
    // get the lists from the store and setPlaylist to it
    useEffect(() => {
        store.loadIdNamePairs();
        setPlaylists(store.idNamePairs)
    }, []);

    const handleSearch = async () => {
        const res = await store.findPlaylistsByFilter(filters);
        const data = await res.json()
        setPlaylists(data);
    }

    return(
        <div id="playlist-screen">
            <SearchFilters filters={filters} setFilters={setFilters} onSearch={handleSearch}></SearchFilters>
            <PlaylistsList></PlaylistsList>
        </div>
    )

}