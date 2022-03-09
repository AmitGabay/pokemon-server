import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  userName: String,
  pokemons: [{ id: Number, name: String }],
});

module.exports = mongoose.modal("User", userSchema);
