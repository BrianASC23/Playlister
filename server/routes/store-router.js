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
router.get("/playlist/search", auth.verify, StoreController.findPlaylistsByFilter);
router.delete("/playlist/:id", auth.verify, StoreController.deletePlaylist);
router.get("/playlist/:id", auth.verify, StoreController.getPlaylistById);
router.get("/playlistpairs", auth.verify, StoreController.getPlaylistPairs);
router.get("/playlists", auth.verify, StoreController.getPlaylists);
router.put("/playlist/:id", auth.verify, StoreController.updatePlaylist);

// For Song Catalog
router.get("/songpairs", auth.verify, StoreController.getSongPairs);
router.post("/song", auth.verify, StoreController.createSong);

module.exports = router;
