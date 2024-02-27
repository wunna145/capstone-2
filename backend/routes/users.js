"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

router.get("/:username", async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:username", async function (req, res, next) {
  try {
    console.log("!!!!!!!!!!!!!HBKLBBIY!!!!!!!!", req.body, userUpdateSchema);
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:username", async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

router.get("/:username/playlists/", async function (req, res, next) {
  try {
    const playlist = await User.getPlaylist(req.params.username);
    return res.json({ playlist });
  } catch (err) {
    return next(err);
  }
});

router.post("/:username/playlists/:song_id", async function (req, res, next) {
  try {
    const songId = req.params.song_id;
    await User.createPlaylist(req.params.username, songId);
    return res.json({ playlist_created: songId });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:username/playlists/:song_id", async function (req, res, next) {
  try {
    const songId = req.params.song_id;
    await User.deletePlaylist(req.params.username, songId);
    return res.json({ playlist_deleted: songId });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
