"use strict";

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const artistSearchSchema = require("../schemas/artistSearch.json");
const Artist = require("../models/artist");

const router = new express.Router();

router.get("/", async function (req, res, next) {
  console.log('Reached the / route');
  const q = req.query;

  try {
    const validator = jsonschema.validate(q, artistSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const artists = await Artist.findAll(q);
    return res.json({ artists });
  } catch (err) {
    return next(err);
  }
});

router.get("/:name", async function (req, res, next) {
  try {
    const artist = await Artist.get(req.params.name.replace(/_/g, ' '));
    return res.json({ artist });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
