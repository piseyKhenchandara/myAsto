import http from '../lib/http';


export const uploadBrandsAPI = async({brand_name,file,category_slug,onProgress}) => {

    const fd = new FormData();

    fd.append('brand_name', brand_name);
    fd.append('image',file);

    const {data} = await http.post(`/brand/category/${category_slug}/upload-brand`, fd, {
        headers: {'Content-Type': 'multipart/form-data'},
        onUploadProgress: onProgress,
    });
    
    return data;
}


export const getAllBrandsAPI = async () => {

    const {data} = await http.get('/brand/view-all-brands');
    
    return data;
}



export const updateBrandAPI = async ({brand_name,file,id, onUploadProgress}) => {
    
    const fd = new FormData();

    if(brand_name) fd.append('brand_name',brand_name);
    if(file) fd.append('image',file);

    const {data} = await http.patch(`/brand/update-brand/${id}`,fd,{
        headers : {"Content-Type" : "multipart/form-data"},onUploadProgress
    });

    return data
} 

   
export const deleteBrandAPI = async ({id}) => {
    

    const {data} = await http.delete(`/brand/delete-brand/${id}`);

    return data;
}

export const getBrandsByCategoryAPI = async (category_slug) => {
    const response = await http.get(`/brand/category/${category_slug}/brands`);
    return response.data;
};
