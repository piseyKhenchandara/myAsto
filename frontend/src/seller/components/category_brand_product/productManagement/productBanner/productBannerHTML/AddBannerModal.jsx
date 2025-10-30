import React from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import DisplayFileNameSelected from '../../../../DisplayFileNameSelected';


const AddBannerModal = ({
  open,
  handleClose,
  submit,
  progress,
  msg,
  handleUpload,
  file,
  setFile,
  productId,
  setProductId
}) => {
  if (!open.open || open.formName !== 'add') return null;

  return (
    <div className='inset-0 fixed justify-center items-center bg-black/50 flex flex-col gap-5 z-50'>
      <div className="bg-white rounded-[20px] shadow-lg shadow-green-600 p-4 sm:p-6 mx-4 md:max-w-[400px]">
        <div className="flex justify-between items-center w-full">
          <h4 className="text-lg font-semibold">Add Banner Image</h4>
          <button
            onClick={handleClose}
            className="text-gray-700 hover:text-gray-900 text-xl"
          >
            ×
          </button>
        </div>

        {submit.process && submit.formName === 'add' && (
          <div className="w-full mb-3">
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className="h-2 rounded bg-green-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Uploading… {progress}%
            </div>
          </div>
        )}

        {msg.text && (
          <p className={`${msg.type === "error" ? "text-red-500" : "text-green-500"}`}>
            {msg.text}
          </p>
        )}

        <form onSubmit={handleUpload} className='flex flex-col gap-3'>
          <p className='mt-5'>Image (Max 1)</p>
          <div className='bg-gray-300 hover:bg-gray-400 border-dashed border relative flex flex-col justify-center items-center p-5 rounded-[15px] text-gray-700 cursor-pointer'>
            <IoIosAddCircleOutline className='text-4xl w-full' />
            <h5>Choose one image for one banner</h5>
            <p className='text-gray-500'>Accept: jpg, png, webp</p>
            <input
              type="file"
              accept='image/*'
              onChange={(e) => setFile(e.target.files[0])}
              className='absolute inset-0 opacity-0 cursor-pointer'
            />
          </div>

          <DisplayFileNameSelected fileName={file ? file.name : null} />

          <input
            type="text"
            placeholder='Link to product ID, e.g: 65'
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="outline-none border-b-2 border-gray-300 focus:border-green-600 py-2"
          />

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2 rounded-lg transition duration-200 cursor-pointer ${
                submit.process && submit.formName === 'add'
                  ? 'bg-gray-300 text-gray-200'
                  : "bg-green-600 text-white"
              }`}
              disabled={submit.process && submit.formName === 'add'}
            >
              Add Image
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBannerModal;