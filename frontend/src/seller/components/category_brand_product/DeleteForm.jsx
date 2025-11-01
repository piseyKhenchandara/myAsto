import React from 'react'
import { CiTrash } from 'react-icons/ci'

const DeleteForm = ({ setOpen, deleteCate, msg, name, submit, typeData}) => {
  return (
    <aside className="fixed flex items-center justify-center inset-0 bg-black/50 z-50 p-4">
      <article className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
        
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <CiTrash className="text-red-500 text-xl" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>
          
          <button
            onClick={() => setOpen(false)}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
              submit 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 cursor-pointer"
            }`}
            aria-label="Close"
            disabled={submit.process }
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </header>

        {/* Content */}
        <section className="p-6">
          {/* Message Display */}
          {msg?.text && (
            <div className={`mb-4 p-3 rounded-lg border animate-in slide-in-from-top duration-300 ${
              msg.type === "error" 
                ? "bg-red-50 border-red-200 text-red-700" 
                : "bg-green-50 border-green-200 text-green-700"
            }`}>
              <p className="text-sm font-medium">{msg.text}</p>
            </div>
          )}

          {/* Image Preview */}
          {typeData?.image_url ? (
            <figure className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
              <div className="w-full h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden hover:border-gray-300 transition-colors duration-200">
                <img 
                  src={typeData.image_url} 
                  alt={typeData.name || name}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
              {typeData.name && (
                <figcaption className="text-sm text-gray-600 mt-2 text-center font-medium">
                  {typeData.name}
                </figcaption>
              )}
            </figure>
          ) : (
            <div className="mb-6">
              <div className="w-full h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <CiTrash className="text-gray-400 text-3xl mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No preview available</p>
                </div>
              </div>
            </div>
          )}

          {/* Warning Message */}
          <aside className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">Are you sure?</p>
                <p className="text-sm text-amber-700 mt-1">
                  This will permanently delete <span className="font-semibold">{name}</span>. This action cannot be undone.
                </p>
              </div>
            </div>
          </aside>
        </section>

        {/* Footer Actions */}
        <footer className="flex gap-3 p-6 pt-0">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              submit 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 cursor-pointer hover:shadow-sm"
            }`}
            disabled={submit}
          >
            Cancel
          </button>
          
          <button
            type="button"
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              submit 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            }`}
            onClick={deleteCate}
            disabled={submit}
            style={{ pointerEvents: submit ? 'none' : 'auto' }} // ✅ Extra safety
          >
            {submit ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Deleting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <CiTrash className="text-lg" />
                Delete {name}
              </span>
            )}
          </button>
        </footer>
      </article>
    </aside>
  )
}

export default DeleteForm