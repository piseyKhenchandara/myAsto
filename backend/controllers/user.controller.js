import db from "../models/index.js";

export const viewAlluser = async (req,res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page-1) * limit;

    try{
        const {rows : users, count : total} = await db.User.findAndCountAll({
            limit,
            offset,
            order : [['createdAt', "DESC"]],
            attributes : ['id','name', 'email', 'role', 'phone', 'created_at', 'last_login', 'profile_picture'],
            
        });


        return res.status(200).json({
            success : true, 
            message : 'successfully show all user!',
            data : {
                users,
                total,
                limit,
                page,
                count : users.length,
                totalPages : Math.ceil(total/limit)
            }
        });

    }
    catch(error) {
        res.status(500).json({success : true, message : error.message});
    }
}



