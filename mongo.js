import mongoose from "mongoose";

if (process.argv.length < 3) {
  console.log("Some fields are missing");
  process.exit(1);
} else if (process.argv.length === 4) {
  console.log("Phone number is missing");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://gonzalogarcia:${password}@cluster0.c9qrlrh.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const phonebookSchema = new mongoose.Schema(
  {
    name: String,
    number: String,
  },
  { versionKey: false }
);
const Person = mongoose.model("PhoneBook", phonebookSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
      mongoose.connection.close();
    });
  });
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  console.log(person);

  person.save().then((response) => {
    console.log(
      `Added "${process.argv[3]}" with number "${process.argv[4]}" to phone book`
    );
    mongoose.connection.close();
  });
}
