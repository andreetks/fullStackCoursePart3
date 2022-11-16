import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.MONGO_URL;

mongoose.connect(url);

const phonebookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, minLength: 3 },
    number: { type: String, unique: true },
  },
  { versionKey: false }
);

phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
  },
});

const Person = mongoose.model("PhoneBook", phonebookSchema);

export default Person;
