const customerAuthorization = (req, res, next) => {
    if(req.user.role !== 'customer') {
        return res.redirect("/login.html");
    }
    next();
}

export default customerAuthorization;