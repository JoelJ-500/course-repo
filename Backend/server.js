import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "./config/index.js";
import { initDB } from "./config/db.js";
import Router from "./routes/index.js";

const server = express();

//You dont really know what port the frontend will be run from in testing so dynamically set it as long as it starts with localhost
const corsOptions = {
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);

    // 2. Allow any localhost or 127.0.0.1 origin with any port
    const localRegex = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
    
    if (localRegex.test(origin)) {
      callback(null, true);
    } else {
      // 3. For production, you'd add your real domain check here
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Required for cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

server.use(cors(corsOptions));
server.disable("x-powered-by");
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

const startServer = async() => {
    await initDB();

    console.log("Database initialized");

    //attempt to prevent caching which causes errors with logout
    server.use((req, res, next) => {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        next();
    });

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