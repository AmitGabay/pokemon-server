import mongoose from "mongoose";

const url = `mongodb+srv://Amit:a1M9i9T5@cluster0.0jtxb.mongodb.net/pokemonUsers?retryWrites=true&w=majority`;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = () => {
  mongoose
    .connect(url, connectionParams)
    .then(() => {
      console.log("Connected to database ");
    })
    .catch((err) => {
      console.error(`Error connecting to the database. \n${err}`);
    });
};

export default connectDB;
