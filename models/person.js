import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.MONGO_URL;

mongoose.connect(url);

const phonebookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, minLength: 3 },
    number: {
      type: String,
      unique: true,
      minLength: 8,
      validate: {
        validator: (value) => {
          let flag = true;
          if (
            value.split("-").length > 2 ||
            value.split("-")[0].length > 3 ||
            value.split("-")[0].length < 2 
          ) {
            flag = !flag;
          }
          return flag;
        },
        message: (props) => `${props.value} is not a valid phone number!`
      },
    },
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
