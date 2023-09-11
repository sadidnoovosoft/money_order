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
                    (SELECT username FROM users WHERE id = t.from_id) AS from_name,
                    (SELECT username FROM users WHERE id = t.to_id)   AS to_name,
                    t.amount
             FROM transactions t
             ORDER BY t.transaction_date`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post("/", async (req, res) => {
    const {from_id, to_id, amount, type} = req.body;
    const client = await pool.connect();
    try {
        // Transaction
        await client.query('BEGIN');
        await client.query(
            "INSERT INTO transactions (type, from_id, to_id, amount) VALUES ($1, $2, $3, $4)",
            [type, from_id, to_id, amount]);
        await client.query('COMMIT');

        res.status(200).json({
            "status": "success", "message": "Transaction Completed!"
        })

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json(error);
    } finally {
        client.release();
    }
})

export default router;