import { useContext } from 'react'
import HomeScreen from './HomeScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'
import PlaylistScreen from './PlaylistScreen';

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);

    // either or
    if (auth.loggedIn || auth.guest)
        return <PlaylistScreen />
    else
        return <SplashScreen />
}