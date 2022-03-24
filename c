[33mcommit 45c1fef94072bcafab2b0f0d148a5c4ea6322fd7[m[33m ([m[1;36mHEAD -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m)[m
Author: Amit <amit.b.gabay@gmail.com>
Date:   Fri Mar 18 16:19:20 2022 +0200

    switch promise to async/await and add alerts

[1mdiff --git a/app.js b/app.js[m
[1mindex da8dc8a..d7d4c94 100644[m
[1m--- a/app.js[m
[1m+++ b/app.js[m
[36m@@ -15,14 +15,15 @@[m [mapp.use(cors({ origin: "http://localhost:3000" }));[m
 app[m
   .post("/register", async (req, res) => {[m
     const { mode, email, password } = req.body;[m
[31m-    if (mode === "Login") {[m
[31m-      User.findOne({ email }, (err, doc) => {[m
[31m-        if (doc.password === password) {[m
[31m-          res.status(201).send({ userId: doc._id });[m
[31m-        } else {[m
[31m-          res.sendStatus(403);[m
[31m-        }[m
[31m-      });[m
[32m+[m[32m    const doc = await User.findOne({ email });[m
[32m+[m[32m    if (doc && mode === "Login") {[m
[32m+[m[32m      if (doc.password === password) {[m
[32m+[m[32m        res.status(201).send({ userId: doc._id });[m
[32m+[m[32m      } else {[m
[32m+[m[32m        res.sendStatus(403);[m
[32m+[m[32m      }[m
[32m+[m[32m    } else if (doc) {[m
[32m+[m[32m      res.sendStatus(409);[m
     } else {[m
       const user = new User({ email, password });[m
       try {[m
[36m@@ -33,21 +34,20 @@[m [mapp[m
       }[m
     }[m
   })[m
[31m-  .post("/pokemons", (req, res) => {[m
[32m+[m[32m  .post("/pokemons", async (req, res) => {[m
     const userId = req.body.userId;[m
     const pokemons = req.body.pokemons;[m
[31m-    User.findByIdAndUpdate([m
[32m+[m[32m    const doc = await User.findByIdAndUpdate([m
       userId,[m
       { pokemons: pokemons },[m
[31m-      { new: true },[m
[31m-      (err, doc) => {[m
[31m-        res.status(200).send(doc.pokemons);[m
[31m-      }[m
[32m+[m[32m      { new: true }[m
     );[m
[32m+[m[32m    res.status(200).send(doc.pokemons);[m
   })[m
[31m-  .get("/pokemons", (req, res) => {[m
[32m+[m[32m  .get("/pokemons", async (req, res) => {[m
     const { userId } = req.query;[m
[31m-    User.findById(userId, (err, doc) => res.send(doc.pokemons));[m
[32m+[m[32m    const doc = await User.findById(userId);[m
[32m+[m[32m    res.send(doc.pokemons);[m
   });[m
 [m
 app.listen(port, function () {[m
