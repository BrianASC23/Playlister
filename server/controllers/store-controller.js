const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
const Song = require('../models/song-model');
const auth = require('../auth');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.

    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + playlist.toString());
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        user.playlists.push(playlist._id);
        user
            .save()
            .then(() => {
                playlist
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            playlist: playlist
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'Playlist Not Created!'
                        })
                    })
            });
    })
}
deletePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({});
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({
                        errorMessage: "authentication error"
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
getPlaylistById = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                console.log("correct user!");
                return res.status(200).json({ success: true, playlist: list })
                // Removed the userId === req.userId check cuz I need to be able to get and access the playlist for copying
            });
        }
        asyncFindUser(list);
    }).catch(err => console.log(err))
}
getUserPlaylists = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("getUserPlaylists");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Playlists owned by " + email);
            await Playlist.find({ ownerEmail: email }, (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }

                return res.status(200).json({ success: true, currentList: playlists })

            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}

findPlaylistsByFilter = async (req, res) => {
    try{
        const { playlistName, userName, songTitle, songArtist, songYear } = req.query;

        let query = {}

        if (playlistName){
            query.name = { $regex: playlistName, $options: "i" };
        }

        if (userName){
            query.ownerEmail = { $regex: userName, $options: "i" };
        }

        if (songTitle){
            query['songs.title'] =  { $regex: songTitle, $options: "i" };
        }

        if (songArtist) {
            query['songs.artist'] = { $regex: songArtist, $options: 'i' };
        }

        if (songYear) {
            query['songs.year'] = parseInt(songYear);
        }

        const playlists = await Playlist.find(query);

        // Get owner names for each playlist
        // Create array of promises so that for each playlist it would find the user email and based on that
        // create the output with the new format + data
        const playlistsWithOwnerNames = await Promise.all(
            playlists.map(async (playlist) => {
                const user = await User.findOne({ email: playlist.ownerEmail });
                return {
                    _id: playlist._id,
                    name: playlist.name,
                    ownerEmail: playlist.ownerEmail,
                    ownerName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
                    songs: playlist.songs
                };
            })
        );

        return res.status(200).json({
            success: true,
            playlists: playlistsWithOwnerNames
        });
    } catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }

}
updatePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name: " + req.body.name);

                    list.name = body.playlist.name;
                    list.songs = body.playlist.songs;
                    if (body.playlist.numListeners !== undefined) {
                        list.numListeners = body.playlist.numListeners;
                    }
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Playlist updated!',
                                playlist: list
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Playlist not updated!',
                            })
                        })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(playlist);
    })
}

getSongPairs = async (req, res) => {
    // check if auth.verify is null
    if (auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: "UNAUTHORIZED"
        });
    }

    // Find the User Email via req.userId
    await User.findOne({_id: req.userId}, (err, user) => {
        async function findUserSongs(email){
            await Song.find({ ownerEmail: email }, (err, songs) => {
                if (err){
                    return res.status(400).json({
                        success: false,
                        message: "Error finding User's Songs"
                    });
                }
                else{
                    console.log(`Songs: ${songs}`);
                    return res.status(200).json({
                        success: true,
                        songlist: songs
                    })
                }
            }).catch(err => console.log(err));
        }
        findUserSongs(user.email);
    }).catch(err => console.log(err));
}



createSong = async (req, res) => {
    // First see if it is a registered user
    if (auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        });
    }

    try {

        // We try to find user
        const user = await User.findOne({_id: req.userId});
        if (!user){
            return res.status(400).json({
                success: false,
                errorMessage: 'USER NOT FOUND'
            });
        }

        const { title, artist, year, youTubeId} = req.body;

        //Create a new Song

        const newSong = new Song({
            title: title,
            artist: artist,
            year: year,
            youTubeId: youTubeId,
            ownerEmail: user.email,
            numListeners: 0,
            inPlaylists: 0
        });

        await newSong.save();

        return res.status(200).json({
            success: true,
            song: newSong
        });
    } catch(err){
        return res.status(400).json({
            success: false,
            message: "FAILED TO CREATE SONG"
        })
    }
}


// Updating the "in playlists number field"
// Added a parameter for deciding whether to increment or decrement.
updateInPlaylistsNumber = async (req, res) => {
    if (auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        });
    }

    const { id } = req.params;
    const { operation } = req.body; // 'add' or 'remove'
    const song = await Song.findById(id);

    if(!song){
        return res.status(400).json({
            success: false,
            errorMessage: 'SONG NOT FOUND'
        });
    }

    if (operation === 'add') {
        song.inPlaylists = (song.inPlaylists || 0) + 1;
    } else if (operation === 'remove') {
        song.inPlaylists = Math.max((song.inPlaylists || 0) - 1, 0);
    } else {
        return res.status(400).json({
            success: false,
            errorMessage: 'INVALID OPERATION. USE "add" OR "remove"'
        });
    }

    await song.save();

    return res.status(200).json({
        success: true,
        message: "Song In Playlists Updated",
        song: song
    });

}


updateSong = async (req, res) => {
    if (auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        });
    }

    try {
        const user = await User.findOne({_id: req.userId});
        if (!user){
            return res.status(400).json({
                success: false,
                errorMessage: 'USER NOT FOUND'
            });
        }

        const { id } = req.params;
        const { title, artist, year, youTubeId } = req.body;

        const song = await Song.findById(id);
        if (!song) {
            return res.status(404).json({
                success: false,
                errorMessage: 'SONG NOT FOUND'
            });
        }

        if (song.ownerEmail !== user.email) {
            return res.status(403).json({
                success: false,
                errorMessage: 'CANT EDIT THIS SONG'
            });
        }

        song.title = title;
        song.artist = artist;
        song.year = year;
        song.youTubeId = youTubeId;

        await song.save();

        return res.status(200).json({
            success: true,
            song: song
        });
    } catch(err){
        return res.status(400).json({
            success: false,
            message: "FAILED TO UPDATE SONG"
        })
    }
}

// Don't need to do verification of user account -> can be guest account
findSongsByFilter = async (req, res) =>{
    try{
        const { title, artist, year } = req.query;

        let query = {}

        if (title){
            query.title = { $regex: title, $options: "i" };
        }

        if (artist){
            query.artist = { $regex: artist, $options: "i" };
        }

        if (year){
            query.year =  { $regex: year, $options: "i" };
        }


        const songs = await Song.find(query);

        return res.status(200).json({
            success: true,
            songs: songs
        });
    } catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }

}


copyPlaylistById = async (req, res) => {
    if (auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: "UNAUTHORIZED"
        });
    }

    let user = await User.findOne({ _id: req.userId });

    let playlist = req.body.playlist;

    if(!playlist){
        console.log("CAN'T COPY");
        return res.status(400).json({
            errorMessage: "Playlist is Null?"
        })
    }

    let newSongs = [];

    // owner email for songs CANNOT change
    // owner email for playlist CAN change

    for (let song of playlist.songs){
        let newSong = {
            title: song.title,
            artist: song.artist,
            year: song.year,
            youTubeId: song.youTubeId,
            ownerEmail: song.ownerEmail
        }
        newSongs.push(newSong);
    }

    let newPlaylist = new Playlist({
        name: playlist.name,
        ownerEmail: user.email,
        songs: newSongs
    });

    await newPlaylist.save();
    console.log("Copied Playlist", newPlaylist);

    return res.status(200).json({
        success: true,
        playlist: newPlaylist
    });

}

deleteSong = async (req, res) => {
    if (auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        });
    }


    const user = await User.findOne({_id: req.userId});
    if (!user){
        return res.status(400).json({
            success: false,
            errorMessage: 'USER NOT FOUND'
        });
    }

    const { id } = req.params;
    const song = await Song.findById(id);

    if (!song) {
        return res.status(404).json({
            success: false,
            errorMessage: 'SONG NOT FOUND'
        });
    }

    if (song.ownerEmail !== user.email) {
        return res.status(403).json({
            success: false,
            errorMessage: 'CANT THIS SONG'
        });
    }

    await Song.findByIdAndDelete(id);

    return res.status(200).json({
        success: true,
        message: 'Song deleted successfully'
    });
}

updateSongInAllPlaylists = async (req, res) => {
    if (auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        });
    }

    const { catalogSongId, title, artist, year, youTubeId } = req.body;

    // Find all playlists that contain the song._id to be deleted.
    const playlists = await Playlist.find({
        'songs.catalogSongId': catalogSongId
    });

    // Update each matched playlist's song
    for (let playlist of playlists) {
        for (let song of playlist.songs) {
            if (song.catalogSongId === catalogSongId) {
                console.log(`Updating song in playlist ${playlist.name}`);
                song.title = title;
                song.artist = artist;
                song.year = year;
                song.youTubeId = youTubeId;
            }
        }
        await playlist.save();
    }

    return res.status(200).json({
        success: true,
        message: `Updated song in the playlists`
    });
}

removeSongFromAllPlaylists = async (req, res) => {
    if (auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        });
    }


    const { catalogSongId } = req.body;

    // Find all playlists that contain a song with this catalogSongId
    const playlists = await Playlist.find({
        'songs.catalogSongId': catalogSongId
    });

    // Remove the song from each playlist
    for (let playlist of playlists) {
        playlist.songs = playlist.songs.filter(
            song => song.catalogSongId !== catalogSongId
        );
        await playlist.save();
    }

    return res.status(200).json({
        success: true,
        message: `Removed song from ${playlists.length} playlists`
    });

}


module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    getPlaylists,
    findPlaylistsByFilter,
    updatePlaylist,
    getSongPairs,
    createSong,
    updateSong,
    deleteSong,
    updateInPlaylistsNumber,
    updateSongInAllPlaylists,
    removeSongFromAllPlaylists,
    findSongsByFilter,
    copyPlaylistById
}