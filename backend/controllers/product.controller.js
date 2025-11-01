import db from "../models/index.js";
import { v2 as cloudinary } from "cloudinary";



export const getAllProduct = async (req,res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page -1 ) * limit;
         
    try{
        const {rows : products , count : total } = await db.Product.findAndCountAll({
            limit,
            offset,
            order : [["createdAt", "DESC"]],
            attributes : ["id", "name", "stock", "price",'createdAt','description', 'warranty'],
            include : [
                {
                    model : db.ProductImage,
                    attributes : ["image_url"],
                    where : {is_main : true},
                    required : false,
                },
                {
                    model : db.Category,
                    attributes : ['slug', 'name']
                },
                {
                    model : db.Brand,
                    attributes : ['slug', 'name']
                }
            ]
        });

        // Debug logging
        console.log('Total products found:', products.length);
        if (products.length > 0) {
            console.log('First product structure:', JSON.stringify(products[0], null, 2));
            console.log('First product Category:', products[0].Category);
            console.log('First product Brand:', products[0].Brand);
        }
        
        res.status(200).json({
            success : true,
            products,
            total,
            count : products.length,
            page,
            limit,
            totalpages : Math.ceil(total/limit),
        })

    }catch(error){
        console.error('Backend error:', error);
        res.status(500).json({message : error.message})
    }
}


export const getProductById = async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id, {
      attributes: ['description', 'stock', 'price', 'name','id', 'warranty', 'createdAt', 'updatedAt'],
      include: [
        {
          model: db.ProductFeature,
          attributes: ['feature_name', 'feature_value']
        },
        {
          model: db.ProductImage,
          attributes: ['image_url']
        },
        {
            model : db.ProductVideo,
            attributes : ['video_url']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found!'
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message  
    });
  }
};

export const getProductsByBrandNCategory = async( req,res) => {
    const {category_slug, brand_slug} = req.params;
 
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page-1) * limit;

    try{
        const { rows: products, count: total } = await db.Product.findAndCountAll({
            attributes: ['id', 'name', 'price', 'stock', 'createdAt','warranty'],
            include: [
                {
                    model: db.Category,
                    where: { slug : category_slug },
                    attributes: ['name']
                },
                {
                    model: db.Brand,
                    where: { slug: brand_slug },
                    attributes: ['name']
                },
                {
                    model: db.ProductImage,
                    attributes: ['image_url'],
                    where: { is_main: true },
                    required: false
                }
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']],       
        });

        res.status(200).json({
            success : true,
            category : products.length > 0 ? products[0].Category.name : null,
            brand : products.length > 0 ? products[0].Brand.name : null,
            products,
            total,
            count : products.length,
            page,
            totalpages : Math.ceil(total/limit)
        })
    }
    catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}


/* export const uploadProduct = async(req, res) => {
    const {name, description, price, stock, brand_slug, category_slug, features, warranty} = req.body;

    if(!name || !price || !description || !stock || !brand_slug || !category_slug || !features){
        return res.status(400).json({message : "All fields are required!"});
    }

    try{
        // UPDATED: Search by category name instead of slug
        const [existingProduct, brand, category ] = await Promise.all([
            db.Product.findOne({where : {name}}),
            db.Brand.findOne({where : {slug : brand_slug}}),
            db.Category.findOne({where : {slug : category_slug}}) // Changed from slug to name
        ])
        
        if (existingProduct) {
            return res.status(409).json({ success: false, message: "Product already exists!" });
        }
        if (!brand) {
            return res.status(404).json({ message: "Brand not found!" });
        }
        if (!category) {
            return res.status(404).json({ message: "Category not found!" });
        }

        let parsedFeatures = [];

        try{
            parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;  
        }
        catch(error) {
            return res.status(500).json({message : "Invalid features format (must be JSON) "})
        }
        
        await db.sequelize.transaction(async(transaction) => {
            
            const product = await db.Product.create({
                name,
                description,
                price,
                stock,
                brand_id : brand.id,
                category_id : category.id,
                warranty : warranty || 'none',
            }, {transaction});
            
            const promises = [];
    
            if(parsedFeatures.length >0) {
                const featureData = parsedFeatures.map(f => ({
                    product_id : product.id,
                    feature_name : f.feature_name,
                    feature_value : f.feature_value,
                }));
    
                promises.push(db.ProductFeature.bulkCreate(featureData, {transaction}));
            }
    
            if (req.files && req.files.length > 0) {
                const imageFiles = [];
                const videoFiles = [];
    
                req.files.forEach(file => {
                    if(file.mimetype.startsWith('image/')){
                        imageFiles.push(file);
                    }
                    else if(file.mimetype.startsWith('video/')){
                        videoFiles.push(file);
                    }
                })
    
                if(imageFiles.length>0){
                    const imageData = imageFiles.map((file, index) => ({
                        image_url: file.path,
                        public_id: file.filename,
                        is_main: index === 0,
                        product_id: product.id
                    }));
            
                    promises.push(db.ProductImage.bulkCreate(imageData, {transaction}));
                }
    
                if(videoFiles.length>0){
                    const videoData = videoFiles.map((file,index) => ({
                        video_url : file.path,
                        public_id : file.filename,
                        format : file.format || null,
                        duration_sec : file.duration || null,
                        bytes : file.bytes || null,
                        is_main : index === 0,
                        product_id : product.id,
                    })) 
                    promises.push(db.ProductVideo.bulkCreate(videoData,{transaction}));   
                }
            }
    
            await Promise.all(promises);
            return product;
        })
        
        res.status(201).json({ success : true, message : "Product uploaded successfully✅"});
    }
    catch(error){
        res.status(500).json({message : error.message})
    }
} */
export const uploadProduct = async(req, res) => {
    console.log('🚀 === UPLOAD PRODUCT CONTROLLER STARTED ===');
    console.log('📝 Body:', req.body);
    console.log('📎 Files:', req.files?.length || 0);
    
    // Log file details
    if (req.files && req.files.length > 0) {
        console.log('📸 File details:');
        req.files.forEach((file, i) => {
            console.log(`  File ${i + 1}:`, {
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: file.path,
                filename: file.filename,
                allKeys: Object.keys(file) // See ALL available properties
            });
        });
    }

    const {name, description, price, stock, brand_slug, category_slug, features, warranty} = req.body;

    console.log('🔍 Extracted fields:', {
        name, 
        description: description?.substring(0, 50), 
        price, 
        stock, 
        brand_slug, 
        category_slug, 
        features: typeof features,
        warranty
    });

    if(!name || !price || !description || !stock || !brand_slug || !category_slug || !features){
        console.log('❌ Validation failed - missing required fields');
        return res.status(400).json({message : "All fields are required!"});
    }

    try{
        console.log('🔎 Checking for existing product, brand, category...');
        
        const [existingProduct, brand, category ] = await Promise.all([
            db.Product.findOne({where : {name}}),
            db.Brand.findOne({where : {slug : brand_slug}}),
            db.Category.findOne({where : {slug : category_slug}})
        ]);
        
        console.log('📊 Database check results:', {
            existingProduct: existingProduct ? 'Found' : 'Not found',
            brand: brand ? `Found (ID: ${brand.id})` : 'Not found',
            category: category ? `Found (ID: ${category.id})` : 'Not found'
        });
        
        if (existingProduct) {
            console.log('❌ Product already exists');
            return res.status(409).json({ success: false, message: "Product already exists!" });
        }
        if (!brand) {
            console.log('❌ Brand not found');
            return res.status(404).json({ message: "Brand not found!" });
        }
        if (!category) {
            console.log('❌ Category not found');
            return res.status(404).json({ message: "Category not found!" });
        }

        let parsedFeatures = [];

        try{
            console.log('🔧 Parsing features...');
            parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
            console.log('✅ Features parsed:', parsedFeatures.length, 'features');
        }
        catch(error) {
            console.error('❌ Features parse error:', error.message);
            return res.status(500).json({message : "Invalid features format (must be JSON) "})
        }
        
        console.log('💾 Starting transaction...');
        
        await db.sequelize.transaction(async(transaction) => {
            
            console.log('📦 Creating product...');
            const product = await db.Product.create({
                name,
                description,
                price,
                stock,
                brand_id : brand.id,
                category_id : category.id,
                warranty : warranty || 'none',
            }, {transaction});
            
            console.log('✅ Product created with ID:', product.id);
            
            const promises = [];
    
            if(parsedFeatures.length > 0) {
                console.log('🔧 Preparing features data...');
                const featureData = parsedFeatures.map(f => ({
                    product_id : product.id,
                    feature_name : f.feature_name,
                    feature_value : f.feature_value,
                }));
                
                console.log('💾 Bulk creating', featureData.length, 'features');
                promises.push(db.ProductFeature.bulkCreate(featureData, {transaction}));
            }
    
            if (req.files && req.files.length > 0) {
                const imageFiles = [];
                const videoFiles = [];
    
                req.files.forEach(file => {
                    if(file.mimetype.startsWith('image/')){
                        imageFiles.push(file);
                    }
                    else if(file.mimetype.startsWith('video/')){
                        videoFiles.push(file);
                    }
                });
                
                console.log('📸 Processing files:', {
                    images: imageFiles.length,
                    videos: videoFiles.length
                });
    
                if(imageFiles.length > 0){
                    console.log('🖼️ Preparing image data...');
                    const imageData = imageFiles.map((file, index) => ({
                        image_url: file.path,
                        public_id: file.filename,
                        is_main: index === 0,
                        product_id: product.id
                    }));
                    
                    console.log('💾 Bulk creating', imageData.length, 'images');
                    promises.push(db.ProductImage.bulkCreate(imageData, {transaction}));
                }
    
                if(videoFiles.length > 0){
                    console.log('🎥 Preparing video data...');
                    const videoData = videoFiles.map((file, index) => ({
                        video_url : file.path,
                        public_id : file.filename,
                        format : file.format || null,
                        duration_sec : file.duration || null,
                        bytes : file.bytes || null,
                        is_main : index === 0,
                        product_id : product.id,
                    }));
                    
                    console.log('💾 Bulk creating', videoData.length, 'videos');
                    promises.push(db.ProductVideo.bulkCreate(videoData, {transaction}));   
                }
            }
    
            console.log('⏳ Waiting for all promises...', promises.length, 'operations');
            await Promise.all(promises);
            console.log('✅ All promises resolved');
            
            return product;
        });
        
        console.log('✅✅✅ TRANSACTION COMPLETED SUCCESSFULLY!');
        res.status(201).json({ success : true, message : "Product uploaded successfully✅"});
    }
    catch(error){
        console.error('❌❌❌ ERROR CAUGHT:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Log full error object
        console.error('Full error object:', JSON.stringify(error, null, 2));
        
        res.status(500).json({
            message: error.message,
            error: error.toString()
        });
    }
}




export const getProductDetail = async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id, {
            attributes: ['description', 'stock', 'price', 'name', 'id', 'warranty'],
            include: [
                {
                    model: db.ProductFeature,
                    attributes: ['feature_name', 'feature_value']
                },
                {
                    model : db.ProductImage,
                    attributes : ['image_url', 'is_main']
                },
                {
                    model : db.ProductVideo,
                    attributes : ['video_url', 'is_main']
                }
            ],
       
        });


        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};







export const updateProduct = async (req,res) => {
    let {name, price, stock, description, features, warranty} = req.body;
    console.log(req.body);

    try{
        const product = await db.Product.findByPk(req.params.id, {
            include : [
                {model : db.ProductImage, attributes : ['id', 'public_id', 'image_url']}
            ] 
        });
        
        if(!product) return res.status(404).json({message : "Product not found !"});

        let brand_id = product.brand_id;
        let category_id = product.category_id;

        await product.update({
            name : name || product.name,
            price : price ?? product.price,
            stock : stock ?? product.stock,
            description : description || product.description,
            brand_id,
            category_id, 
            warranty : warranty || product.warranty
        })

        if(features) {
            let parsedFeatures = [];
            try{
                parsedFeatures = typeof features === "string" ? JSON.parse(features) : features;
            }
            catch(error){
                return res.status(500).json({
                    success : false,
                    message : "Invalid features format (must be JSON)"
                })
            }
            
            await db.ProductFeature.destroy({
                where : {product_id : product.id},
            })
            
            if(parsedFeatures.length>0) {
                const featureData = parsedFeatures.map(f => ({
                    feature_name : f.feature_name,
                    feature_value : f.feature_value,
                    product_id : product.id
                }))
                await db.ProductFeature.bulkCreate(featureData);
            }
        }
        
        if(req.files && req.files.length> 0) {
            await db.ProductImage.destroy({
                where : {product_id : product.id} // Fixed: was public_id : product.id
            })

            const publicId = [];

            if(product.ProductImages && product.ProductImages.length > 0){ // Fixed: ProductImages
                for (const img of product.ProductImages) {
                    if(img?.public_id) {
                        publicId.push(img.public_id);
                    }
                }
            }

            for(const p of publicId){
                try{
                    await cloudinary.uploader.destroy(p);
                }
                catch(error){
                    console.log(`Failed to delete ${p} from cloudinary!`, error.message );
                }
            }

            const imageData = req.files.map((f, index) => ({ // Added index for is_main
                product_id : product.id,
                image_url : f.path,
                public_id : f.filename,
                is_main: index === 0 // First image is main
            }))

            await db.ProductImage.bulkCreate(imageData)
        }
        
        res.status(200).json({message : "Product updated successfully", product });
        
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
 
export const deleteProduct = async(req, res) => {
    try {
        console.log('🗑️ === DELETE PRODUCT START ===');
        console.log('Product ID:', req.params.id);
        console.log('Time:', new Date().toISOString());
        
        const product = await db.Product.findByPk(req.params.id, {
            include: [
                {model: db.ProductImage, attributes: ['id', 'public_id']},
                {model: db.ProductVideo, attributes: ['id', 'public_id']}
            ]
        });

        if (!product) {
            console.log('❌ Product not found');
            return res.status(404).json({message: "Product not found or already deleted!"});
        }

        console.log('✅ Product found:', product.name);
        console.log('📸 Images:', product.ProductImages?.length || 0);
        console.log('🎥 Videos:', product.ProductVideos?.length || 0);

        // Delete Images
        const imagesPublicId = [];

        if (product.ProductImages?.length) {
            for (const img of product.ProductImages) {
                if (img.public_id) {
                    imagesPublicId.push(img.public_id);
                }
            }
        }

        console.log('🗑️ Images to delete:', imagesPublicId);

        if (imagesPublicId.length > 0) {
            console.log('☁️ Deleting images from Cloudinary...');
            
            for (const pid of imagesPublicId) {
                try {
                    console.log(`  🔄 Deleting image: ${pid}`);
                    const result = await cloudinary.uploader.destroy(pid);
                    
                    console.log(`  ✅ Result:`, result.result); // 'ok', 'not found', etc.
                    
                    if (result.result === 'ok') {
                        console.log(`  ✅ Image deleted from Cloudinary: ${pid}`);
                    } else {
                        console.log(`  ⚠️ Image not found in Cloudinary: ${pid} (${result.result})`);
                    }
                } catch (e) {
                    console.error(`  ❌ Cloudinary destroy failed for ${pid}:`, e.message);
                }
            }
        } else {
            console.log('ℹ️ No images to delete');
        }

        // Delete Videos
        const videosPublicId = [];
        
        if (product.ProductVideos?.length > 0) {
            for (const video of product.ProductVideos) {
                if (video.public_id) {
                    videosPublicId.push(video.public_id);
                }
            }
        }

        console.log('🗑️ Videos to delete:', videosPublicId);

        if (videosPublicId.length > 0) {
            console.log('☁️ Deleting videos from Cloudinary...');
            
            for (const vdo of videosPublicId) {
                try {
                    console.log(`  🔄 Deleting video: ${vdo}`);
                    const result = await cloudinary.uploader.destroy(vdo, {resource_type: "video"});
                    
                    console.log(`  ✅ Result:`, result.result);
                    
                    if (result.result === 'ok') {
                        console.log(`  ✅ Video deleted from Cloudinary: ${vdo}`);
                    } else {
                        console.log(`  ⚠️ Video not found in Cloudinary: ${vdo} (${result.result})`);
                    }
                } catch (e) {
                    console.error(`  ❌ Cloudinary video destroy failed for ${vdo}:`, e.message);
                }
            }
        } else {
            console.log('ℹ️ No videos to delete');
        }

        // Delete from database
        console.log('💾 Deleting product from database...');
        await product.destroy();
        console.log('✅ Product deleted from database');

        console.log('🗑️ === DELETE PRODUCT COMPLETE ===');
        console.log('Summary:', {
            product_id: req.params.id,
            product_name: product.name,
            images_deleted: imagesPublicId.length,
            videos_deleted: videosPublicId.length,
        });

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully✅',
            deleted: {
                images: imagesPublicId.length,
                videos: videosPublicId.length,
            }
        });
        
    } catch (error) {
        console.error('❌❌❌ DELETE PRODUCT ERROR:');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


/*                // 🚀 OPTIMIZATION 4: Return the product we already have instead of fetching again
        // We know what we just created, so we can construct the response without another query
        const response = {
            id: result.id,
            name: result.name,
            description: result.description,
            price: result.price,
            stock: result.stock,
            // Note: You might want to fetch images/videos if you need the exact data
            // But for performance, you could return the file info you already have
        };

        res.status(201).json({ 
            message: "Product uploaded successfully ✅", 
            product: response 
        }); */


        
  