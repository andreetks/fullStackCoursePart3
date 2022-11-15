import express, { response } from "express";
const app = express();

const phonebook = [
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
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
