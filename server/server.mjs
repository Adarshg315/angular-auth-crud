import express from "express";
import api from "./routes/api.mjs";
import cors from "cors";
const port = 3000;
const app = express();

import connectDB from "/home/adarsh/angular-projects/project/server/config/dbconfig.mjs";
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api", api);

app.listen(port, () => {
	console.log(`server started at port ${port}`);
});
