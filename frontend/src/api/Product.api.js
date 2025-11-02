import http from "./http";

/**  @param {Object} params { page?: Number, limit? : number} */

export const getAllProduct = async (params = {}) => {
    const {page = 1, limit = 12} = params;
    const {data} = await http.get("/products", {params: {page, limit}});
    return data;
}

export const getProductById = async (id) => {
    const {data} = await http.get(`/products/${id}`);
    return data;
}

export const getProductsByBrandNCategory = async(
    category_slug, 
    brand_slug, 
    params = {}) =>
    {   
    const {page = 1, limit = 6} = params;

    const {data} = await http.get(`/products/category/${category_slug}/brand/${brand_slug}`, 
    {
        params: {page, limit}
    });
    return data;
}

export const getProductDetail = async (id) => {
    const {data} = await http.get(`/products/detail/${id}`);
    return data.product;
}

/** 
 * UPDATED: Changed category_category_slug to category_slug to match backend
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.description
 * @param {number|string} payload.price
 * @param {number|string} payload.stock
 * @param {string} payload.brand_slug
 * @param {string} payload.category_slug - CHANGED: was category_slug
 * @param {Array<{feature_name : string, feature_value: string}>|string} payload.features
 * @param {File[]|File} payload.files
 * @param {(ProgressEvent : ProgressEvent) => void} [onUploadProgress]
 */
export const createProduct = async(payload, onUploadProgress) => {
const {
        name,
        description,
        price,
        stock,
        brand_slug,
        category_slug, // CHANGED: was category_slug
        features,
        warranty,      
        files
    } = payload;

    const fd = new FormData();

    fd.append('name', name);
    fd.append('description', description);
    fd.append('price', String(price));
    fd.append('stock', String(stock));
    fd.append('brand_slug', brand_slug);
    fd.append('category_slug', category_slug); // CHANGED: was category_slug

    if(warranty) {
        fd.append('warranty', warranty);
    }


    const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);
    fd.append('features', featuresJson);

    const fileList = Array.isArray(files) ? files : files ? [files] : [];
      
    fileList.forEach((f) => {
        // FIXED: Use 'files' as field name to match backend expectation
        fd.append('files', f);
    });

    const {data} = await http.post('/products/single_product', fd, {
       
        onUploadProgress,
    });

    return data;
}

export const updateProduct = async (payload) => {
    const {id, name, description, price, stock, features, warranty, files} = payload;

    const fd = new FormData();

    // Add basic fields with proper null/undefined checks
    fd.append('name', name ? name.trim() : '');
    fd.append('description', description ? description.trim() : '');
    fd.append('price', price || 0);
    fd.append('stock', stock ? stock : 0);

    if (warranty) {
        fd.append('warranty', warranty);
    }
    
    // Handle features
    const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);
    fd.append("features", featuresJson);
    
    // Handle files - only add files that exist
    if (files && files.length > 0) {
        const fileList = Array.isArray(files) ? files : [files];
        fileList.forEach(f => {
            if (f instanceof File) {
                fd.append('files', f);
            }
        });
    }

    // Debug logging
    console.log('FormData contents:');
    for (let [key, value] of fd.entries()) {
        console.log(key, ':', value);
    }

    try {
        const { data } = await http.put(`/products/edit/${id}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    } catch (error) {
        console.error('API Update Error:', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    const {data} = await http.delete(`/products/delete/${id}`);
    return data;
}