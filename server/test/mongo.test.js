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

// Creating this user beforehand - setting the variables first
let existingUserId;
let existingUserEmail = "read@gmail.com";
let db;

beforeAll(async () => {
  // Initialize the database manager
  db = new MongoDBManager();

  // Create a user that will exist for tests
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

// ----------------------------------------------------------------------------
// Testing CRUD on User
test("Test #1) User CRUD (Create + Read + Update + Delete)", async () => {
  const testUser = {
    firstName: "Create",
    lastName: "Test",
    email: "create@gmail.com",
    password: "password123",
  };

  // CREATE: Create the user using DatabaseManager
  const createResult = await db.registerUser(
    testUser.firstName,
    testUser.lastName,
    testUser.email,
    testUser.password
  );
  const userId = createResult.user._id;

  expect(createResult.success).toBe(true);
  expect(createResult.user.firstName).toBe("Create");
  expect(createResult.user.lastName).toBe("Test");
  expect(createResult.user.email).toBe("create@gmail.com");

  // READ: Read the user back
  const readResult = await db.getLoggedIn(userId);

  expect(readResult.success).toBe(true);
  expect(readResult.user.firstName).toBe(testUser.firstName);
  expect(readResult.user.lastName).toBe(testUser.lastName);
  expect(readResult.user.email).toBe(testUser.email);

  // UPDATE: Update the user's information
  const updateData = {
    firstName: "Updated",
    lastName: "User",
  };
  const updateResult = await db.updateUser(userId, updateData);

  expect(updateResult.success).toBe(true);
  expect(updateResult.user.firstName).toBe("Updated");
  expect(updateResult.user.lastName).toBe("User");

  // DELETE: Delete the user
  const deleteResult = await db.deleteUser(userId);
  expect(deleteResult.success).toBe(true);

  // Verify deletion
  const verifyDelete = await db.getLoggedIn(userId);
  expect(verifyDelete.success).toBe(false);
});



/**
 * Test User Authentication operations
 */
test("Test #2) User Authentication (Login + Failed Login + Duplicate Registration)", async () => {
  // Test successful login
  const loginResult = await db.loginUser(existingUserEmail, "password123");

  expect(loginResult.success).toBe(true);
  expect(loginResult.user).toBeDefined();
  expect(loginResult.user.email).toBe(existingUserEmail);
  expect(loginResult.user.firstName).toBe("Read");
  expect(loginResult.user.lastName).toBe("Test");

  // Test failed login with wrong password
  const failedLogin = await db.loginUser(existingUserEmail, "wrongpassword");

  expect(failedLogin.success).toBe(false);
  expect(failedLogin.error).toBeDefined();

  // Test duplicate user registration
  const duplicateUser = await db.registerUser(
    "Duplicate",
    "User",
    existingUserEmail,
    "password123"
  );

  expect(duplicateUser.success).toBe(false);
  expect(duplicateUser.error).toBeDefined();
});

test("Test #3) Playlist CRUD (Create + Read + Update + Delete)", async () => {

    // CREATE: Create a playlist
    const newPlaylist = {
        name: "TestPlaylist",
        ownerEmail: existingUserEmail,
        songs: [],
        // NumListeners will be added by default
    }

    const createResult = await db.createPlaylist(existingUserId, newPlaylist);

    // Get playlist ID for later CRUD
    let playlistId = createResult.playlist._id;

    expect(createResult.success).toBe(true);
    expect(createResult.playlist).toBeDefined();
    expect(createResult.playlist.name).toBe(newPlaylist.name);
    expect(createResult.playlist.ownerEmail).toBe(newPlaylist.ownerEmail);


    // READ: Read the playlist

    const readResult = await db.getPlaylistById(playlistId, existingUserId);

    expect(readResult.success).toBe(true);
    expect(readResult.playlist).toBeDefined();
    expect(readResult.playlist.name).toBe(newPlaylist.name);
    expect(readResult.playlist.ownerEmail).toBe(existingUserEmail);


    // UPDATE: Update the Playlist
    const updateBody = {
        playlist: {
            name: "Updated Name",
            songs: [],
        },
    };
    const updateResult = await db.updatePlaylist(playlistId, existingUserId, updateBody);

    expect(updateResult.success).toBe(true);
    expect(updateResult.id).toBeDefined();
    expect(updateResult.message).toBe("Playlist Updated!");

    // DELETE: Delete the playlist
    const deleteResult = await db.deletePlaylist(existingUserId, playlistId);

    expect(deleteResult.success).toBe(true);
    expect(deleteResult.playlist).toBeDefined();


    // Do a Check to See if the Playlist is Gone
    const checkDeleteResult = await db.getPlaylistById(playlistId, existingUserId);

    expect(checkDeleteResult.success).toBe(false);
    expect(checkDeleteResult.playlist).toBeUndefined();
})


