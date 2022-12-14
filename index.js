import express from "express";
import morgan from "morgan";
import cors from "cors";
import Person from "./models/person.js";

const app = express();

// Middlewares
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

// Endpoints

app.get("/info", (req, res, next) => {
  const date = new Date();
  Person.find({})
    .then((result) => {
      const response = `<p>Phonebook has info for ${result.length} people</p><p>${date}</p>`;
      res.send(response);
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((result) => {
      res.json(result.map((person) => person.toJSON()));
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.find({ _id: req.params.id })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(404).end();
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
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
  } else if( req.body.name.length < 3) {
    res.status(400).json({ error: "Name is too short."});
  } else {
    const newContact = new Person({
      name: req.body.name,
      number: req.body.number,
    });
    newContact
      .save()
      .then((response) => {
        res.json(response);
      })
      .catch((error) => next(error));
  }
});

app.put("/api/persons/:id", (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    res.status(400).json({ error: "Name or Number are missing" });
  } else {
    const updatedContact = new Person({
      name: req.body.name,
      number: req.body.number,
    });
    Person.findByIdAndUpdate(req.params.id, updatedContact)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => next(error));
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
