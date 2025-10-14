import db from "../models/index.js";
import jwt from 'jsonwebtoken';


export const authenticate = async (req,res, next) => {
    try{
        const bearerToken = req.headers.authorization?.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1] : null;

        const token = bearerToken || req.cookies?.token;
        if(!token) {
            return res.status(401).json({message : "Authetication required !"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await db.User.findByPk(decoded.id);

        if(!user) return res.status(404).json({message : "User no longer exist!"});

        req.user = {   
            id: user.id, 
            role: user.role, 
            name: user.name,
            email: user.email,
            is_verified: user.is_verified,
            phone: user.phone || null,                       
            address: user.address || null,    
            profile_picture: user.profile_picture || ''
}       ; 
        next();

        console.log(req.user);
    }  
    catch(error){
        return res.status(500).json({message : error.message});
    }
} 