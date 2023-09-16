require("dotenv").config();
require("./mongo");
const express = require("express");
const cors = require("cors");
const logger = require("./loggerMiddleware");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");
const usersRouter = require("./controllers/users");
const notesRouter = require("./controllers/notes");
const loginRouter = require("./controllers/login");

const app = express();
app.use(express.json());
app.use(cors());
app.use(logger);

app.get("/", (request, response) => {
  response.send("<h1>Bienvenido a mi servidor de node js</h1>");
});

app.use("/api/login", loginRouter);

app.use("/api/notes", notesRouter);

app.use("/api/users", usersRouter);

app.use(notFound);

app.use(handleErrors);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
