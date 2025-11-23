import axios from "axios";
import http from "./http";

export const uploadCategoriesAPI = async ({name,file,onProgress}) => {

    const fd = new FormData();

    fd.append('name', name);
    fd.append('image', file);

    const {data} = await http.post('/category/upload-category', fd, {
        headers : {'Content-Type' : 'multipart/form-data'},
        onUploadProgress : onProgress,
    });

    return data;

}

export const editCategoryAPI = async (name,id, file, onUploadProgress) => {
    const fd = new FormData();
    if(name) fd.append('name',name);
    if(file) fd.append('image', file);

    const {data} = await http.patch(`/category/update-category/${id}`,fd,{
        headers : {'Content-Type' : "multipart/form-data"},
        onUploadProgress
    })
    return data;
}


// In CategoryProduct.api.js
export const getCategoriesAPI = async () => {
    const {data} = await http.get('/category/view-all-categories');
    return data.category; //  Return just the categories array
}


export const deleteCategoryAPI = async (id) => {
    const {data} = await http.delete(`/category/delete-categories/${id}`)

    return data;
}