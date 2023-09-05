import express from "express";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());

//...

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})