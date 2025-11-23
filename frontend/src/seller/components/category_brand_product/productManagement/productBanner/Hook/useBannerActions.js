import { useState } from "react";
import { uploadBanner, deleteBannerAPI } from "../../../../../../api/ProductBanner.api";

export const useBannerActions = (category_slug, getBannersByCate) => {
  const [open, setOpen] = useState({ formName: '', open: false });
  const [productId, setProductId] = useState('');
  const [submit, setSubmit] = useState({ formName: '', process: false });
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const resetForm = () => {
    setProductId('');
    setOpen({ formName: '', open: false });
    setMsg({ type: '', text: '' });
    setSubmit({ formName: '', process: false });
    setFile(null);
    setProgress(0);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!productId || !file) {
      return setMsg({ type: 'error', text: 'Please enter valid product ID and select a file!' });
    }

    try {
      setSubmit({ formName: 'add', process: true });
      setProgress(0);

      await uploadBanner({
        category_slug,
        productId,
        file,
        onProgress: evt => {
          if (!evt.total) return;
          const percentage = Math.round((evt.loaded * 100) / evt.total);
          setProgress(percentage);
        }
      });

      setMsg({ type: "success", text: 'Banner uploaded successfully! ' });
      await getBannersByCate();

      setTimeout(() => {
        resetForm();
      }, 3000);

    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data.message || error.message });
      setTimeout(() => {
        resetForm();
      }, 3000);
    } finally {
      setSubmit({ formName: '', process: false });
    }
  };

  const handleOpenAdd = () => {
    setOpen({ formName: 'add', open: true });
  };

  const deleteBan = async (id) => {
    try {
      setSubmit({ formName: 'delete', process: true });
      await deleteBannerAPI(id);

      setMsg({ type: 'success', text: 'Banner deleted successfully ' });
      await getBannersByCate();

      setTimeout(() => {
        setOpen({ formName: '', open: false });
        setSubmit({ formName: '', process: false });
        setMsg({ type: '', text: '' });
      }, 1500);

    } catch (error) {
      setMsg({
        type: 'error',
        text: error.response?.data?.message || error.message
      });
    }
  };

  const handleOpenDelete = (banner) => {
    setSelectedBannerId(banner.id);
    setSelectedBanner(banner);
    setOpen({ formName: 'delete', open: true });
  };

  const handleClose = () => {
    setOpen({ formName: '', open: false });
    setProductId('');
    setFile(null);
    setMsg({ type: '', text: '' });
    setProgress(0);
  };

  return {
    open,
    productId,
    setProductId,
    submit,
    progress,
    file,
    setFile,
    msg,
    selectedBannerId,
    selectedBanner,
    handleUpload,
    handleOpenAdd,
    deleteBan,
    handleOpenDelete,
    handleClose,
  };
};