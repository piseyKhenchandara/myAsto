import http from "./http";

export const viewAlluserAPI = async (page,limit) => {

    const {data} = await http.get('/users/view-all-users', {params : {page, limit}});
    return data;
}