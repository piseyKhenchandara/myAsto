import { useState } from 'react';

export const useBrandModalState = () => {
  const [open, setOpen] = useState({ formName: '', open: false });
  const [selectedBrandId, setSelectedBrandId] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showname, setShowName] = useState('');

  const handleOpen = () => {
    setOpen({ formName: 'add', open: true });
  };
  
  const handleOpenEdit = (brand) => {
    setSelectedBrandId(brand.id);
    setOpen({ formName: 'edit', open: true });
    setSelectedBrand(brand);
  };

  const handleOpenDelete = (brand) => {
    setSelectedBrandId(brand.id);
    setOpen({ formName: 'delete', open: true });
    setSelectedBrand(brand);
  };

  const handleClose = () => {
    setOpen({ formName: '', open: false });
    setSelectedBrandId(0);
    setSelectedBrand(null);
  };

  return {
    open,
    selectedBrandId,
    selectedBrand,
    showname,
    setShowName,
    handleOpen,
    handleOpenEdit,
    handleOpenDelete,
    handleClose,
  };
};