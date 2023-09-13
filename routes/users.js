import express from "express";
import pool from "../config/connection.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.use(checkAuth);

router.get("/customers", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, username, email, role FROM users WHERE role=($1)",
            ["customer"]
        );
        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).send(error);
    }
})

router.get("/current", (req, res) => {
    res.json(req.user);
})

export default router;