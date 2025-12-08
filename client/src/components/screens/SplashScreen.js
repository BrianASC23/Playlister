import React, {useContext} from 'react';
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AuthContext from '../../auth';

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);

    function handleGuestLogin() {
        auth.loginAsGuest();
    }

    return (
        <Box id="splash-screen"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2
            }}
        >
            <Box sx={{alignItems: "center"}}>
                <Typography
                    component="h1"
                    variant="h1"
                    sx={{
                        mb: 4,
                        fontWeight: 500,
                        color: "black",
                        pt: 8
                    }}
                >
                    The Playlister
                </Typography>
                <Box
                    component="img"
                    src="/images/playlist-logo.png"
                    alt="Playlister logo"
                    sx={{
                        width: 170,
                        height: 170,
                        objectFit: "contain",
                        mb: 5,
                    }}
                >
                </Box>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={handleGuestLogin}
                            sx={{
                                textTransform: "none",
                                borderRadius: 1.5,
                                px: 3,
                                bgcolor: "black",
                            }}
                        >
                            Continue As Guest
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            sx={{
                                textTransform: "none",
                                borderRadius: 1.5,
                                px: 3,
                                bgcolor: "black"
                            }}
                        >
                            <Link to="/login/">Login</Link>
                        </Button>

                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            sx={{
                                textTransform: "none",
                                borderRadius: 1.5,
                                px: 3,
                                bgcolor: "black"
                            }}
                        >
                            <Link to='/register/'>Create Account</Link>
                        </Button>

                    </Grid>

                </Grid>
            </Box>
        </Box>
    )
}