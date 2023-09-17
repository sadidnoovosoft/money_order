import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
    const token = req.cookies["access_token"];
    if (!token) {
        if (req.path === "/dashboard") {
            return res.redirect("/login.html");
        }
        return res.status(401).json({message: "Unauthorized Access!"});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err || (payload.role !== 'admin' && payload.role !== 'customer')) {
            res.clearCookie("access_token");
            if (req.path === "/dashboard") {
                return res.redirect("/login.html");
            }
            return res.status(401).json({message: "Unauthorized Access!"});
        }
        req.user = {
            username: payload.username,
            email: payload.email,
            role: payload.role,
        }
        next();
    })
}

export default checkAuth;