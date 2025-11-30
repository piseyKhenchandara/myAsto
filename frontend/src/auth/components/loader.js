// src/auth/requireSellerNAdmin.js
import { redirect } from "react-router-dom";
import { whoamiAPI } from "../../api/Auth.api";





export const guestOnlyLoader = async () => {

  try{
    const user = await whoamiAPI();

    if(user) {
      if(user.is_verified) {

        if (!user.is_verified) {
          throw redirect('/auth/verify-email');
        }

        if(user?.role === 'customer') {
          throw redirect('/');
        }
        else {
          throw redirect('/dashboard');
        }
      }
    }

    return null;

  }catch(error){
    if(error instanceof Response) {
      throw error;
    }
    return null;

  }
}




export async function requireSellerNAdmin({ request }) {
  try {
    const user = await whoamiAPI();

    if (!user) {
      throw redirect("/auth");
    }

    if (!user.is_verified) {
      throw redirect('/auth/verify-email');
    }

    if (user.role !== "seller" && user.role !== "admin") {
      throw redirect("/"); 
    }

    return user;

  } catch (err) {
    if (err instanceof Response) {
      throw err; 
    }

    if (err.response?.status === 401) {
      const url = new URL(request.url);
      const from = encodeURIComponent(url.pathname + url.search);
      throw redirect(`/auth?from=${from}`);
    }

    throw redirect("/");
  }
}

export const verificationOnlyLoader = async () => {
  try {
    const user = await whoamiAPI();

    if (!user) {
      throw redirect('/auth');
    }

    if (user.is_verified) {
      if (user.role === 'customer') {
        throw redirect('/');
      } else {
        throw redirect('/dashboard');
      }
    }

    return { user };
  } catch (error) {
    if (error instanceof Response) throw error;
    throw redirect('/auth');
  }
};

export const requireAuth = async () => {
  try{
    const user = await whoamiAPI();

    if(!user) throw redirect('/auth');
    if(!user.is_verified) throw redirect('/auth/verify-email');

    return null;

  }
  catch(error) {
    if(error instanceof Response) throw error;
    throw redirect('/auth')
  }
}
