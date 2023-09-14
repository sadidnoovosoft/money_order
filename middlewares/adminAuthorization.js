const adminAuthorization = (req, res, next) => {
    if(req.user.role !== 'admin') {
        return res.redirect("/login.html");
    }
    next();
}

export default adminAuthorization;