import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProduct } from '../../../../../api/Product.api';


export const useProductUpdate = (id, category_slug, brand_slug) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const prepareFiles = async (existingImages, finalImages) => {
    const filesToSend = await Promise.all(
      existingImages.map(async (img, idx) => {
        // If image was replaced, send the new file
        if (finalImages[idx]) {
          return finalImages[idx].file;
        }
        
        // If image wasn't replaced, fetch and send the original file
        try {
          const response = await fetch(img.image_url);
          const blob = await response.blob();
          
          const urlParts = img.image_url.split('/');
          const filename = urlParts[urlParts.length - 1] || `image_${idx}.jpg`;
          
          const file = new File([blob], filename, { type: blob.type });
          return file;
        } catch (error) {
          console.error(`Failed to fetch image ${idx}:`, error);
          return null;
        }
      })
    );

    return filesToSend.filter(file => file !== null);
  };

  const updateProductData = async (formData, existingImages, finalImages) => {
    setSubmitLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const files = await prepareFiles(existingImages, finalImages);

      const payload = {
        id,
        ...formData,
        files
      };
      
      console.log('Submitting payload:', payload);
      console.log('Files to send:', files.map(f => f.name));
      
      await updateProduct(payload);
      
      setMsg({ type: 'success', text: 'Product updated successfully!' });
      
      // Navigate back after success
      setTimeout(() => {
        if (category_slug && brand_slug) {
          navigate(`/dashboard/category/${category_slug}/brand/${brand_slug}/product/detail/${id}`);
        } else {
          navigate(-1);
        }
      }, 1500);

    } catch (error) {
      console.error('Update error:', error);
      setMsg({
        type: 'error',
        text: error.response?.data?.message || "Failed to update product!"
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return {
    submitLoading,
    msg,
    setMsg,
    updateProductData
  };
};