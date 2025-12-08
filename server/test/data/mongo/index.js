const dotenv = require('dotenv').config({ path: __dirname + '/../../../.env' });
const bcrypt = require('bcryptjs');

async function clearCollection(collection, collectionName) {
    try {
        await collection.deleteMany({});
        console.log(collectionName + " cleared");
    }
    catch (err) {
        console.log(err);
    }
}

async function fillCollection(collection, collectionName, data) {


    for (let i = 0; i < data.length; i++) {
        let doc = new collection(data[i]);
        await doc.save();
    }
    console.log(collectionName + " filled");
}

async function resetMongo() {
    const Playlist = require('../../../models/playlist-model')
    const User = require("../../../models/user-model")
    const Song = require("../../../models/song-model")
    const testData = require("../PlaylisterData.json")

    console.log("Resetting the Mongo DB")

    // Make sure the data is transformed to match our schema
    const transformedUsers = testData.users.map(user => {
        // Split name into firstName and lastName
        const nameParts = user.name.match(/([A-Z][a-z]+)/g) || [user.name];
        const firstName = nameParts[0] || user.name;
        const lastName = nameParts.slice(1).join(' ') || firstName;

        // Generate a default password for the users)
        const saltRounds = 10;
        const passwordHash = bcrypt.hashSync("idkbro", saltRounds);

        return {
            firstName: firstName,
            lastName: lastName,
            email: user.email,
            passwordHash: passwordHash,
            avatar: user.avatar || null,
            playlists: []
        };
    });

    // Extract all unique songs from playlists
    // using a map to store all unique YoutubeIds
    // will be our reference to differentiate and get unique songs
    const songMap = new Map();

    testData.playlists.forEach(playlist => {
        if (playlist.songs && Array.isArray(playlist.songs)) {
            playlist.songs.forEach(song => {
                // Only add songs with valid required fields
                if (song.youTubeId && song.youTubeId.trim() !== '' &&
                    song.title && song.artist && song.year) {


                    const key = song.youTubeId;
                    if (!songMap.has(key)) {
                        songMap.set(key, {
                            title: song.title,
                            artist: song.artist,
                            year: String(song.year),
                            youTubeId: song.youTubeId,
                            ownerEmail: playlist.ownerEmail,
                            numListeners: 0,
                            inPlaylists: 0
                        });
                    }
                }
            });
        }
    });

    const uniqueSongs = Array.from(songMap.values());

    await clearCollection(Playlist, "Playlist");
    await clearCollection(User, "User");
    await clearCollection(Song, "Song");

    await fillCollection(User, "User", transformedUsers);
    await fillCollection(Song, "Song", uniqueSongs);
    await fillCollection(Playlist, "Playlist", testData.playlists);

    console.log("Mongo DB reset complete!");
    process.exit(0);
}

const mongoose = require('mongoose')
mongoose
    .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
    .then(() => {
        resetMongo().catch(err => {
            console.error('Reset error:', err);
            process.exit(1);
        });
    })
    .catch(e => {
        console.error('Connection error', e.message)
        process.exit(1);
    })


