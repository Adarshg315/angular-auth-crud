import express from "express";
import api from "./routes/api.mjs";

const port = 4000;
const app = express();

import connectDB from "/home/adarsh/angular-projects/task-app/server/config/dbconfig.mjs";
connectDB();

app.use(express.json());
app.use("/api", api);

app.listen(4000, () => {
  console.log(`server started at port ${port}`);
});
