import express, { Express, Request, Response } from "express";
import * as dontenv from "dotenv"
import cors from "cors";
import userRouter from "./routes/user";
import { connectDB } from "./config/dbConnection";

dontenv.config()

connectDB();

const app: Express = express()

const port = process.env.port || 5000

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

//Middleware
app.use(cors());
app.use(express.json());

app.use("/api/user", userRouter);
