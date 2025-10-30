import React from 'react';
import DeleteForm from '../../../DeleteForm';


const DeleteBannerModal = ({
  open,
  handleClose,
  deleteBan,
  msg,
  selectedBannerId,
  selectedBanner,
  submit
}) => {
  if (!open.open || open.formName !== 'delete') return null;

  return (
    <DeleteForm
      setOpen={handleClose}
      deleteCate={() => deleteBan(selectedBannerId)}
      msg={msg}
      name={selectedBanner?.Product?.name}
      submit={submit.process && submit.formName === 'delete'}
      typeData={selectedBanner}
    />
  );
};

export default DeleteBannerModal;