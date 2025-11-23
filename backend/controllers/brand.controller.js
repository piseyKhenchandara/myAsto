import { Op } from "sequelize";
import db from "../models/index.js";
import { v2 as cloudinary } from "cloudinary";

export const uploadBrand = async (req, res) => {
    const { brand_name } = req.body;
    const file = req.file;
    const { category_slug } = req.params;

    try {
      if (!brand_name || !file || !category_slug) {
          return res.status(400).json({ success: false, message: "All fields are required!" });
      }

      const [existingCategory, existingBrand] = await Promise.all([
        db.Category.findOne({
            where: { slug: category_slug },
            attributes: ['id']
        }),
        
        db.Brand.findOne({
          where: { name: brand_name },
          include: [{
              model: db.Category,
              where: { slug: category_slug }
          }]
        })
      ]);

      if (!existingCategory) {
          return res.status(404).json({ 
              success: false, 
              message: "Category not found!" 
          });
      }

      if (existingBrand) {
        return res.status(409).json({ 
            success: false, 
            message: "Brand already exists in this category!" 
        });   
      }

      const slug = brand_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      await db.Brand.create({
          category_id: existingCategory.id,
          name: brand_name,
          slug: slug,
          image_url: file.path, 
          public_id: file.filename,
      });

      res.status(201).json({ message: "Brand created successfully!" });
      
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getAllBrands = async (req, res) => {
  try {
    const brands = await db.Brand.findAll({
      attributes: ['id', 'name', 'image_url', 'slug'], 
    });

    return res.status(200).json({ success: true, brands });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBrandsByCategory = async (req, res) => {
  try {
    const { category_slug } = req.params;
    
    const category = await db.Category.findOne({
      where: { slug: category_slug },
      attributes: ['id', 'name']
    });
    
    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }

    const brands = await db.Brand.findAll({
      where: { category_id: category.id },
      attributes: ['id', 'name', 'image_url', 'slug',], 
    });

    return res.status(200).json({ success: true, brands });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const updateBrand = async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    const { brand_name } = req.body;

    try {
        const brand = await db.Brand.findByPk(id);

        if (!brand) return res.status(404).json({ message: "Brand not found or already deleted!" });

        const newSlug = brand_name 
            ? brand_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            : brand.slug;

        if (brand_name && brand_name !== brand.name) {
            const duplicateBrand = await db.Brand.findOne({
                where: { 
                    name: brand_name,
                    category_id: brand.category_id,
                    id: { [Op.ne]: id } 
                }
            });

            if (duplicateBrand) {
                return res.status(409).json({ 
                    success: false, 
                    message: "Brand with this name already exists in this category!" 
                });
            }
        }

        if (file && brand.public_id) {
            try {
                await cloudinary.uploader.destroy(brand.public_id);
                console.log('Old image deleted from Cloudinary ');
            } catch (error) {
                console.log('Error deleting old image:', error);
            }
        }

        await brand.update({
            name: brand_name || brand.name,
            slug: newSlug,
            image_url: file ? file.path : brand.image_url, 
            public_id: file ? file.filename : brand.public_id, 
        });

        res.status(200).json({ 
            success: true,
            message: 'Brand updated successfully! ',
            data: {
                id: brand.id,
                name: brand.name,
                slug: brand.slug,
                image_url: brand.image_url
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteBrand = async (req, res) => {
    try {
        const brand = await db.Brand.findByPk(req.params.id);

        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        if (brand.public_id) {
            try {
                await cloudinary.uploader.destroy(brand.public_id);
                console.log("delete succesfuly from cloudinary")
            } catch (error) {
                console.log('Error deleting image from cloudinary:', error);
            }
        }

        await brand.destroy();
        return res.status(200).json({ message: "Brand deleted successfully!" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}