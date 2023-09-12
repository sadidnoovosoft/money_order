import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
    const token = req.cookies["access_token"];
    if (!token) {
        return res.redirect("/login.html");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            res.clearCookie("access_token");
            return res.redirect("/login.html");
        }
        req.user = {
            username: payload.username,
            email: payload.email
        }
        next();
    })
}

export default checkAuth;