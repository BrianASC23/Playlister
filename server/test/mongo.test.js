const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import {
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  expect,
  test,
} from "vitest";
const mongoose = require("mongoose");

const MongoDBManager = require("../db/DatabaseManager");

/**
 * Vitest test script for the Playlister app's Mongo Database Manager. Testing should verify that the Mongo Database Manager
 * will perform all necessarily operations properly.
 *
 * Scenarios we will test:
 *  1) Reading a User from the database
 *  2) Creating a User in the database
 *  3) ...
 *
 * You should add at least one test for each database interaction. In the real world of course we would do many varied
 * tests for each interaction.
 */

/**
 * Executed once before all tests are performed.
 */

// Creating this user before hand - setting the variables first
let existingUserId;
let existingUserEmail = "read@gmail.com";

let playlistId;
let db;

beforeAll(async () => {
  // Initialize the database manager
  db = new MongoDBManager();

  // Create a user that will exist for Test #1 to read
  const result = await db.registerUser(
    "Read",
    "Test",
    existingUserEmail,
    "password123"
  );
  existingUserId = result.user._id;
});

/**
 * Executed before each test is performed.
 */
beforeEach(() => {});

/**
 * Executed after each test is performed.
 */
afterEach(() => {});

/**
 * Executed once after all tests are performed.
 */
afterAll(async () => {
  // Clean up test data
  try {
    // Delete all playlists owned by test users
    await db.deletePlaylistsByOwnerEmails([
      "read@gmail.com",
      "create@gmail.com",
    ]);

    // Delete all test users
    await db.deleteUsersByEmails(["read@gmail.com", "create@gmail.com"]);

    // Close MongoDB connection
    await db.disconnect();
  } catch (error) {
    console.error("Error cleaning up test data:", error);
  }
});

/**
 * Vitest test to see if the Database Manager can get a User.
 */
test("Test #1) Reading a User from the Database", async () => {
  const expectedUser = {
    firstName: "Read",
    lastName: "Test",
    email: "read@gmail.com",
  };

  // Read the user using DatabaseManager
  const result = await db.getLoggedIn(existingUserId);

  // Compare the values
  expect(result.success).toBe(true);
  expect(result.user.firstName).toBe(expectedUser.firstName);
  expect(result.user.lastName).toBe(expectedUser.lastName);
  expect(result.user.email).toBe(expectedUser.email);
});

/**
 * Vitest test to see if the Database Manager can create a User
 */
test("Test #2) Creating a User in the Database", async () => {
  const testUser = {
    firstName: "Create",
    lastName: "Test",
    email: "create@gmail.com",
    password: "password123",
  };

  // Create the user using DatabaseManager
  const result = await db.registerUser(
    testUser.firstName,
    testUser.lastName,
    testUser.email,
    testUser.password
  );
  const userId = result.user._id;

  // Verify the user was created
  const expectedUser = {
    firstName: "Create",
    lastName: "Test",
    email: "create@gmail.com",
  };

  // Read the user back
  const getUserResult = await db.getLoggedIn(userId);

  // Compare values
  expect(result.success).toBe(true);
  expect(getUserResult.success).toBe(true);
  expect(getUserResult.user.firstName).toBe(expectedUser.firstName);
  expect(getUserResult.user.lastName).toBe(expectedUser.lastName);
  expect(getUserResult.user.email).toBe(expectedUser.email);
});

test("Test #3) Creating a Playlist in the Database", async () => {
  const testPlaylist = {
    name: "Test Playlist",
    ownerEmail: existingUserEmail,
    songs: [],
  };

  // Create playlist using DatabaseManager
  const result = await db.createPlaylist(existingUserId, testPlaylist);
  playlistId = result.playlist._id;

  expect(result.success).toBe(true);
  expect(result.playlist).toBeDefined();
  expect(result.playlist.name).toBe(testPlaylist.name);
  expect(result.playlist.ownerEmail).toBe(testPlaylist.ownerEmail);
});

test("Test #4) Reading a Playlist By Id in the Database", async () => {
  const testPlaylist = {
    name: "Read Test Playlist",
    ownerEmail: existingUserEmail,
    songs: [],
  };

  // Create playlist
  const createResult = await db.createPlaylist(existingUserId, testPlaylist);
  const testPlaylistId = createResult.playlist._id;

  // Read the playlist
  const result = await db.getPlaylistById(testPlaylistId, existingUserId);

  expect(result.success).toBe(true);
  expect(result.playlist).toBeDefined();
  expect(result.playlist.name).toBe("Read Test Playlist");
  expect(result.playlist.ownerEmail).toBe(existingUserEmail);
});

test("Test #5) Getting Playlist Pairs from the Database", async () => {
  // Get playlist pairs using DatabaseManager
  const result = await db.getPlaylistPairs(existingUserId);

  expect(result.success).toBe(true);
  expect(result.idNamePairs).toBeDefined();
  expect(Array.isArray(result.idNamePairs)).toBe(true);
  expect(result.idNamePairs.length).toBeGreaterThan(0);
});

test("Test #6) Getting All Playlists from the Database", async () => {
  // Get all playlists for the user using DatabaseManager
  const result = await db.getPlaylists(existingUserId);

  expect(result.success).toBe(true);
  expect(result.playlists).toBeDefined();
  expect(Array.isArray(result.playlists)).toBe(true);
  expect(result.playlists.length).toBeGreaterThan(0);
});

test("Test #7) Updating a Playlist in the Database", async () => {
  // Create a playlist to update
  const testPlaylist = {
    name: "Before Name",
    ownerEmail: existingUserEmail,
    songs: [],
  };

  const createResult = await db.createPlaylist(existingUserId, testPlaylist);
  const testPlaylistId = createResult.playlist._id;

  // Update the playlist using DatabaseManager
  const updateBody = {
    playlist: {
      name: "Updated Name",
      songs: [],
    },
  };

  const result = await db.updatePlaylist(
    testPlaylistId,
    existingUserId,
    updateBody
  );

  expect(result.success).toBe(true);
  expect(result.id).toBeDefined();
  expect(result.message).toBe("Playlist Updated!");
});

test("Test #8) Login User", async () => {
  // Login user using DatabaseManager
  const result = await db.loginUser(existingUserEmail, "password123");

  expect(result.success).toBe(true);
  expect(result.user).toBeDefined();
  expect(result.user.email).toBe(existingUserEmail);
  expect(result.user.firstName).toBe("Read");
  expect(result.user.lastName).toBe("Test");
});
