import Auth from "./auth.js";
import { Verify } from "../middleware/verify.js";

const Router = (server) => {
    server.use("/auth", Auth);

    server.get("/", (req, res) => {
        try {
            res.status(200).json({
                status: "success",
                data: [],
                message: "API is running",
            });
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            })
        }
    });

    server.get("/verify", Verify, (req, res) => {
        res.status(200).json({
            status: "success",
            message: "Session successfully verified"
        });
    });
};

export default Router;