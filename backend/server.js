const express = require("express");
const { connectDatabase } = require("./databaseConnection/databaseConnection");
const { router } = require("./authrouter/authrouter");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use("/", router);
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
