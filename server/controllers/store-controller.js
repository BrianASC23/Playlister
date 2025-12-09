const Playlist = require("../models/playlist-model");
const User = require("../models/user-model");
const Song = require("../models/song-model");
const Counter = require("../models/counter-model");
const auth = require("../auth");
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.

    @author McKilla Gorilla
*/
createPlaylist = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }
  const body = req.body;
  console.log("createPlaylist body: " + JSON.stringify(body));
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a Playlist",
    });
  }

  try {
    // Check if user already has a playlist with the same name
    const existingPlaylist = await Playlist.findOne({
      ownerEmail: body.ownerEmail,
      name: body.name,
    });

    if (existingPlaylist) {
      return res.status(400).json({
        success: false,
        errorMessage: "A playlist with this name already exists!",
      });
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + playlist.toString());
    if (!playlist) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid playlist data" });
    }

    const user = await User.findOne({ _id: req.userId });
    console.log("user found: " + JSON.stringify(user));

    // Get and increment the global list counter
    let counter = await Counter.findOne({ name: "globalListCounter" });
    if (!counter) {
      counter = new Counter({ name: "globalListCounter", value: 0 });
    }
    counter.value += 1;
    await counter.save();

    user.playlists.push(playlist._id);
    await user.save();
    await playlist.save();

    return res.status(201).json({
      playlist: playlist,
      globalListCounter: counter.value,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return res.status(400).json({
      success: false,
      errorMessage: "Playlist Not Created!",
    });
  }
};
deletePlaylist = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }
  console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
  console.log("delete " + req.params.id);
  Playlist.findById({ _id: req.params.id }, (err, playlist) => {
    console.log("playlist found: " + JSON.stringify(playlist));
    if (!playlist) {
      return res.status(404).json({
        success: false,
        errorMessage: "Playlist not found",
      });
    }
    if (err) {
      return res.status(404).json({
        errorMessage: "Playlist not found!",
      });
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      User.findOne({ email: list.ownerEmail }, (err, user) => {
        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);
        if (user._id == req.userId) {
          console.log("correct user!");
          Playlist.findOneAndDelete({ _id: req.params.id }, () => {
            return res.status(200).json({
              success: true,
              message: "Playlist successfully deleted",
            });
          }).catch((err) => console.log(err));
        } else {
          console.log("incorrect user!");
          return res.status(400).json({
            errorMessage: "authentication error",
          });
        }
      });
    }
    asyncFindUser(playlist);
  });
};
getPlaylistById = async (req, res) => {
  // Allow both guests and authenticated users to get playlists. When I had the check, it broke adding catalog song to Playlist
  const userId = auth.verifyUser(req);
  console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

  await Playlist.findById({ _id: req.params.id }, (err, list) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    // Check if playlist exists
    if (!list) {
      return res.status(404).json({
        success: false,
        errorMessage: "Playlist not found",
      });
    }

    console.log("Found list: " + JSON.stringify(list));

    // Return the playlist (no ownership check needed for viewing)
    return res.status(200).json({ success: true, playlist: list });
  }).catch((err) => console.log(err));
};
getUserPlaylists = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }
  console.log("getUserPlaylists");
  await User.findOne({ _id: req.userId }, async (err, user) => {
    console.log("find user with id " + req.userId);
    async function asyncFindList(email, user) {
      console.log("find all Playlists owned by " + email);
      await Playlist.find({ ownerEmail: email }, async (err, playlists) => {
        console.log("found Playlists: " + JSON.stringify(playlists));
        if (err) {
          return res.status(400).json({ success: false, error: err });
        }
        if (!playlists) {
          console.log("!playlists.length");
          return res
            .status(404)
            .json({ success: false, error: "Playlists not found" });
        }

        // Add owner information to each playlist -> for the initial load
        const playlistsWithOwnerInfo = playlists.map((playlist) => ({
          _id: playlist._id,
          name: playlist.name,
          ownerEmail: playlist.ownerEmail,
          ownerName: `${user.firstName} ${user.lastName}`,
          ownerAvatar: user.avatar,
          songs: playlist.songs,
          numListeners: playlist.numListeners || 0,
        }));

        // Get the global list counter
        const counter = await Counter.findOne({ name: "globalListCounter" });
        const globalListCounter = counter ? counter.value : 0;

        return res.status(200).json({
          success: true,
          currentList: playlistsWithOwnerInfo,
          globalListCounter: globalListCounter,
        });
      }).catch((err) => console.log(err));
    }
    asyncFindList(user.email, user);
  }).catch((err) => console.log(err));
};
getPlaylists = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }
  await Playlist.find({}, (err, playlists) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!playlists.length) {
      return res
        .status(404)
        .json({ success: false, error: `Playlists not found` });
    }
    return res.status(200).json({ success: true, data: playlists });
  }).catch((err) => console.log(err));
};

findPlaylistsByFilter = async (req, res) => {
  try {
    const { playlistName, userName, songTitle, songArtist, songYear } =
      req.query;

    let query = {};

    if (playlistName) {
      query.name = { $regex: playlistName, $options: "i" };
    }

    if (userName) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: userName, $options: "i" } },
          { lastName: { $regex: userName, $options: "i" } },
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$firstName", " ", "$lastName"] },
                regex: userName,
                options: "i",
              },
            },
          },
        ],
      });

      // Get emails of matched users in order to query the Playlists by email
      const userEmails = users.map((user) => user.email);

      if (userEmails.length > 0) {
        query.ownerEmail = { $in: userEmails };
      } else {
        query.ownerEmail = null;
      }
    }

    if (songTitle) {
      query["songs.title"] = { $regex: songTitle, $options: "i" };
    }

    if (songArtist) {
      query["songs.artist"] = { $regex: songArtist, $options: "i" };
    }

    if (songYear) {
      query["songs.year"] = parseInt(songYear);
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
          ownerName: user ? `${user.firstName} ${user.lastName}` : "Unknown",
          ownerAvatar: user ? user.avatar : null,
          songs: playlist.songs,
          numListeners: playlist.numListeners || 0,
        };
      })
    );

    return res.status(200).json({
      success: true,
      playlists: playlistsWithOwnerNames,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
updatePlaylist = async (req, res) => {
  const body = req.body;
  console.log("updatePlaylist: " + JSON.stringify(body));
  console.log("req.body.name: " + req.body.name);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  // Check if this is a guest user (no authentication)
  const userId = auth.verifyUser(req);
  const playlist = body.playlist || body;

  if (userId === null) {
    // Guest users can only increment listener count, not modify playlist content
    Playlist.findById(req.params.id, (err, foundPlaylist) => {
      if (err || !foundPlaylist) {
        return res.status(404).json({
          success: false,
          errorMessage: "Playlist not found",
        });
      }

      // Only update numListeners for guests
      if (playlist.numListeners !== undefined) {
        foundPlaylist.numListeners = playlist.numListeners;
      }

      foundPlaylist
        .save()
        .then(() => {
          return res.status(200).json({
            success: true,
            id: foundPlaylist._id,
            message: "Playlist updated!",
            playlist: foundPlaylist,
          });
        })
        .catch((error) => {
          console.log("FAILURE: " + JSON.stringify(error));
          return res.status(404).json({
            error,
            message: "Playlist not updated!",
          });
        });
    });
    return;
  }

  // For authenticated users, proceed with full update logic
  Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
    console.log("playlist found: " + JSON.stringify(playlist));
    if (!playlist) {
      return res.status(404).json({
        success: false,
        errorMessage: "Playlist not found",
      });
    }
    if (err) {
      return res.status(404).json({
        err,
        message: "Playlist not found!",
      });
    }

    // listener count update (playing a playlist)
    const isListenerUpdate =
      body.playlist &&
      body.playlist.numListeners !== undefined &&
      body.playlist.name === playlist.name &&
      JSON.stringify(body.playlist.songs) === JSON.stringify(playlist.songs);

    if (isListenerUpdate) {
      // Allow any authenticated user to increment listener count on any playlist
      playlist.numListeners = body.playlist.numListeners;
      playlist
        .save()
        .then(() => {
          return res.status(200).json({
            success: true,
            id: playlist._id,
            message: "Playlist updated!",
            playlist: playlist,
          });
        })
        .catch((error) => {
          console.log("FAILURE: " + JSON.stringify(error));
          return res.status(404).json({
            error,
            message: "Playlist not updated!",
          });
        });
      return;
    }

    // DOES THIS LIST BELONG TO THIS USER? (for name/songs updates)
    async function asyncFindUser(list) {
      try {
        const user = await User.findOne({ email: list.ownerEmail });
        console.log("user._id: " + user._id);
        console.log("userId from verifyUser: " + userId);
        if (user._id == userId) {
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
                message: "Playlist updated!",
                playlist: list,
              });
            })
            .catch((error) => {
              console.log("FAILURE: " + JSON.stringify(error));
              return res.status(404).json({
                error,
                message: "Playlist not updated!",
              });
            });
        } else {
          console.log("incorrect user!");
          return res
            .status(400)
            .json({ success: false, description: "authentication error" });
        }
      } catch (err) {
        console.log("Error finding user:", err);
        return res
          .status(400)
          .json({ success: false, description: "user lookup error" });
      }
    }
    asyncFindUser(playlist);
  });
};

getSongPairs = async (req, res) => {
  // check if auth.verify is null
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }

  // Find the User Email via req.userId
  await User.findOne({ _id: req.userId }, (err, user) => {
    async function findUserSongs(email) {
      await Song.find({ ownerEmail: email }, (err, songs) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: "Error finding User's Songs",
          });
        } else {
          console.log(`Songs: ${songs}`);
          return res.status(200).json({
            success: true,
            songlist: songs,
          });
        }
      }).catch((err) => console.log(err));
    }
    findUserSongs(user.email);
  }).catch((err) => console.log(err));
};

createSong = async (req, res) => {
  // First see if it is a registered user
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }

  try {
    // We try to find user
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(400).json({
        success: false,
        errorMessage: "USER NOT FOUND",
      });
    }

    const { title, artist, year, youTubeId } = req.body;

    // Check if a song with the same title, artist, and year already exists
    const existingSong = await Song.findOne({
      title: title,
      artist: artist,
      year: year,
    });

    if (existingSong) {
      return res.status(400).json({
        success: false,
        errorMessage:
          "A song with this title, artist, and year combination already exists!",
      });
    }

    //Create a new Song

    const newSong = new Song({
      title: title,
      artist: artist,
      year: year,
      youTubeId: youTubeId,
      ownerEmail: user.email,
      numListeners: 0,
      inPlaylists: 0,
    });

    await newSong.save();

    return res.status(200).json({
      success: true,
      song: newSong,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "FAILED TO CREATE SONG",
    });
  }
};

// Updating the "in playlists number field"
// Added a parameter for deciding whether to increment or decrement.
updateInPlaylistsNumber = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }

  const { id } = req.params;
  const { operation } = req.body; // 'add' or 'remove'
  const song = await Song.findById(id);

  if (!song) {
    return res.status(400).json({
      success: false,
      errorMessage: "SONG NOT FOUND",
    });
  }

  if (operation === "add") {
    song.inPlaylists = (song.inPlaylists || 0) + 1;
  } else if (operation === "remove") {
    song.inPlaylists = Math.max((song.inPlaylists || 0) - 1, 0);
  } else {
    return res.status(400).json({
      success: false,
      errorMessage: 'INVALID OPERATION. USE "add" OR "remove"',
    });
  }

  await song.save();

  return res.status(200).json({
    success: true,
    message: "Song In Playlists Updated",
    song: song,
  });
};

updateSong = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }

  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(400).json({
        success: false,
        errorMessage: "USER NOT FOUND",
      });
    }

    const { id } = req.params;
    const { title, artist, year, youTubeId } = req.body;

    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({
        success: false,
        errorMessage: "SONG NOT FOUND",
      });
    }

    if (song.ownerEmail !== user.email) {
      return res.status(403).json({
        success: false,
        errorMessage: "CANT EDIT THIS SONG",
      });
    }

    song.title = title;
    song.artist = artist;
    song.year = year;
    song.youTubeId = youTubeId;

    await song.save();

    return res.status(200).json({
      success: true,
      song: song,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "FAILED TO UPDATE SONG",
    });
  }
};

// Don't need to do verification of user account -> can be guest account
findSongsByFilter = async (req, res) => {
  try {
    const { title, artist, year } = req.query;

    let query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (artist) {
      query.artist = { $regex: artist, $options: "i" };
    }

    if (year) {
      query.year = { $regex: year, $options: "i" };
    }

    const songs = await Song.find(query);

    return res.status(200).json({
      success: true,
      songs: songs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

copyPlaylistById = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }

  let user = await User.findOne({ _id: req.userId });

  let playlist = req.body.playlist;

  if (!playlist) {
    console.log("CAN'T COPY");
    return res.status(400).json({
      errorMessage: "Playlist is Null?",
    });
  }

  // Check if user already has a playlist with the same name (including " (Copy)")
  const newPlaylistName = playlist.name + " (Copy)";
  const existingPlaylist = await Playlist.findOne({
    ownerEmail: user.email,
    name: newPlaylistName,
  });

  if (existingPlaylist) {
    return res.status(400).json({
      success: false,
      errorMessage: "A playlist with this name already exists!",
    });
  }

  let newSongs = [];

  // owner email for songs CANNOT change
  // owner email for playlist CAN change

  for (let song of playlist.songs) {
    let newSong = {
      title: song.title,
      artist: song.artist,
      year: song.year,
      youTubeId: song.youTubeId,
      ownerEmail: song.ownerEmail,
    };
    newSongs.push(newSong);
  }

  let newPlaylist = new Playlist({
    name: newPlaylistName,
    ownerEmail: user.email,
    songs: newSongs,
  });

  await newPlaylist.save();
  console.log("Copied Playlist", newPlaylist);

  return res.status(200).json({
    success: true,
    playlist: newPlaylist,
  });
};

deleteSong = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }

  const user = await User.findOne({ _id: req.userId });
  if (!user) {
    return res.status(400).json({
      success: false,
      errorMessage: "USER NOT FOUND",
    });
  }

  const { id } = req.params;
  const song = await Song.findById(id);

  if (!song) {
    return res.status(404).json({
      success: false,
      errorMessage: "SONG NOT FOUND",
    });
  }

  if (song.ownerEmail !== user.email) {
    return res.status(403).json({
      success: false,
      errorMessage: "CANT THIS SONG",
    });
  }

  await Song.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Song deleted successfully",
  });
};

updateSongInAllPlaylists = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }

  const { catalogSongId, title, artist, year, youTubeId } = req.body;

  // Find all playlists that contain the song._id to be deleted.
  const playlists = await Playlist.find({
    "songs.catalogSongId": catalogSongId,
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
    message: `Updated song in the playlists`,
  });
};

removeSongFromAllPlaylists = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }

  const { catalogSongId } = req.body;

  // Find all playlists that contain a song with this catalogSongId
  const playlists = await Playlist.find({
    "songs.catalogSongId": catalogSongId,
  });

  // Remove the song from each playlist
  for (let playlist of playlists) {
    playlist.songs = playlist.songs.filter(
      (song) => song.catalogSongId !== catalogSongId
    );
    await playlist.save();
  }

  return res.status(200).json({
    success: true,
    message: `Removed song from ${playlists.length} playlists`,
  });
};

updateSongListeners = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }

  const { id } = req.params;

  const song = await Song.findById(id);
  if (!song) {
    return res.status(404).json({
      success: false,
      errorMessage: "SONG NOT FOUND",
    });
  }

  song.numListeners = (song.numListeners || 0) + 1;
  await song.save();

  return res.status(200).json({
    success: true,
    message: "Song Listeners Updated",
    song: song,
  });
};

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
  updateSongListeners,
  updateSongInAllPlaylists,
  removeSongFromAllPlaylists,
  findSongsByFilter,
  copyPlaylistById,
};
