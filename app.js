import express from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.APP_PORT || 3001;
const app = express();

app.use(express.json());

//...

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})