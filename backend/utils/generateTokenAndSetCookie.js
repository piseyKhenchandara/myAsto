import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res,userId, userRole) => {

    if (!process.env.JWT_SECRET) {
        throw new Error(" JWT_SECRET is missing from environment variables (.env)");
    }

    //  Defensive check for missing userId
    if (!userId) {
        throw new Error(" Cannot generate token: userId is missing or invalid");
    }

    const token = jwt.sign(
        {
            id : userId,
            role : userRole
        },
        process.env.JWT_SECRET,
        { expiresIn : "7d"}
    )
    res.cookie(
        "token", 
        token, 
        {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : "lax",
            maxAge : 7 *24 *60 *60 *1000
    })
    return token;

}