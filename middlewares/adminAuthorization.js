const adminAuthorization = (req, res, next) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({message: "Unauthorized Access!"});
    }
    next();
}

export default adminAuthorization;