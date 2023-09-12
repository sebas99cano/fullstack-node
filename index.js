const express = require("express");
const logger = require("./loggerMiddleware");
const app = express();

app.use(express.json());

app.use(logger);

let notes = [
  { id: 1, content: "hola al numero 1" },
  { id: 2, content: "hola al numero 2" },
  { id: 3, content: "hola al numero 3" },
];

app.get("/", (request, response) => {
  response.send("<h1>Hola mundo</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id == id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id != id);
  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note || !note.content) {
    return response
      .status(400)
      .json({
        error: "note.content is missing",
      })
      .end();
  }

  const ids = notes.map((note) => note.id);
  const maxId = Math.max(...ids);

  const newNote = {
    id: maxId + 1,
    content: note.content,
    date: new Date().toISOString(),
  };

  notes = [...notes, newNote];

  response.status(201).json(newNote);
});

app.use((request, response) => {
  response.status(404).json({
    error: "Not found",
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
