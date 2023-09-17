const customerAuthorization = (req, res, next) => {
    if(req.user.role !== 'customer') {
        return res.status(403).json({message: "Unauthorized Access!"});
    }
    next();
}

export default customerAuthorization;