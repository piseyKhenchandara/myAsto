import { v2 as cloudinary } from "cloudinary";
import db from "../models/index.js";

export const uploadCategory = async (req, res) => {
    const { name } = req.body;
    const file = req.file;
    if (!name || !file) {
        return res.status(400).json({ success: false, message: "Both fields are required!" });
    }

    try {

        // Generate slug from name
        const slug = name.toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                        .replace(/\s+/g, '-')         // Replace spaces with hyphens
                        .trim();


        const existingCategory = await db.Category.findOne({ 
            where: { name }, 
            attributes: ['name'] 
        });

        if (existingCategory) return res.status(409).json({ success: false, message: 'Category already existed!' });


        await db.sequelize.transaction(async(transaction) =>{
          
            const newCategory = await db.Category.create({
                name,
                slug,                    //  Add the generated slug
                image_url: file.path,
                public_id: file.filename,
            }, {transaction});

            return newCategory;
        })

        res.status(201).json({
            success: true,
            message: 'Category created successfully!',
        });
    } catch (error) {
        console.error(" Error in uploadCategory:", error);
        return res.status(500).json({ message: error.message });
    }
};



export const getCategory = async (req, res) => {
    try {
        const category = await db.Category.findAll({
        attributes: ["id","name", "image_url","slug"], //  correct key + array
        });

        res.status(200).json({
        success: true,
        category,
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message,
        });
    }
};


export const updateCategory = async (req,res) => {
    
    const {name} = req.body;
    const {id} = req.params;
    const file = req.file;
          console.log("Starting update for ID:", req.params.id);
    try{      
        const existingName = await db.Category.findByPk(id, { 
            attributes: ['name', 'slug', 'image_url', 'public_id'] 
        });
        

/*         if(!existingName) return res.status(404).json({success : false, message : 'Category not found!'}); */
        
        let updateSlug ;

        if (name) {
        
            updateSlug = name.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-')         // Replace spaces with hyphens
                .trim();
          
        }
        
        await db.sequelize.transaction(async (transaction) => {
            
            await db.Category.update({
                name :  name || existingName.name,
                image_url : file?.path || existingName.image_url ,
                public_id : file?.filename || existingName.public_id ,
                slug : updateSlug || existingName.slug,

            }, {where : {id},
            transaction})
        });


        if(file && existingName.public_id) {
            try{
                await cloudinary.uploader.destroy(existingName.public_id);
                console.log('delete success fully')
            }
            catch(e){
                console.log(`error failed delete image from Cloudiary ,${existingName.public_id} `);
            }
        }

        res.status(201).json({success : true, message : "Cateogry update successfully!"});
   
    }
    catch(error){
        res.status(500).json({success : false, message : error.message});

    }

}
         

export const deleteCategory = async(req,res) => {
    const {id} = req.params;

    try{
        const category = await db.Category.findByPk(id);
        if(!category) return res.status(404).json({message : "category not found or already deleted!"});

        if(category.public_id) {
            try{ 
                await cloudinary.uploader.destroy(category.public_id);
                console.log('category deleted from cloudinary successfully')
            }
            catch(error){
                return res.status(500).json({message : error.message})
            };
        }

        await category.destroy();

        return res.status(200).json({message : "Category deleted successfully!"});


    }
    catch(error){
        return res.status(500).json({message : error.message});
    }
}


