/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.

    @author McKilla Gorilla
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/store',
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createPlaylist = (newListName, newSongs, userEmail) => {
    return api.post(`/playlist/`, {
        // SPECIFY THE PAYLOAD
        name: newListName,
        songs: newSongs,
        ownerEmail: userEmail
    })
}
export const deletePlaylistById = (id) => api.delete(`/playlist/${id}`)
export const getPlaylistById = (id) => api.get(`/playlist/${id}`)
export const loadUserPlaylists = () => api.get(`/playlistpairs/`)
export const updatePlaylistById = (id, playlist) => {
    return api.put(`/playlist/${id}`, {
        // SPECIFY THE PAYLOAD
        playlist : playlist
    })
}

// I think this should be fine because I alr converted filters to a Param String
export const findPlaylistsByFilter = (filters) => api.get(`/playlist/search?${filters.toString()}`)


// For Song Catalog
export const getSongPairs = () => api.get(`/songpairs/`)

export const createSong = (songData) => {
    return api.post(`/song/`, {
        title: songData.title,
        artist: songData.artist,
        year: songData.year,
        youTubeId: songData.youTubeId
    })
}

export const updateSongById = (id, songData) => {
    return api.put(`/song/${id}`, {
        title: songData.title,
        artist: songData.artist,
        year: songData.year,
        youTubeId: songData.youTubeId
    })
}

export const updateSongInAllPlaylists = (songData) => {
    return api.put(`/song/updatePlaylists`, {
        catalogSongId: songData.catalogSongId,
        title: songData.title,
        artist: songData.artist,
        year: songData.year,
        youTubeId: songData.youTubeId
    })
}

export const removeSongFromAllPlaylists = (catalogSongId) => {
    return api.post(`/song/removeFromPlaylists`, {
        catalogSongId: catalogSongId
    })
}

export const findSongsByFilter = (filters) => api.get(`/songs/search?${filters.toString()}`)

export const copyPlaylistById = (playlist) => {
    return api.post(`/playlist/copy/${playlist._id}`, {
        playlist: playlist
    })
}

export const deleteSongById = (id) => api.delete(`/song/${id}`)

export const updateInPlaylistsNumber = (id, operation) => {
    return api.put(`/song/inPlaylists/${id}`, {
        operation: operation
    })
}

export const updateSongListeners = (id) => {
    return api.put(`/song/listeners/${id}`)
}


const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    updatePlaylistById,

    loadUserPlaylists,
    getSongPairs,

    findPlaylistsByFilter,
    findSongsByFilter,

    createSong,
    updateSongById,
    deleteSongById,

    updateSongInAllPlaylists,
    removeSongFromAllPlaylists,

    copyPlaylistById,

    updateInPlaylistsNumber,
    updateSongListeners,
}

export default apis
