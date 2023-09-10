import express from "express";
import cookieParser from "cookie-parser";

import auth from "./routes/auth.js";
import userRouter from "./routes/users.js";
import transactionRouter from "./routes/transactions.js";

const PORT = process.env.APP_PORT;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// API routes
const apiRouter = express.Router();
app.use("/api", apiRouter);

apiRouter.use("/auth", auth);
apiRouter.use("/users", userRouter);
apiRouter.use("/transactions", transactionRouter);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})