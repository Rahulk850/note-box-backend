const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const Note = require("../models/Note");
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

// fetch all notes using GET api/notes/fetchallnotes user no login is required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});
// add notes using POST api/notes/addnotes user no login is required
router.post(
  "/addnotes",
  fetchUser,
  [
    body("title"),
    body("description"),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body; // destructuring
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // if therer are no any errors then we makes a new notes
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  }
);
//////////////////////////////////////////////////////
// Updation of notes by GET api/notes/udatenotes
router.post("/updatenotes/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};

    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    // find the note to be updated and update it

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(400).send("Not found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(400).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

///////////////////////////////////////////

// Deletion of notes by DELETE api/notes/deletenotes
router.delete("/deletenotes/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  // find the note to be updated and update it

  let note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(400).send("Not found");
  }

  if (note.user.toString() !== req.user.id) {
    return res.status(400).send("Not Allowed");
  }

  note = await Note.findByIdAndDelete(req.params.id);
  res.json({ Success: "note has been deleted", note: note });
});

module.exports = router;
