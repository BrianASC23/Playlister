import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export default function PlaylistSearchFilters({ onSearch, filters, setFilters }) {

    const updateField = (field) => (e) => {
        setFilters({
            ...filters,
            [field]: e.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(filters);
    };

    const onClear = () => {
        const empty = {
            playlistName: '',
            userName: '',
            songTitle: '',
            songArtist: '',
            songYear: ''
        };
        setFilters(empty);
    }

    return(
        <Container component="section" maxWidth="sm">
            <CssBaseline />
            <Box elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h3" gutterBottom sx={{ mb: 2, color: "#c20cb9", fontWeight: "bold" }}>
                    Playlists
                </Typography>

                <Box component="form" noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Playlist Name"
                                fullWidth
                                sx={{ backgroundColor: "#e6e0e9"}}
                                value={filters.playlistName}
                                onChange={updateField('playlistName')}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="User Name"
                                sx={{ backgroundColor: "#e6e0e9"}}
                                fullWidth
                                value={filters.userName}
                                onChange={updateField('userName')}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Song Title"
                                sx={{ backgroundColor: "#e6e0e9"}}
                                fullWidth
                                value={filters.songTitle}
                                onChange={updateField('songTitle')}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Song Artist"
                                sx={{ backgroundColor: "#e6e0e9"}}
                                fullWidth
                                value={filters.songArtist}
                                onChange={updateField('songArtist')}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Song Year"
                                sx={{ backgroundColor: "#e6e0e9"}}
                                fullWidth
                                value={filters.songYear}
                                onChange={updateField('songYear')}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button type="submit" variant="contained">
                            Search
                        </Button>
                        <Button
                        variant="outlined"
                        onClick={onClear}
                        >
                            Clear
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}