import express, { json } from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
morgan.token("content", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);

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

app.get("/info", (req, res) => {
  const date = new Date();
  const response = `<p>Phonebook has info for ${phonebook.length} people</p><p>${date}</p>`;
  res.send(response);
});

app.get("/api/persons", (req, res) => {
  res.json(phonebook);
});

app.get("/api/persons/:id", (req, res) => {
  const person = phonebook.find((contact) => `${contact.id}` === req.params.id);
  person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  phonebook = phonebook.filter((contact) => `${contact.id}` !== req.params.id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name || !req.body.number) {
    res.status(400).json({ error: "Name or Number are missing" });
  } else if (
    phonebook.some(
      (contact) =>
        contact.name === req.body.name || contact.number === req.body.number
    )
  ) {
    res.status(400).json({ error: "This contact already exist" });
  } else {
    const newContact = {
      id: Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)),
      name: req.body.name,
      number: req.body.number,
    };
    phonebook = phonebook.concat(newContact);
    res.send(newContact);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
