import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import connectDB from "./db.js";

const app = express();
const port = 5000;

connectDB();

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

app
  .post("/pokemons", (req, res) => {
    const pokemon = req.body;
    const data = JSON.stringify(pokemon);

    fs.writeFile("pokemon.json", data, (err) => {
      if (err) throw err;
      console.log("Data written to file");
    });
    res.sendStatus(200);
  })
  .get("/pokemons", (req, res) => {
    fs.readFile("pokemon.json", (err, data) => {
      if (err) throw err;
      const pokemon = JSON.parse(data);
      res.json(pokemon);
    });
  });

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
