import bcrypt from 'bcrypt'
import {generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js'
import { sendVerificationEmail } from '../mail/mailService/sendVerificationEmail.js';
import { generateCode } from '../mail/generateCode.js';
import db from '../models/index.js';
import { sendPasswordResetEmail } from '../mail/mailService/sendPasswordResetEmail.js';
import { sendWelcomeEmail } from '../mail/mailService/sendWelcomEmail.js';
import { sendResetSuccessEmail } from '../mail/mailService/sendResetSuccessEmail.js';
import cloudinary from '../config/cloudinary.js';
import { io } from '../server.js';



export const checkEmail = async (req,res) => {

    const {email} = req.body;

    
    if(!email) return res.status(400).json({success : false, message : "email is required!"});
    
    try{


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address!"
            });
        }

        const user = await db.User.findOne({where : {email}, attributes : ['name', 'is_verified']});
        if(!user) return res.status(200).json({
            success : true,
            message : "Please, signup !",
            action : "signup"

        });

        else{
            return res.status(200).json({
                success : true,
                message : "Welcome back!, please login",
                action : "login",
                user 
            })
        }


    }
    catch(error) {
        return res.status(500).json({success : false , message : error.message});
    }
}



export const googleAuth = async (req, res) => {

    const { email, name, photoUrl, provider_id } = req.body;


    if (!email || !name || !provider_id) {
        console.log('❌ Missing required fields');
        return res.status(400).json({
            success: false,
            message: "Email, name, and provider ID are required",
            received: { email, name, provider_id }
        });
    }

    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Invalid email format');
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address!"
            });
        }

        const user = await db.User.findOne({
            where: { email }, 
            attributes: ["id", "email", "name", "is_verified", "role"]
        });

        if (user) {
            console.log('✅ Existing user found:', user.email);
            generateTokenAndSetCookie(res, user.id);

            return res.status(200).json({
                success: true, 
                message: "Welcome back!",
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    is_verified: user.is_verified
                }
            });

        } else {
            console.log('🆕 Creating new user...');

              let cloudinaryUrl = null;
            let publicId = null;
            
            if (photoUrl) {
                try {
                    
                    const uploadResult = await cloudinary.uploader.upload(photoUrl, {
                        folder: 'user_profiles',
                        public_id: `google_user_${provider_id}`,
                        overwrite: true,
                        transformation: [
                            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                            { quality: 'auto', fetch_format: 'auto' }
                        ]
                    });
                    cloudinaryUrl = uploadResult.secure_url;
                    publicId = uploadResult.public_id;
                    console.log('✅ Photo uploaded to Cloudinary:', cloudinaryUrl);
                } catch (uploadError) {
                    console.error('⚠️ Failed to upload photo:', uploadError);
                    // Continue without profile picture
                }
            }

            const newUser = await db.User.create({
                email,
                name,
                password: null,                    
                auth_provider: 'google',           
                provider_id,                       
                profile_picture: cloudinaryUrl,  // ✅ Use Cloudinary URL
                public_id: publicId,             // ✅ Use Cloudinary public_id
                is_verified: 1,                    
            });



            console.log('✅ New user created:', newUser.id);
            generateTokenAndSetCookie(res, newUser.id);

            await sendWelcomeEmail(newUser.email, newUser.name);


            io.emit('newUser', {
                id : newUser.id,
                name : newUser.name,
                email : newUser.email,
                role : newUser.role,
                auth_provider : 'google',
                createdAt : newUser.createdAt
            })

            return res.status(201).json({
                success: true, 
                message: "Account created successfully!",
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role,
                    is_verified: newUser.is_verified
                }
            });
        }
    
    } catch (error) {
        console.error('❌ Google auth error:', error);
        return res.status(500).json({
            success: false, 
            message: error.message
        });
    }
};



export const signup = async(req,res) => {

    const {email,name,password} = req.body;

    try{

        if(!email || !name || !password){
            return res.status(400).json({message : "All fields are required"});
        }

        const existingUsers = await db.User.findOne({
            where : {email}
        })
        if(existingUsers){
            return res.status(409).json({success : false, message : "User already exist!"});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const verificationToken = generateCode();
        const verification_token_expires_at = new Date(Date.now() + 15 * 60 * 1000);

        const newUser = await db.User.create({
            email,
            name,
            password : hashedPassword,
            verification_token : verificationToken,
            verification_token_expires_at,
            auth_provider: 'email',  // Add this
            provider_id: null,       // Add this  
            profile_picture: null,   // Add this
        });

        generateTokenAndSetCookie(res,newUser.id);
        await sendVerificationEmail(newUser.email, verificationToken, newUser.name);

        io.emit('newUser', {
            id : newUser.id,
            name : newUser.name,
            email : newUser.email,
            createdAt : newUser.createdAt,
            
        })

        res.status(201).json({
            success: true,
            message:
                "User registered successfully! Please check your email for the verification code.",
            user:{
                id : newUser.id,
                name : newUser.name,
                email : newUser.email,
                role : newUser.role,
                is_verified : newUser.is_verified,
                verification_token : verificationToken,
              
            
            }
        });
        
        
    }catch(error){
        res.status(400).json({success : false, message : error.message});
    }
};




export const verificationCode = async (req, res) => {

    const {code} = req.body;
    
    if (!code) {
        return res.status(400).json({ 
            success: false, 
            message: "Verification code is required!" 
        });
    }

    try{
        const findUser = await db.User.findByPk(req.user.id );


        if(!findUser) return res.status(409).json({success : false, message : "User not found!"});

        if (findUser.is_verified) {
            return res.status(409).json({ 
                success: false, 
                message: "User is already verified!" 
            });
        }
            

        if(findUser.verification_token !== code) {
            return res.status(500).json({success : false , message : "invalid code!"})
        }
        
        
        
        if(findUser.verification_token_expires_at < new Date()) {
            return res.status(500).json({ 
                success: false, 
                message: "No verification token found!, you have to signup again" 
            });


        }

        const newUser = await findUser.update({
            is_verified : 1,
            verification_token : null, 
            verification_token_expires_at : null, 
        });

        await sendWelcomeEmail(newUser.email, newUser.name);

        io.emit('userVerified', {
            id: findUser.id,
            name: findUser.name,
            email: findUser.email,
            is_verified: true,
            
        })


        
        
        res.status(200).json({success : true, message : "verify successfully!✅",
            user : {
                is_verified : 1,
                role : findUser.role,
            }
        })
        
    }catch(error) {
        res.status(500).json({success : false , message : error.message})
    }
    
}


       


export const resendVerificationCode = async (req, res) => {
    try {
        const findUser = await db.User.findByPk(req.user.id);

        if (!findUser) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        if (findUser.is_verified) {
            return res.status(400).json({
                success: false,
                message: "User is already verified!"
            });
        }


        const newVerificationToken = generateCode();
        const verification_token_expires_at = new Date(Date.now() + 15 * 60 * 1000); 

        await findUser.update({
            verification_token: newVerificationToken,
            verification_token_expires_at: verification_token_expires_at
        });


        await sendVerificationEmail(findUser.email, newVerificationToken, findUser.name);

        res.status(200).json({
            success: true,
            message: "New verification code sent! Please check your email."
        });

    } catch (error) {
        console.error("Resend verification error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}






export const login = async(req,res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password) 
        return res.status(400).json({message : "Both fields are required!"});

        const findUser = await db.User.findOne({
        where : {email}
        });



        if(!findUser) return res.status(404).json({message : "User not found!"});
        

        const isMatch = await bcrypt.compare(password, findUser.password);
        if(!isMatch) return res.status(401).json({message : "Invalid password!"})

        if (!findUser.is_verified) {
            return res.status(403).json({ message: "Please verify your email first." });
        }

        //here also
        generateTokenAndSetCookie(res,findUser.id);

        res.status(200).json({message : "User login successfully✅", user : {
            email : findUser.email,
            role : findUser.role,
            is_verified : 1,
        
        }});

        

    }catch(error){
        res.status(500).json({message : error.message})
    }
}




export const forgotPassword = async (req,res) => {

    const {email} = req.body ;
    console.log(email);
    
    if(!email) return res.status(400).json({success : false, message : "invalid email!"});

    try{

        const findUser = await db.User.findOne({where : {email}});

        if(!findUser) return res.status(404).json({success : false, message : "User not found!"});

        const reset_password_token = generateCode();
        const reset_password_expires_at = new Date(Date.now() + 30 * 60 * 1000);

        await findUser.update({
            reset_password_token,
            reset_password_expires_at,
        })

        await sendPasswordResetEmail(findUser.email, reset_password_token, findUser.name);

        res.status(200).json({
            success: true,
            message: "Password reset email sent! Please check your email."
        });

    }

    catch(error) {
        res.status(500).json({success : false, message : error.message});
    }

}




export const resetPassword = async (req,res) => {

        // 6 digit verification code
    const {token,newPassword} = req.body;



    if(!token || !newPassword) return res.status(400).json({success : false, message : "password is required!"});

   try{
       
       if(newPassword.length<6) {
           return res.status(400).json({
               success : false, 
               message : "Password moust be at least 6 characters long!"
            })
        }
        
        const findUser = await db.User.findOne({where : {reset_password_token : token}})
        if(!findUser) return res.status(404).json({success : false, message : "token required!"})

        if (new Date() > findUser.reset_password_expires_at) {
            return res.status(400).json({
                success: false,
                message: "Reset token has expired!"
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword,10);


        await findUser.update({
            reset_password_expires_at : null,
            reset_password_token : null,
            password : hashedPassword,
        })

         sendResetSuccessEmail(findUser.email, findUser.name)
            .then(() => console.log('✅ Success email sent'))
            .catch(err => console.error('⚠️ Email failed but password updated:', err.message));


        

        res.status(200).json({
            success: true,
            message: "Password updated successfullly!✅"
        });

        
   }
   catch(error){
         res.status(500).json({success : false, message : error.message});
   }

}

  


export const resendPasswordToken = async (req,res) => {
    const {email} = req.body;

    if(!email) return res.status(400).json({success : false, message : "email are required!"});

    try{

        const findUser = await db.User.findOne({where: {email}});
        if(!findUser) return res.status(404).json({success : false, message : "User not found!"})
        const reset_password_expires_at = new Date(Date.now() + 30 * 60 * 1000);

        const reset_password_token = generateCode();



        await findUser.update({
            reset_password_token,
            reset_password_expires_at,
        })

        await sendPasswordResetEmail(findUser.email, reset_password_token, findUser.name);


        res.status(200).json({success : true, message : "Code is sent into your G-mail!"});



    }catch(error){

        res.status(500).json({success : false, message : error.message})
    }
}






export const logout = async(req,res) => {
    res.clearCookie("token");
    res.status(200).json({success : true, message : "Logged out successfully"});
}


export const whoami = async(req,res) =>{
    
    try{
        res.status(200).json({
            user : {
                id : req.user.id,
                name : req.user.name,
                email : req.user.email,
                role : req.user.role,
                is_verified : req.user.is_verified,
                phone : req.user.phone,
                address : req.user.address,
                profile_picture : req.user.profile_picture
            }
        })
    }catch(error){
        res.status(500).json({message : "Failed to fetch user info"});
    }
}



export const getUserById = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        
        // Only admins can view other users' info
        if (req.user.role !== 'admin' && req.user.id !== parseInt(targetUserId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const user = await db.User.findByPk(targetUserId, {
            attributes: ['id', 'name', 'email', 'role', 'is_verified']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user info" });
    }
}


export const updateAuth = async (req,res) => {

    const {name, email, password, phone, address} = req.body;
    const file = req.file;

    try{
        const user = await db.User.findByPk(req.user.id);
        if(!user) return res.status(404).json({success : false, message : "User not found!"});

        if(file && user.public_id) {

            try{
                await cloudinary.uploader.destroy(user.public_id);
            }catch(error) {
                console.log('Error deleteing old image : ', error);
            }
            
        }

        let hashedPassword = user.password;
        if(password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await user.update({
            name : name || user.name,
            email : email || user.email,
            password : hashedPassword || user.password,
            phone : phone || user.phone,
            address : address || user.address,
            profile_picture : file? file.path : user.profile_picture,
            public_id : file ? file.filename : user.public_id
        })

        return res.status(200).json({
            success: true, 
            message: "Profile updated successfully!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                profile_picture: user.profile_picture,
                role: user.role
            }
        });

    }
    catch(error) {
        return res.status(500).json({success : false , message : error.message})
    }
    

}





