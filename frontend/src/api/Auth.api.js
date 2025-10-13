import http from "./http";



export const googleAuthAPI = async (email,name,photoUrl,provider_id) => {
    const payload = {email, name, photoUrl, provider_id};
    const {data} = await http.post("/auth/google", payload);
    return data.user;
}


export const checkEmailAPI = async ({email}) => {
    const {data} = await http.post('/auth/check-email', {email});
    return data;
}

export const signupAPI = async (name, email, password) => {

    const payload = {name,email,password};
    
    const {data} = await http.post('/auth/signup', payload);

    return data.user;
}

export const verificationCodeAPI = async (code) => {


    const {data} = await http.post("/auth/verify-email", {code});
    return data.user;

}

export const resendVerificationCodeAPI = async (code) => {

    const {data} = await http.post("/auth/resend-verification",{code});
    return data;
}

export const forgotPasswordAPI = async (email) =>{
    
    const {data} = await http.post('/auth/forgot-password', {email});

    return data;
}

export const resetPasswordAPI = async (token,newPassword) => {
    const payload = {token, newPassword};

    const {data} = await http.post("/auth/reset-password", payload);
    return data;

}


export const loginAPI = async (email, password) => {
    
    const payload = {email, password};

    const {data} = await http.post("/auth/login",payload);
    return data.user;


}

export const logoutAPI = async () => {

    const {data} = await http.post('/auth/logout');
    return data;
}



export const whoamiAPI = async () => {
    const {data} = await http.get('/auth/whoami');
    return data.user;
}


export const getUserByIdAPI = async (userId) => {
    const {data} = await http.get(`/auth/users/${userId}`);
    return data.user;
}