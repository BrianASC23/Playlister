import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

import EditToolbar from './EditToolbar'

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }

    const handleHouseClick = () => {
        store.closeCurrentList();
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
        </Menu>
    );
    const loggedInMenu =
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/editaccount/'>Edit Account</Link></MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
        if (store.currentList) {
        }
    }

    function getAccountMenu(loggedIn) {
        if (loggedIn) {
            const avatar = auth.getUserAvatar();
            console.log("avatar: " + avatar);
            if (avatar) {
                return <Avatar src={avatar} alt="User Avatar" sx={{ width: 72, height: 72, mb: 1 }} />

            } else {
                const userInitials = auth.getUserInitials();
                return <div>{userInitials}</div>;
            }
        }
        else
            return <AccountCircle />;
    }



    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static" style={{ backgroundColor: "#ee06ff" }}>
                <Toolbar>
                    <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, minWidth: "250px" }}>

                            <Typography
                                variant="h4"
                                noWrap
                                component="div"
                                align='center'
                                sx={{ display: { xs: 'none', sm: 'block', background: 'white', borderRadius: '99px', width: '2.5rem', height: 'auto'} }}
                            >
                                <Link onClick={handleHouseClick} style={{ textDecoration: 'none', color: 'black' }} to='/'>⌂</Link>
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    textTransform: "none",
                                    bgcolor: "#1e1e1e",
                                    "&:hover": { bgcolor: "#1e1e1e" },
                                }}
                            >
                                <Link onClick={handleHouseClick} style={{ textDecoration: 'none', color: 'white' }} to='/'>Playlists</Link>
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    textTransform: "none",
                                    bgcolor: "#3a64c4",
                                    "&:hover": { bgcolor: "#3a64c4" },
                                }}
                            >
                                <Link onClick={handleHouseClick} style={{ textDecoration: 'none', color: 'white' }} to='/catalog'>Song Catalogue</Link>
                            </Button>
                        </Box>
                        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center"}}>
                            <Typography variant="h4"
                                component="div"
                                align='center'
                                sx={{ display: { sm: 'block', justifyContent: 'center'} }}
                            >
                                Playlister
                            </Typography>
                        </Box>

                        <Box sx={{ height: "90px", minWidth: "250px", display: "flex", justifyContent: "right", alignItems: "center" }}>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                { getAccountMenu(auth.loggedIn) }
                            </IconButton>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}