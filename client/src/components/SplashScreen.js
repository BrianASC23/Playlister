import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


export default function SplashScreen() {
    return (
        <Box id="splash-screen"
            sx={{
                minHeight: "calc(100vh - 64px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f6f5dcff",
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
                        color: "black"
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
                            Login
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
                            Create Account
                        </Button>

                    </Grid>

                </Grid>
            </Box>
        </Box>
    )
}