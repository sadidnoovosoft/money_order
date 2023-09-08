import express from "express";
import pool from "../connection.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.use(checkAuth);

router.get("/customers", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, username, role FROM users WHERE role=($1)",
            ["customer"]
        );
        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).send(error);
    }
})

export default router;