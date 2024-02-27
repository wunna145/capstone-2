"use strict";

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const songSearchSchema = require("../schemas/songSearch.json");
const Song = require("../models/song");

const router = new express.Router();

router.get("/", async function (req, res, next) {
  const q = req.query;

  try {
    const validator = jsonschema.validate(q, songSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const songs = await Song.findAll(q);
    return res.json({ songs });
  } catch (err) {
    return next(err);
  }
});

router.get("/:artistName/:songName", async function (req, res, next) {
  try {
    const artistName = req.params.artistName.replace(/_/g, ' ');
    const songName = req.params.songName.replace(/_/g, ' ');
    const song = await Song.get(artistName, songName);
    return res.json({ song });
  } catch (err) {
    return next(err);
  }
});

router.get("/:songId", async function (req, res, next) {
  try {
    const song = await Song.getById(req.params.songId);
    return res.json({ song });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
