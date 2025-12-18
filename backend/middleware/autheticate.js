export const authenticate = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization?.startsWith('Bearer')
            ? req.headers.authorization.split(' ')[1] : null;

        const token = bearerToken || req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Authentication required!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
      
        const user = await db.User.findByPk(decoded.id);
        
        if (!user) {
            return res.status(401).json({ message: "User not found!" });
        }

   
        req.user = {
            id: user.id,
            role: user.role,
            email: user.email
        };
        
        next();

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}