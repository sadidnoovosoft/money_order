import express from "express";
import path from "path";
import {fileURLToPath} from 'url';
import cookieParser from "cookie-parser";
import {config} from "dotenv";
config();

import auth from "./routes/auth.js";
import userRouter from "./routes/users.js";
import transactionRouter from "./routes/transactions.js";
import checkAuth from "./middlewares/checkAuth.js";

const PORT = process.env.APP_PORT;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Protected page
app.get("/dashboard", checkAuth, (req, res) => {
    const __filename = fileURLToPath(import.meta.url)
    res.sendFile(path.join(path.dirname(__filename), '/protected-pages/dashboard.html'));
})

// API routes
const apiRouter = express.Router();
app.use("/api", apiRouter);

apiRouter.use("/auth", auth);
apiRouter.use("/users", userRouter);
apiRouter.use("/transactions", transactionRouter);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})