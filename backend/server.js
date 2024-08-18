const express = require("express");
const { connectDatabase } = require("./databaseConnection/databaseConnection");

require("dotenv").config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening at port ${PORT}`);
    });
  })
  .catch((e) => {
    console.log("database connection error:-", e);
    return {
      error: true,
      details: e,
    };
  });
