import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./db.js";
import User from "./models/user.js";

const app = express();
const port = 5000;

connectDB();

app.use(bodyParser.json());

app.use(
  cors({ origin: ["https://pokemon-act.pages.dev", "http://localhost:3000"] })
);

app
  .post("/register", async (req, res) => {
    const { mode, email, password } = req.body;
    const doc = await User.findOne({ email });
    if (doc && mode === "Login") {
      if (doc.password === password) {
        res.status(201).send({ userId: doc._id });
      } else {
        res.sendStatus(403);
      }
    } else if (doc) {
      res.sendStatus(409);
    } else {
      const user = new User({ email, password });
      try {
        const savedUser = await user.save();
        res.status(201).send({ userId: savedUser._id });
      } catch {
        res.sendStatus(500);
      }
    }
  })
  .post("/pokemons", async (req, res) => {
    const userId = req.body.userId;
    const pokemons = req.body.pokemons;
    const doc = await User.findByIdAndUpdate(
      userId,
      { pokemons: pokemons },
      { new: true }
    );
    res.status(200).send(doc.pokemons);
  })
  .get("/pokemons", async (req, res) => {
    const { userId } = req.query;
    const doc = await User.findById(userId);
    res.send(doc.pokemons);
  });

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
