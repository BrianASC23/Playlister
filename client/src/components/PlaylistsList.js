import Avatar from '@mui/material/Avatar';
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
import PlaylistCard from './PlaylistCard';


export default function PlaylistsList({playlists}){
    return (
        <Box sx={{ px: 2, py: 1}}>
            <Box sx={{mb: 2, display: "flex", justifyContent: "space-between"}}>
                <Typography variant="h6">
                    Sort By (Placeholder)
                </Typography>
                <Typography variant="h6">
                    {playlists.length} Playlists
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {playlists.map((playlist) => (
                    <Grid item xs={12} key={playlist._id}>
                        <PlaylistCard
                            playlist={playlist}
                            onDelete={() => onDelete(playlist._id)}
                            onEdit={() => onEdit(playlist._id)}
                            onCopy={() => onCopy(playlist._id)}
                            onPlay={() => onPlay(playlist._id)}
                        />
                    </Grid>
                ))
                };
            </Grid>


        </Box>
    );
}