import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
    const token = req.cookies["access_token"];
    if (!token) {
        return res.status(401).json({"message": "No token found"});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({"message": "Invalid token"});
        }
        req.user = {
            username: payload.username
        }
        next();
    })
}

export default checkAuth;