import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./db.js";
import User from "./models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const { PORT = 5000, KEY = "keyboard cat" } = process.env;

connectDB();

app.use(bodyParser.json());

app.use(
  cors({ origin: ["https://pokemon-act.pages.dev", "http://localhost:3000"] })
);

const saltRounds = 10;

app
  .post("/register", async (req, res) => {
    const { mode, email, password } = req.body;
    const doc = await User.findOne({ email });
    if (doc && mode === "Login") {
      bcrypt.compare(password, doc.password).then(function (result) {
        if (result) {
          const token = jwt.sign({ userId: doc._id }, KEY, {
            expiresIn: 6000,
          });
          doc.token = token;
          doc.save();
          res.status(201).send({ token });
        } else {
          res.sendStatus(403);
        }
      });
    } else if (doc) {
      res.sendStatus(409);
    } else {
      const hash = await bcrypt.hash(password, saltRounds);
      const user = new User({ email, password: hash });
      try {
        const token = jwt.sign({ userId: user._id }, KEY, {
          expiresIn: 60,
        });
        user.token = token;
        await user.save();
        res.status(201).send({ token });
      } catch (err) {
        res.sendStatus(500);
      }
    }
  })
  .get("/pokemons", async (req, res) => {
    const { userId } = jwt.verify(req.headers.authorization, KEY);
    const doc = await User.findById(userId);
    res.send(doc.pokemons);
  })
  .post("/pokemons", async (req, res) => {
    const { userId } = jwt.verify(req.headers.authorization, KEY);
    const pokemons = req.body.pokemons;
    const doc = await User.findByIdAndUpdate(
      userId,
      { pokemons: pokemons },
      { new: true }
    );
    res.status(200).send(doc.pokemons);
  });

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});
