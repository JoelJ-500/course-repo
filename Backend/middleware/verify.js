import { pool } from "../config/db.js";
import { SECRET_ACCESS_TOKEN } from "../config/index.js";
import jwt from "jsonwebtoken";

export async function Verify(req, res, next) {
    try {
        const authHeader = req.headers["cookie"];
        if (!authHeader) return res.sendStatus(401);
        
        const cookie = authHeader.split("=")[1];

        jwt.verify(cookie, SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                return res
                    .status(401)
                    .json({ message: "This session has expired. Please login" })
            }

            const { id } = decoded;

            const [users] = await pool.execute(
                `SELECT user_id, username, created_at FROM Users WHERE user_id = '${id}'` 
            );

            if (users.length === 0) {
                return res.status(401).json({ message: "User no longer exists" });
            }

            req.user = users[0];

            next();
        });
    } catch (err) {
        console.error("Verification Error:", err);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal Server Error",
        });   
    }
}