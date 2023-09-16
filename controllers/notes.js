const notesRouter = require("express").Router();
const Note = require("../models/Note");
const User = require("../models/User");

notesRouter.get("/", (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

notesRouter.get("/:id", (request, response, next) => {
  const { id } = request.params;
  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

notesRouter.delete("/:id", (request, response, next) => {
  const { id } = request.params;
  Note.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

notesRouter.post("/", async (request, response, next) => {
  const { content, important = false, userId } = request.body;
  const user = await User.findById(userId);

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id,
  });

  try {
    const savedNote = await newNote.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();
    response.json(savedNote);
  } catch (error) {
    next(error);
  }
});

notesRouter.put("/:id", (request, response, next) => {
  const { id } = request.params;
  const note = request.body;
  const newNoteInfo = {
    content: note.content,
    important: note.important,
  };
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((updateNote) => {
      response.json(updateNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
