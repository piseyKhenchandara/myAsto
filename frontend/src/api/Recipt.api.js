import http from "./http";

export const reciptsAPI = async (user_id) => {
    const {data} = await http.get(`/recipts/view-all-recipts/${user_id}` );

    return data;
}