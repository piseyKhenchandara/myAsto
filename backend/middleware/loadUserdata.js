import db from "../models/index.js";


export const loadUserData = async (req, res, next) => {
    try {
        console.log('🔍 loadUserData BEFORE:', req.user);
        
        const user = await db.User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email','role', 'is_verified', 'phone', 'address', 'profile_picture']
        });

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        req.user = {
            ...req.user, 
            name: user.name,
            email: user.email,
            is_verified: user.is_verified,
            phone: user.phone || null,                       
            address: user.address || null,    
            profile_picture: user.profile_picture || ''
        };
        
        console.log('🔍 loadUserData AFTER:', req.user);
        next();

    } catch(error) {
        return res.status(500).json({message: error.message});
    }
};