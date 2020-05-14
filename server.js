require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const POKEDEX = require("./data/pokedex.json");

const app = express();
const PORT = 8000;

const validTypes = [
  `Bug`,
  `Dark`,
  `Dragon`,
  `Electric`,
  `Fairy`,
  `Fighting`,
  `Fire`,
  `Flying`,
  `Ghost`,
  `Grass`,
  `Ground`,
  `Ice`,
  `Normal`,
  `Poison`,
  `Psychic`,
  `Rock`,
  `Steel`,
  `Water`,
];

app.use(morgan("dev"));

app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get("Authorization");
  const apiToken = process.env.API_TOKEN;
  console.log("validate bearer token middleware");
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Gotta catch 'em all!");
});

function handleGetTypes(req, res) {
  res.json(validTypes);
}

app.get("/types", handleGetTypes);

function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;
  if (req.query.name) {
    response = response.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
    );
  }
  if (req.query.type) {
    response = response.filter((pokemon) =>
      pokemon.type.includes(req.query.type)
    );
  }
  res.json(response);
}

app.get("/pokemon", handleGetPokemon);

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
