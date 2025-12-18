import db from "../models/index.js";
import jwt, { decode } from 'jsonwebtoken';


export const authenticate = async (req,res, next) => {
    try{
        const bearerToken = req.headers.authorization?.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1] : null;

        const token = bearerToken || req.cookies?.token;
        if(!token) {
            return res.status(401).json({message : "Authetication required !"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
      

        req.user = {   
            id: decoded.id, 
            role: decoded.role, 
           
}       ; 
        next();


    }  
    catch(error){
        return res.status(500).json({message : error.message});
    }
} 