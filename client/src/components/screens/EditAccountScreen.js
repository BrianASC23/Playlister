import { useContext, useState } from 'react';
import AuthContext from '../../auth'
import MUIErrorModal from '../MUIErrorModal'
import Copyright from '../Copyright'

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


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function EditAccountScreen() {
    const { auth } = useContext(AuthContext);

    const [avatarSrc, setAvatarSrc] = useState(null);

    const [avatarErr, setAvatarErr] = useState(null);

    const MAX_DIMENSIONS = 250;

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        auth.editUser(
            formData.get('firstName'),
            formData.get('lastName'),
            formData.get('password'),
            formData.get('passwordVerify'),
            avatarSrc
        );
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')){
            setAvatarErr("Avatar is not an image!");
            return;
        }

        //Create Image Object
        const img = new Image();

        // Find the specific dimensions.
        img.onload = function(){
            const width = img.width;
            const height = img.height;

            if ((width > MAX_DIMENSIONS) || (height > MAX_DIMENSIONS)){
                setAvatarErr("Image larger than max dimensions");
                URL.revokeObjectURL(img.src);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarSrc(reader.result);
                setAvatarErr(null);
            };
            reader.readAsDataURL(file);

            URL.revokeObjectURL(img.src);

        }

        img.src = URL.createObjectURL(file);
    }

    let modalJSX = ""
    console.log(auth);
    if (auth.errorMessage !== null){
        modalJSX = <MUIErrorModal />;
    }
    console.log(modalJSX);

    return (
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Grid container spacing={4} direction="row" alignItems="flex-start" sx={{ mt: 4 }}>
                        <Grid item xs={2}>
                            <Box>
                                <Avatar
                                    sx={{ width: 72, height: 72, mb: 1 }}
                                    src={avatarSrc || '/images/uploaded_image.png'}
                                />
                                <Button
                                    variant='contained'
                                    component="label"
                                    role={undefined}
                                    size='small'
                                    sx={{
                                        textTransform: 'none',
                                        bgcolor: '#333',
                                        '&:hover': { bgcolor: '#222' },
                                    }}
                                >
                                    Select
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                </Button>
                                {avatarErr && (
                                    <Typography
                                        variant='caption'
                                        color='error'
                                        sx={{mt: 1, textAlign: 'center'}}
                                    >
                                        {avatarErr}
                                    </Typography>
                                )}
                            </Box>

                        </Grid>
                        <Grid item xs={12} sm={8} >
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 0 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoComplete="fname"
                                            name="firstName"
                                            required
                                            fullWidth
                                            id="firstName"
                                            label="First Name"
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="lastName"
                                            label="Last Name"
                                            name="lastName"
                                            autoComplete="lname"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="passwordVerify"
                                            label="Password Verify"
                                            type="password"
                                            id="passwordVerify"
                                            autoComplete="new-password"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8}>
                                    <Grid item xs={6}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            Complete
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            type="button"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                            onClick={() => window.location.href = '/'}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>

                            </Box>
                        </Grid>

                    </Grid>

                </Box>
                <Copyright sx={{ mt: 5 }} />
                { modalJSX }
            </Container>
    );
}