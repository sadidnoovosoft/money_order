import express from "express";
import pool from "../connection.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.use(checkAuth);

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT t.id, 
                t.type, 
                (SELECT username FROM users WHERE id=t.from) AS "from", 
                (SELECT username FROM users WHERE id=t.to) AS "to", 
                t.amount 
            FROM transactions t
            ORDER BY t.transaction_date`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json(error);
    }
})

export default router;