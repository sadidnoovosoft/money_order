import express from "express";

import pool from "../config/connection.js";
import checkAuth from "../middlewares/checkAuth.js";
import customerAuthorization from "../middlewares/customerAuthorization.js";

const router = express.Router();

router.use([checkAuth, customerAuthorization]);

router.post("/", async (req, res) => {
    const {rows} = req.body;
    const rowCount = isNaN(rows) ? null : Number(rows);
    const {username} = req.user;

    try {
        const customerId = (await pool.query(
            `SELECT id
             FROM users
             WHERE username = ($1)`,
            [username]
        )).rows[0].id;

        if (rowCount) {
            await pool.query(
                `INSERT INTO jobs (receiver_id, row_count, type)
                 VALUES (($1), ($2), ($3))`,
                [customerId, rowCount, "email"]
            );
        } else {
            await pool.query(
                `INSERT INTO jobs (receiver_id, type)
                 VALUES (($1), ($2))`,
                [customerId, "email"]
            );
        }

        res.status(200).json({
            message: "Email added to queue!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.get("/", async (req, res) => {
    const {username, email} = req.user;
    try {
        const receiver_id = (await pool.query(
            `SELECT id
             FROM users
             WHERE username = ($1)`,
            [username]
        )).rows[0].id;

        const result = await pool.query(
            `SELECT id, ($1) as email, row_count, status, created_at
             FROM jobs
             WHERE receiver_id = ($2)
               AND type = ($3)
             ORDER BY created_at`,
            [email, receiver_id, "email"]
        );
        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json(error);
    }
})

router.patch("/:emailId", async (req, res) => {
    try {
        const {emailId} = req.params;
        let {rowCount} = req.body;
        if (isNaN(rowCount)) {
            rowCount = null;
        }

        const result = await pool.query(
            `UPDATE jobs
             set row_count = ($1)
             WHERE id = ($2)
               AND status = ($3)`,
            [rowCount, emailId, 'pending']
        );

        if (result.rowCount === 0) {
            res.json({message: "Email already processed!"})
        } else {
            res.json({message: "Row count updated!"})
        }
    } catch (error) {
        res.json(error);
    }
})

export default router;