import { createContext, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { jsTPS } from "jstps";
import storeRequestSender from "./requests";
import CreateSong_Transaction from "../transactions/CreateSong_Transaction";
import MoveSong_Transaction from "../transactions/MoveSong_Transaction";
import RemoveSong_Transaction from "../transactions/RemoveSong_Transaction";
import UpdateSong_Transaction from "../transactions/UpdateSong_Transaction";
import CopySong_Transaction from "../transactions/CopySong_Transaction";
import AuthContext from "../auth";

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers.

    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
  CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
  CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
  CREATE_NEW_LIST: "CREATE_NEW_LIST",
  LOAD_USER_PLAYLISTS: "LOAD_USER_PLAYLISTS",
  MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
  SET_CURRENT_LIST: "SET_CURRENT_LIST",
  SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
  EDIT_SONG: "EDIT_SONG",
  REMOVE_SONG: "REMOVE_SONG",
  HIDE_MODALS: "HIDE_MODALS",

  EDIT_PLAYLIST: "EDIT_PLAYLIST",
  PLAY_PLAYLIST: "PLAY_PLAYLIST",
  LOAD_USER_SONGS: "LOAD_USER_SONGS",
  CREATE_SONGS: "CREATE_SONGS",
  SET_CURRENT_SONG_INDEX: "SET_CURRENT_SONG_INDEX",
  MARK_SONG_FOR_DELETION: "MARK_SONG_FOR_DELETION",
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
  NONE: "NONE",
  DELETE_LIST: "DELETE_LIST",
  DELETE_SONG: "DELETE_SONG",
  EDIT_SONG: "EDIT_SONG",
  ERROR: "ERROR",
  EDIT_PLAYLIST: "EDIT_PLAYLIST",
  PLAY_PLAYLIST: "PLAY_PLAYLIST",
};

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
  // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
  const [store, setStore] = useState({
    currentModal: CurrentModal.NONE,
    userPlaylists: [],
    currentList: null,
    currentSongIndex: -1,
    currentSong: null,
    newListCounter: 0,
    listNameActive: false,
    listIdMarkedForDeletion: null,
    listMarkedForDeletion: null,

    // For Song Catalog
    songlist: [],
    songIdMarkedForDeletion: null,
    songMarkedForDeletion: null,
  });
  const history = useHistory();

  console.log("inside useGlobalStore");

  // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
  const { auth } = useContext(AuthContext);
  console.log("auth: " + auth);

  // HERE'S THE DATA STORE'S REDUCER, IT MUST
  // HANDLE EVERY TYPE OF STATE CHANGE
  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      // LIST UPDATE OF ITS NAME
      case GlobalStoreActionType.CHANGE_LIST_NAME: {
        return setStore({
          currentModal: CurrentModal.NONE,
          userPlaylists: payload.userPlaylists,
          currentList: payload.playlist,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: store.songlist,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      // STOP EDITING THE CURRENT LIST
      case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
        return setStore({
          currentModal: CurrentModal.NONE,
          userPlaylists: store.userPlaylists,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: store.songlist,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      // CREATE A NEW LIST
      case GlobalStoreActionType.CREATE_NEW_LIST: {
        return setStore({
          currentModal: CurrentModal.EDIT_PLAYLIST,
          userPlaylists: [...store.userPlaylists, payload],
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter + 1,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: store.songlist,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      // GET ALL THE LISTS SO WE CAN PRESENT THEM
      // ORIGINALLY LOAD_ID_NAME_PAIR
      case GlobalStoreActionType.LOAD_USER_PLAYLISTS: {
        return setStore({
          currentModal: CurrentModal.NONE,
          userPlaylists: payload,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: store.songlist,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      // PREPARE TO DELETE A LIST
      case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
        return setStore({
          currentModal: CurrentModal.DELETE_LIST,
          userPlaylists: store.userPlaylists,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: payload.id,
          listMarkedForDeletion: payload.playlist,
          songlist: store.songlist,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      // UPDATE A LIST
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore({
          currentModal: store.currentModal,
          userPlaylists: store.userPlaylists,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: store.songlist,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      // START EDITING A LIST NAME
      case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
        return setStore({
          currentModal: CurrentModal.NONE,
          userPlaylists: store.userPlaylists,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: true,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: store.songlist,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      //
      case GlobalStoreActionType.EDIT_SONG: {
        return setStore({
          currentModal: CurrentModal.EDIT_SONG,
          userPlaylists: store.userPlaylists,
          currentList: store.currentList,
          currentSongIndex: payload.currentSongIndex,
          currentSong: payload.currentSong,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: store.songlist,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      case GlobalStoreActionType.REMOVE_SONG: {
        return setStore({
          currentModal: CurrentModal.NONE,
          userPlaylists: store.userPlaylists,
          currentList: store.currentList,
          currentSongIndex: payload.currentSongIndex,
          currentSong: payload.currentSong,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: store.songlist,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      case GlobalStoreActionType.HIDE_MODALS: {
        return setStore({
          currentModal: CurrentModal.NONE,
          userPlaylists: store.userPlaylists,
          currentList: store.currentList,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: store.songlist,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      case GlobalStoreActionType.LOAD_USER_SONGS: {
        return setStore({
          currentModal: CurrentModal.NONE,
          userPlaylists: store.userPlaylists,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: payload,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      case GlobalStoreActionType.CREATE_SONGS: {
        return setStore({
          currentModal: CurrentModal.NONE,
          userPlaylists: store.userPlaylists,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: payload.songlist,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      case GlobalStoreActionType.EDIT_PLAYLIST: {
        return setStore({
          currentModal: CurrentModal.EDIT_PLAYLIST,
          userPlaylists: store.userPlaylists,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: store.songlist,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      case GlobalStoreActionType.PLAY_PLAYLIST: {
        return setStore({
          currentModal: CurrentModal.PLAY_PLAYLIST,
          userPlaylists: store.userPlaylists,
          currentList: payload,
          currentSongIndex: 0,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: store.songlist,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      case GlobalStoreActionType.SET_CURRENT_SONG_INDEX: {
        return setStore({
          currentModal: store.currentModal,
          userPlaylists: store.userPlaylists,
          currentList: store.currentList,
          currentSongIndex: payload,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: store.songlist,
          songIdMarkedForDeletion: null,
          songMarkedForDeletion: null,
        });
      }
      // PREPARE TO DELETE A SONG
      case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
        return setStore({
          currentModal: CurrentModal.DELETE_SONG,
          userPlaylists: store.userPlaylists,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          songlist: store.songlist,
          songIdMarkedForDeletion: payload.id,
          songMarkedForDeletion: payload.song,
        });
      }
      default:
        return store;
    }
  };

  store.tryAcessingOtherAccountPlaylist = function () {
    let id = "635f203d2e072037af2e6284";
    async function asyncSetCurrentList(id) {
      let response = await storeRequestSender.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: playlist,
        });
      }
    }
    asyncSetCurrentList(id);
    history.push("/playlist/635f203d2e072037af2e6284");
  };

  // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
  // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
  // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

  // THIS FUNCTION PROCESSES CHANGING A LIST NAME
  store.changeListName = function (id, newName) {
    // GET THE LIST
    async function asyncChangeListName(id) {
      let response = await storeRequestSender.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        playlist.name = newName;
        async function updateList(playlist) {
          response = await storeRequestSender.updatePlaylistById(
            playlist._id,
            playlist
          );
          if (response.data.success) {
            async function getListPairs(playlist) {
              response = await storeRequestSender.loadUserPlaylists();
              if (response.data.success) {
                let playlists = response.data.currentList;
                storeReducer({
                  type: GlobalStoreActionType.CHANGE_LIST_NAME,
                  payload: {
                    userPlaylists: playlists,
                    playlist: playlist,
                  },
                });
              }
            }
            getListPairs(playlist);
          }
        }
        updateList(playlist);
      }
    }
    asyncChangeListName(id);
  };

  // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
  store.closeCurrentList = async function () {
    // Before we close the list, check if any songs were duplicated/copied in the playlists.
    // If yes, then create the Copied Song in the Catalog
    if (store.currentList && store.currentList.songs) {
      const songsNeedingCatalog = store.currentList.songs.filter(
        (song) => song.needsCatalogCreation === true && !song.catalogSongId
      );

      for (let song of songsNeedingCatalog) {
        try {
          let catalogSongData = {
            title: song.title,
            artist: song.artist,
            year: song.year,
            youTubeId: song.youTubeId,
          };

          let catalogResponse = await storeRequestSender.createSong(
            catalogSongData
          );

          if (catalogResponse.data.success) {
            // Update the song in the playlist with the new catalogSongId
            // because old catalogSongId points to the original one
            song.catalogSongId = catalogResponse.data.song._id;

            // Increment inPlaylists counter since the song is already in this playlist
            await storeRequestSender.updateInPlaylistsNumber(
              song.catalogSongId,
              "add"
            );

            // Remove the flag once we are done.
            delete song.needsCatalogCreation;
          }
        } catch (error) {
          console.error("Error creating catalog song:", error);
        }
      }

      // If any songs were added to catalog, update the playlist
      if (songsNeedingCatalog.length > 0) {
        await storeRequestSender.updatePlaylistById(
          store.currentList._id,
          store.currentList
        );
        // Refresh the song catalog
        store.getSongByUser();
      }
    }

    storeReducer({
      type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
      payload: {},
    });
    tps.clearAllTransactions();
    history.push("/");
  };

  // THIS FUNCTION CREATES A NEW LIST
  store.createNewList = async function () {
    let newListName = "Untitled" + store.newListCounter;
    const response = await storeRequestSender.createPlaylist(
      newListName,
      [],
      auth.user.email
    );
    console.log("createNewList response: " + response);
    if (response.status === 201) {
      tps.clearAllTransactions();
      let newList = response.data.playlist;
      storeReducer({
        type: GlobalStoreActionType.CREATE_NEW_LIST,
        payload: newList,
      });
      console.log("Created new list with modal set to EDIT_PLAYLIST");
      // IF IT'S A VALID LIST THEN LET'S START EDITING IT
      //   history.push("/playlist/" + newList._id);
    } else {
      console.log("FAILED TO CREATE A NEW LIST");
    }
  };

  // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
  // CHANGED FROM LOAD_ID_NAME_PAIR to
  // LOADS ALL THE USER's PLAYLIST
  store.loadUserPlaylists = async () => {
    const response = await storeRequestSender.loadUserPlaylists();
    if (response.data.success) {
      let playlists = response.data.currentList;
      console.log("Loading", playlists);
      storeReducer({
        type: GlobalStoreActionType.LOAD_USER_PLAYLISTS,
        payload: playlists,
      });
    } else {
      console.log("FAILED TO GET THE LIST PAIRS");
    }
  };

  // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
  // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
  // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
  // showDeleteListModal, and hideDeleteListModal
  store.markListForDeletion = function (id) {
    async function getListToDelete(id) {
      let response = await storeRequestSender.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        storeReducer({
          type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
          payload: { id: id, playlist: playlist },
        });
      }
    }
    getListToDelete(id);
  };
  store.deleteList = function (id) {
    async function processDelete(id) {
      let response = await storeRequestSender.deletePlaylistById(id);
      store.loadUserPlaylists();
      if (response.data.success) {
        history.push("/");
      }
    }
    processDelete(id);
  };
  store.deleteMarkedList = function () {
    store.deleteList(store.listIdMarkedForDeletion);
    store.hideModals();
  };

  // Copy/duplicate playlists

  store.copyPlaylist = async (id) => {
    try {
      console.log("Copying playlist with ID:", id);
      // Getting the playlist
      let response = await storeRequestSender.getPlaylistById(id);
      let playlist = response.data.playlist;
      console.log("Got playlist:", playlist);
      let copyResponse = await storeRequestSender.copyPlaylistById(playlist);
      if (copyResponse.data.success) {
        // Reload all playlists to show the new copy
        await store.loadUserPlaylists();
      }
    } catch (error) {
      console.error("Error copying playlist:", error);
    }
  };

  store.isPlayPlaylistModalOpen = () => {
    return store.currentModal === CurrentModal.PLAY_PLAYLIST;
  };

  store.showPlayPlaylistModal = async (playlist) => {
    let updatedPlaylist = {
      ...playlist,
      numListeners: (playlist.numListeners || 0) + 1,
    };

    let response = await storeRequestSender.updatePlaylistById(
      playlist._id,
      updatedPlaylist
    );
    if (response.data.success) {
      storeReducer({
        type: GlobalStoreActionType.PLAY_PLAYLIST,
        payload: response.data.playlist,
      });
    }
  };

  // Might delete cuz I don't need it
  store.playPlaylist = async (id) => {
    try {
      console.log("Playing playlist with ID:", id);
      let response = await storeRequestSender.getPlaylistById(id);

      if (response.data.success) {
        let playlist = response.data.playlist;
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: playlist,
        });
      }
    } catch (error) {
      console.error("Error getting playlist to play:", error);
    }
  };

  // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
  // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

  store.showEditSongModal = (songIndex, songToEdit) => {
    storeReducer({
      type: GlobalStoreActionType.EDIT_SONG,
      payload: { currentSongIndex: songIndex, currentSong: songToEdit },
    });
  };

  store.hideModals = () => {
    auth.errorMessage = null;
    storeReducer({
      type: GlobalStoreActionType.HIDE_MODALS,
      payload: {},
    });
  };
  store.isDeleteListModalOpen = () => {
    return store.currentModal === CurrentModal.DELETE_LIST;
  };

  store.isDeleteSongModalOpen = () => {
    return store.currentModal === CurrentModal.DELETE_SONG;
  };
  store.isEditSongModalOpen = () => {
    return store.currentModal === CurrentModal.EDIT_SONG;
  };
  store.isErrorModalOpen = () => {
    return store.currentModal === CurrentModal.ERROR;
  };

  // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
  // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
  // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
  // moveItem, updateItem, updateCurrentList, undo, and redo
  store.setCurrentList = function (id) {
    async function asyncSetCurrentList(id) {
      console.log("setCurrentList called with id:", id);
      let response = await storeRequestSender.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        console.log("Setting current list is success", playlist);
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: playlist,
        });
        console.log("Set Current List", playlist);
      }
    }
    return asyncSetCurrentList(id);
  };

  store.getPlaylistSize = function () {
    return store.currentList.songs.length;
  };

  // Add song from catalog to playlist
  store.addSongToPlaylist = async (id, song) => {
    let getResponse = await storeRequestSender.getPlaylistById(id);

    let playlistFromGet = getResponse.data.playlist;

    let songs = [...playlistFromGet.songs];

    // Add the song with catalogSongId
    const songToAdd = {
      title: song.title,
      artist: song.artist,
      year: song.year,
      youTubeId: song.youTubeId,
      ownerEmail: song.ownerEmail,
      catalogSongId: song._id,
    };

    console.log("Adding song to playlist with catalogSongId:", song._id);

    songs.push(songToAdd);

    let updatedPlaylist = {
      name: playlistFromGet.name,
      ownerEmail: playlistFromGet.ownerEmail,
      songs: songs,
    };

    let response = await storeRequestSender.updatePlaylistById(
      id,
      updatedPlaylist
    );

    // Then need to update the Song Catalog "in Playlist number"
    // I can either update the field, which I alr have. Will go with this

    // Or just find all the number of playlists with that song._id. ->
    // Issue: might be costly cuz I would need to run a findSongInAllPlaylists function on all songs

    await storeRequestSender.updateInPlaylistsNumber(song._id, "add");

    if (response.data.success) {
      await store.loadUserPlaylists();
    }
  };

  // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
  // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
  store.createSong = function (index, song) {
    let list = store.currentList;
    list.songs.splice(index, 0, song);

    // Increment inPlaylists counter if song has catalogSongId
    if (song.catalogSongId) {
      async function incrementInPlaylists() {
        await storeRequestSender.updateInPlaylistsNumber(
          song.catalogSongId,
          "add"
        );
      }
      incrementInPlaylists();
    }

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
  // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
  store.moveSong = function (start, end) {
    let list = store.currentList;

    // WE NEED TO UPDATE THE STATE FOR THE APP
    if (start < end) {
      let temp = list.songs[start];
      for (let i = start; i < end; i++) {
        list.songs[i] = list.songs[i + 1];
      }
      list.songs[end] = temp;
    } else if (start > end) {
      let temp = list.songs[start];
      for (let i = start; i > end; i--) {
        list.songs[i] = list.songs[i - 1];
      }
      list.songs[end] = temp;
    }

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
  // FROM THE CURRENT LIST
  store.removeSong = function (index) {
    let list = store.currentList;
    const song = list.songs[index];
    const catalogSongId = song.catalogSongId;

    list.songs.splice(index, 1);

    // Need to decrement the InPlaylist for it.
    if (catalogSongId) {
      async function decrementInPlaylists() {
        await storeRequestSender.updateInPlaylistsNumber(
          catalogSongId,
          "remove"
        );
      }
      decrementInPlaylists();
    }

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
  store.updateSong = function (index, songData) {
    let list = store.currentList;
    let song = list.songs[index];
    song.title = songData.title;
    song.artist = songData.artist;
    song.year = songData.year;
    song.youTubeId = songData.youTubeId;

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  store.addNewSong = () => {
    let playlistSize = store.getPlaylistSize();
    store.addCreateSongTransaction(
      playlistSize,
      "Untitled",
      "?",
      new Date().getFullYear(),
      "dQw4w9WgXcQ"
    );
  };
  // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
  store.addCreateSongTransaction = (index, title, artist, year, youTubeId) => {
    // ADD A SONG ITEM AND ITS NUMBER
    let song = {
      title: title,
      artist: artist,
      year: year,
      youTubeId: youTubeId,
    };
    let transaction = new CreateSong_Transaction(store, index, song);
    tps.processTransaction(transaction);
  };
  store.addMoveSongTransaction = function (start, end) {
    let transaction = new MoveSong_Transaction(store, start, end);
    tps.processTransaction(transaction);
  };
  // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
  store.addRemoveSongTransaction = (song, index) => {
    //let index = store.currentSongIndex;
    //let song = store.currentList.songs[index];
    let transaction = new RemoveSong_Transaction(store, index, song);
    tps.processTransaction(transaction);
  };
  // THIS FUNCTION ADDS A CopySong_Transaction TO THE TRANSACTION STACK
  store.addCopySongTransaction = (index) => {
    let userEmail = auth.user.email;

    let song = store.currentList.songs[index];
    // Create a copy of the song
    let copiedSong = {
      title: song.title + " (Copy)",
      artist: song.artist,
      year: song.year,
      youTubeId: song.youTubeId,
      ownerEmail: userEmail,
      catalogSongId: null, // Will be set when modal closes
      needsCatalogCreation: true, // Flag to indicate this needs catalog creation
    };
    let transaction = new CopySong_Transaction(store, index, copiedSong);
    tps.processTransaction(transaction);
  };
  store.addUpdateSongTransaction = function (index, newSongData) {
    let song = store.currentList.songs[index];
    let oldSongData = {
      title: song.title,
      artist: song.artist,
      year: song.year,
      youTubeId: song.youTubeId,
    };
    let transaction = new UpdateSong_Transaction(
      this,
      index,
      oldSongData,
      newSongData
    );
    tps.processTransaction(transaction);
  };
  store.updateCurrentList = function () {
    async function asyncUpdateCurrentList() {
      const response = await storeRequestSender.updatePlaylistById(
        store.currentList._id,
        store.currentList
      );
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: store.currentList,
        });
      }
    }
    asyncUpdateCurrentList();
  };
  store.undo = function () {
    tps.undoTransaction();
  };
  store.redo = function () {
    tps.doTransaction();
  };
  store.canAddNewSong = function () {
    return store.currentList !== null;
  };
  store.canUndo = function () {
    return store.currentList !== null && tps.hasTransactionToUndo();
  };
  store.canRedo = function () {
    return store.currentList !== null && tps.hasTransactionToDo();
  };
  store.canClose = function () {
    return store.currentList !== null;
  };

  // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
  store.setIsListNameEditActive = function () {
    storeReducer({
      type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
      payload: null,
    });
  };

  // NEW STORE FUNCTIONS I IMPLEMENTED

  // Song Functions

  store.getSongByUser = async () => {
    let response = await storeRequestSender.getSongPairs();

    if (response.data.success) {
      console.log("Response Success");
      let songs = response.data.songlist;
      console.log(songs);
      storeReducer({
        type: GlobalStoreActionType.LOAD_USER_SONGS,
        payload: songs,
      });
      console.log("Songlist From Store", store.songlist);
    } else {
      console.log("Failed to Get user songs");
    }
  };

  store.addSongToCatalog = async (songToAdd) => {
    try {
      let response = await storeRequestSender.createSong(songToAdd);

      if (response.data.success) {
        // Refetch the Songs from the DB
        store.getSongByUser();

        // close the modal
        store.hideModals();
      }
    } catch (error) {
      console.error("Error adding song to catalog:", error);
    }
  };

  store.updateCatalogSong = async (songId, updatedSongData) => {
    try {
      // updates song in song catalog
      let response = await storeRequestSender.updateSongById(
        songId,
        updatedSongData
      );
      if (response.data.success) {
        // updates song in the playlists
        //find all playlists that contain the songs and update it as well
        await storeRequestSender.updateSongInAllPlaylists({
          catalogSongId: songId,
          title: updatedSongData.title,
          artist: updatedSongData.artist,
          year: updatedSongData.year,
          youTubeId: updatedSongData.youTubeId,
        });

        // reload the user songs
        store.getSongByUser();
      }
    } catch (error) {
      console.error("Error updating catalog song:", error);
    }
  };

  store.findSongsByFilter = async (filters) => {
    const params = new URLSearchParams(filters);
    console.log("Song Search Params:", params);
    let response = await storeRequestSender.findSongsByFilter(params);
    if (response.data.success) {
      console.log("Success! Found songs: ", response.data.songs);
      return response.data.songs;
    } else {
      console.log("No Songs Found!");
      return [];
    }
  };

  // FUNCTION to FIND ALL PLAYLISTS based on the FILTERS
  store.findPlaylistsByFilter = async (filters) => {
    // Sanitize and use only filters that are nonempty
    console.log("Filters:", filters);

    const params = new URLSearchParams(filters);
    console.log("Params:", params);
    let response = await storeRequestSender.findPlaylistsByFilter(params);

    if (response.data.success) {
      console.log("Success! Found playlists:", response.data.playlists);
      return response.data.playlists;
    } else {
      console.log("No playlists found");
      return [];
    }
  };

  // CHeck if Edit Playlist Modal is Open
  store.isEditPlaylistModalOpen = () => {
    return store.currentModal === CurrentModal.EDIT_PLAYLIST;
  };

  store.showEditPlaylistModal = (playlist) => {
    storeReducer({
      type: GlobalStoreActionType.EDIT_PLAYLIST,
      payload: playlist,
    });
  };

  // Youtube Functions

  store.nextSong = () => {
    let nextIndex = store.currentSongIndex + 1;
    storeReducer({
      type: GlobalStoreActionType.SET_CURRENT_SONG_INDEX,
      payload: nextIndex,
    });
  };

  store.prevSong = () => {
    let prevIndex = store.currentSongIndex - 1;
    storeReducer({
      type: GlobalStoreActionType.SET_CURRENT_SONG_INDEX,
      payload: prevIndex,
    });
  };

  store.setCurrentSong = (index) => {
    storeReducer({
      type: GlobalStoreActionType.SET_CURRENT_SONG_INDEX,
      payload: index,
    });
  };

  // Increment the listener count for a song in the catalog
  store.updateSongListeners = async (catalogSongId) => {
    if (catalogSongId) {
      await storeRequestSender.updateSongListeners(catalogSongId);
      // Optionally refresh the song catalog to show updated count
      await store.getSongByUser();
    }
  };

  function KeyPress(event) {
    if (!store.modalOpen && event.ctrlKey) {
      if (event.key === "z") {
        store.undo();
      }
      if (event.key === "y") {
        store.redo();
      }
    }
  }

  // Removing a Song from Catalog
  store.markSongForDeletion = async (id, song) => {
    storeReducer({
      type: GlobalStoreActionType.MARK_SONG_FOR_DELETION,
      payload: { id: id, song: song },
    });
  };

  // This is for Deleting a Song from Catalog
  store.deleteSong = function (id) {
    async function processDelete(id) {
      let response = await storeRequestSender.deleteSongById(id);
      if (response.data.success) {
        // find all playlists that have the songs and delete it
        await storeRequestSender.removeSongFromAllPlaylists(id);

        store.getSongByUser();
      }
    }
    processDelete(id);
  };
  store.deleteMarkedSong = function () {
    store.deleteSong(store.songIdMarkedForDeletion);
    store.hideModals();
  };

  document.onkeydown = (event) => KeyPress(event);

  return (
    <GlobalStoreContext.Provider
      value={{
        store,
      }}
    >
      {props.children}
    </GlobalStoreContext.Provider>
  );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
