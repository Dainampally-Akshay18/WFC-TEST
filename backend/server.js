import express from "express";
import mongoose from "mongoose";

const app = express();

const port = process.env.PORT || 5000;


app.use(express.json());


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.get("/", (req, res) => {
  res.send("Hello World");
  console.log("Local host is running on http://localhost:5000");
});