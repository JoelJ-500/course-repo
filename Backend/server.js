import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "./config/index.js";
import { initDB } from "./config/db.js";
import Router from "./routes/index.js";

const server = express();

server.use(cors());
server.disable("x-powered-by");
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

const startServer = async() => {
    await initDB();

    console.log("Database initialized");

    Router(server);
    try {
        server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        throw err;
    }

}

startServer();