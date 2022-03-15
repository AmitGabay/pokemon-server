import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./db.js";
import User from "./models/user.js";

const app = express();
const port = 5000;

connectDB();

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

app
  .post("/register", async (req, res) => {
    const { email, password } = req.body;
    const user = new User({ email, password });
    try {
      const savedUser = await user.save();
      res.status(201).send({ userId: savedUser._id });
    } catch {
      res.sendStatus(500);
    }
  })
  .post("/pokemons", (req, res) => {
    const userId = req.body.userId;
    const pokemons = req.body.pokemons;
    User.findByIdAndUpdate(
      userId,
      { pokemons: pokemons },
      { new: true },
      (err, doc) => {
        res.status(200).send(doc.pokemons);
      }
    );
  })
  .get("/pokemons", (req, res) => {
    const { userId } = req.query;
    User.findById(userId, (err, doc) => res.send(doc.pokemons));
  });

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
