import http from "./http";

export const uploadBanner = async ({ category_slug, productId, file, onProgress }) => {
    const formData = new FormData();
    formData.append('id', productId);
    formData.append('images', file);

    const { data } = await http.post(`/products/category/${category_slug}/upload/product-banner`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: onProgress,  //  Use the correct parameter name
    });
    
    return data;
}

export const getBannersByCategory = async (slug) => {
    const { data } = await http.get(`/products/category/${slug}/product-banners/new`);
    return data.banners;
}

export const deleteBannerAPI = async (id) => {
    const { data } = await http.delete(`/products/category/product-banner/${id}`);
    return data;
}



/* 
 */