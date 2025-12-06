import http from "./http";




export const checkEmailAPI = async ({email}) => {
    const {data} = await http.post('/auth/check-email', {email});
    return data;
}

export const googleAuthAPI = async (email,name,photoUrl,provider_id) => {
    const payload = {email, name, photoUrl, provider_id};
    const {data} = await http.post("/auth/google", payload);
    if(data.token) {
        localStorage.setItem('authToken', data.token);
    }
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

export const resendVerificationCodeAPI = async () => {

    const {data} = await http.post("/auth/resend-verification");
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
    const {data} = await http.post("/auth/login", payload);
    
    // Store token if using localStorage fallback
    if (data.token) {
        localStorage.setItem('authToken', data.token);
    }
    
    return data.user;
}

export const logoutAPI = async () => {
    try {
        const {data} = await http.post('/auth/logout');
        return data;
    } finally {
        // Always clear tokens, even if request fails
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
    }
}


export const whoamiAPI = async () => {
    const {data} = await http.get('/auth/whoami');
    return data.user;
}


export const getUserByIdAPI = async (userId) => {
    const {data} = await http.get(`/auth/users/${userId}`);
    return data.user;
}

export const updateAuthAPI = async ({name, phone, address, profile_picture}) => {
    const fd = new FormData();

    if (name && name.trim()) fd.append('name', name.trim());
    if (phone) fd.append('phone', phone);
    if (address) fd.append('address', address);
    
    if (profile_picture && profile_picture instanceof File) {
        fd.append('image', profile_picture);
    }

    const { data } = await http.patch('/auth/profile/update', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return data.user;
}