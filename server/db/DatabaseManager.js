const mongoose = require("mongoose");
const dotenv = require("dotenv").config({ path: __dirname + "/../../.env" });
const Playlist = require("../models/playlist-model");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

class MongoDBManager {
  constructor() {
    this.connect();
  }

  // Connections
  async connect() {
    try {
      await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
    } catch (err) {
      console.error("MongoDB connection error", err);
    }
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  // Queries based on the store controller
  async createPlaylist(userId, data) {
    try {
      const playlist = new Playlist(data);
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return { success: false, error: "User not found" };
      }

      await user.playlists.push(playlist._id);
      await user.save();
      await playlist.save();

      return { success: true, playlist };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async deletePlaylist(userId, playlistId) {
    try {
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) {
        return { success: false, error: "Playlist not found" };
      }
      const user = await User.findOne({ email: playlist.ownerEmail });
      if (!user || user._id.toString() !== userId.toString()) {
        return { success: false, error: "Unauthorized" };
      }

      await Playlist.findOneAndDelete({ _id: playlistId });
      return { success: true, playlist };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async getPlaylistById(playlistId, userId) {
    try {
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) {
        return { success: false, error: "Playlist not found!" };
      }
      const user = await User.findOne({ email: playlist.ownerEmail });
      if (!user) {
        return { success: false, error: "User not Found!" };
      }

      // Check for authorization - convert both to strings for comparison
      if (user._id.toString() === userId.toString()) {
        return { success: true, playlist };
      } else {
        return { success: false, error: "Not authorized" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async getPlaylistPairs(userId) {
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return { success: false, error: "User not found!" };
      }
      const playlists = await Playlist.find({ ownerEmail: user.email });
      if (!playlists) {
        return { success: false, error: "Playlists not found!" };
      }
      const pairs = playlists.map((list) => ({
        _id: list._id,
        name: list.name,
      }));

      return { success: true, idNamePairs: pairs };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // no arguments b/c we are getting all the playlists
  async getPlaylists(userId) {
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return { success: false, error: "User not found" };
      }

      const playlists = await Playlist.find({ ownerEmail: user.email });
      if (!playlists.length) {
        return { success: false, error: "Playlists not found" };
      }
      return { success: true, playlists };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async updatePlaylist(playlistId, userId, body) {
    try {
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) {
        return { success: false, error: "Playlist not found!" };
      }

      const user = await User.findOne({ email: playlist.ownerEmail });
      if (!user) {
        return { success: false, error: "User not found!" };
      }

      //Check if user matches

      if (user._id.toString() === userId.toString()) {
        //implement the update
        playlist.name = body.playlist.name;
        playlist.songs = body.playlist.songs;

        await playlist.save();

        return {
          success: true,
          id: playlist._id,
          message: "Playlist Updated!",
        };
      } else {
        return { success: false, error: "User not authorized!" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Queries + operations based on Auth Controller

  async getLoggedIn(userId) {
    try {
      const loggedInUser = await User.findOne({ _id: userId });
      if (!loggedInUser) {
        return { success: false, error: "User not found" };
      }

      return {
        success: true,
        user: {
          firstName: loggedInUser.firstName,
          lastName: loggedInUser.lastName,
          email: loggedInUser.email,
        },
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async registerUser(firstName, lastName, email, password) {
    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return {
          success: false,
          error: "An account with this email address already exists.",
        };
      }

      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = new User({ firstName, lastName, email, passwordHash });
      const savedUser = await newUser.save();

      return {
        success: true,
        user: {
          _id: savedUser._id,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async loginUser(email, password) {
    try {
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
        return { success: false, error: "Wrong email or password provided." };
      }

      const passwordCorrect = await bcrypt.compare(
        password,
        existingUser.passwordHash
      );
      if (!passwordCorrect) {
        return { success: false, error: "Wrong email or password provided." };
      }

      return {
        success: true,
        user: {
          _id: existingUser._id,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async logoutUser() {}

  /*
    Functions I created to clean up after the vitest.
    */
  // Delete all users with the provided email addresses
  async deleteUsersByEmails(emails) {
    try {
      if (!Array.isArray(emails) || emails.length === 0) {
        return { success: false, error: "emails must be a non-empty array" };
      }

      const res = await User.deleteMany({ email: { $in: emails } });
      return { success: true, deletedCount: res.deletedCount };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Delete all playlists based on owner emails
  async deletePlaylistsByOwnerEmails(emails) {
    try {
      if (!Array.isArray(emails) || emails.length === 0) {
        return { success: false, error: "emails must be a non-empty array" };
      }

      const res = await Playlist.deleteMany({ ownerEmail: { $in: emails } });
      return { success: true, deletedCount: res.deletedCount };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

module.exports = MongoDBManager;
