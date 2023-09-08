import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import auth from "./routes/auth.js";
import userRouter from "./routes/users.js";
import transactionRouter from "./routes/transactions.js";

const PORT = process.env.APP_PORT || 3001;
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", auth);
app.use("/api/users", userRouter);
app.use("/api/transactions", transactionRouter);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})