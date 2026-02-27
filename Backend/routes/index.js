import Auth from "./auth.js";
import Courses from "./courses.js";
import Files from "./files.js";

const Router = (server) => {
    server.use("/auth", Auth);

    server.use("/courses", Courses)

    server.use("/files", Files);

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
};

export default Router;