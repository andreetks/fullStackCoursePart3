import express from "express";
import morgan from "morgan";
import cors from "cors";
import Person from "./models/person.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
morgan.token("content", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.message.includes("ObjectId")) {
    return res.status(400).send({ error: "Malformed ID" });
  }
  next(error);
};
app.use(errorHandler);

var phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (req, res, next) => {
  const date = new Date();
  const response = `<p>Phonebook has info for ${phonebook.length} people</p><p>${date}</p>`;
  res.send(response);
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((result) => {
      res.json(result.map((person) => person.toJSON()));
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const person = phonebook.find((contact) => `${contact.id}` === req.params.id);
  person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res, next) => {
  phonebook = phonebook.filter((contact) => `${contact.id}` !== req.params.id);
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      console.log(result);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    res.status(400).json({ error: "Name or Number are missing" });
  } else {
    const newContact = new Person({
      name: req.body.name,
      number: req.body.number,
    });
    // phonebook = phonebook.concat(newContact);
    // res.send(newContact);
    newContact
      .save()
      .then((response) => {
        res.json(response);
      })
      .catch((error) => next(error));
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
