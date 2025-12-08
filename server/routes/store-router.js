/*
    This is where we'll route all of the received http requests
    into controller response functions.

    @author McKilla Gorilla
*/
const express = require("express");
const StoreController = require("../controllers/store-controller");
const router = express.Router();
const auth = require("../auth");

router.post("/playlist", auth.verify, StoreController.createPlaylist);

// Issue that I had. Specific routes need to come before parameterized routes.
// Search endpoints don't require auth so guests can search
router.get("/playlist/search", StoreController.findPlaylistsByFilter);
router.delete("/playlist/:id", auth.verify, StoreController.deletePlaylist);
router.get("/playlist/:id", auth.verify, StoreController.getPlaylistById);
router.get("/playlistpairs", auth.verify, StoreController.getUserPlaylists);
router.get("/playlists", auth.verify, StoreController.getPlaylists);
router.put("/playlist/:id", auth.verify, StoreController.updatePlaylist);

router.post("/playlist/copy/:id", auth.verify, StoreController.copyPlaylistById);

// For Song Catalog
router.get("/songpairs", auth.verify, StoreController.getSongPairs);
router.post("/song", auth.verify, StoreController.createSong);
// Search endpoints don't require auth so guests can search
router.get("/songs/search", StoreController.findSongsByFilter);
router.put("/song/updatePlaylists", auth.verify, StoreController.updateSongInAllPlaylists);
router.post("/song/removeFromPlaylists", auth.verify, StoreController.removeSongFromAllPlaylists);
router.put("/song/:id", auth.verify, StoreController.updateSong);
router.delete("/song/:id", auth.verify, StoreController.deleteSong);
router.put("/song/inPlaylists/:id", auth.verify, StoreController.updateInPlaylistsNumber);
router.put("/song/listeners/:id", auth.verify, StoreController.updateSongListeners);

module.exports = router;
