"use strict";

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const albumSearchSchema = require("../schemas/albumSearch.json");
const Album = require("../models/album");

const router = new express.Router();

router.get("/", async function (req, res, next) {
console.log('Reached the / route');
  const q = req.query;

  try {
    const validator = jsonschema.validate(q, albumSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const albums = await Album.findAll(q);
    return res.json({ albums });
  } catch (err) {
    return next(err);
  }
});

router.get("/:artistName/:albumName", async function (req, res, next) {
  try {
    const artistName = req.params.artistName.replace(/_/g, ' ');
    const albumName = req.params.albumName.replace(/_/g, ' ');
    // Log artistName and albumName
    const album = await Album.get(artistName, albumName);
    return res.json({ album });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
