import { Router } from "express";

export function loadRoutes() {
    let router = Router();

    router.get("/", (req, res) => {
        res.send("Hello World!");
    });

    return router;
}
