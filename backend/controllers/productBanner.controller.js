import db from "../models/index.js";
import { v2 as cloudinary } from "cloudinary";


export const uploadBanner = async (req, res) => {
    const {slug} = req.params;  // Get slug from URL parameter
    const {id} = req.body;      // Get id from form data
    
    try {
        const existingCategory = await db.Category.findOne({
            where: {slug},
            attributes: ['id']
        });
        
        if (!existingCategory) {
            return res.status(404).json({message: "Category not found!"});
        }

        const existingProduct = await db.Product.findByPk(id, {
            attributes: ['id','name']
        });

        if (!existingProduct) {
            return res.status(404).json({message: "Product not found!"});
        }

        const checkId = await db.ProductBanner.findOne({where : {product_id : id}});

        if(checkId) return res.status(409).json({message : "the ID is already used for a banner!"});
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({message: "No files uploaded!"});
        }

        const file = req.files[0];

        await db.ProductBanner.create({
            image_url: file.path,
            public_id: file.filename,
            category_id: existingCategory.id,
            product_id: existingProduct.id,
        });

        res.status(201).json({
            success: true, 
            message: "Banner uploaded successfully!"
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}



export const getBannerByCategory = async (req, res) => {
    const { slug } = req.params;
    
    try {
        // Fix: Add await here
        const existingCategory = await db.Category.findOne({
            where: { slug },
            attributes: ['id']
        });

        if (!existingCategory) {
            return res.status(404).json({
                success: false, 
                message: "Category not found!"
            });
        }

        // Fix: Filter by category_id and include Product properly
        const banners = await db.ProductBanner.findAll({
            where: { category_id: existingCategory.id },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'image_url', 'is_main', 'category_id', 'product_id'],
            include: [{
                model: db.Product,
                attributes: ['id','name','slug']
            }, {
                model: db.Category,  // ADD THIS
                attributes: ['id', 'name', 'slug']
            }]
        });

        res.status(200).json({
            success: true, 
            banners: banners
        });
        
    } catch (error) {
        console.error('Get banners error:', error);
        return res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}


export const deleteBanner = async(req, res) => {
    const {id} = req.params;

    try {
        const existingBanner = await db.ProductBanner.findByPk(id);

        if (!existingBanner) {
            return res.status(404).json({
                success: false, 
                message: "Banner not found or already deleted!"
            });
        }

        // Delete image from cloudinary if it exists
        if (existingBanner.public_id) {
            try {
                await cloudinary.uploader.destroy(existingBanner.public_id);
            } catch (e) {
                console.log('Error deleting image from cloudinary:', e);
                // Continue with database deletion even if cloudinary fails
            }
        }
        
        // Delete from database
        await existingBanner.destroy();
        
        // ✅ THIS WAS MISSING - Send success response
        return res.status(200).json({
            success: true,
            message: "Banner deleted successfully"
        });
        
    } catch (error) {
        console.error('Delete banner error:', error);
        return res.status(500).json({
            success: false, 
            message: error.message || "Failed to delete banner"
        });
    }
}