import React from 'react'
import DisplayFileNameSelected from '../../../DisplayFileNameSelected';


const EditForm = ({type_name, setOpen, submit, progress, msg, updateType,  name,setName,file, setFile}) => {

  return (
    <aside className="fixed flex items-center justify-center inset-0 bg-black/50 z-50 p-4">
        <article className="bg-white rounded-[20px] p-4 sm:p-6 w-full mx-4 max-w-[400px] shadow-lg shadow-green-600">
        <header className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">{type_name}</h4>
            
            <button 
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
            >
            ×
            </button>
        </header>
        
        { submit.process && 
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
        }
        
        {msg &&
            <p className={`${msg.type === "error" ? "text-red-500" : "text-green-500 "}`}>{msg.text}</p>
        }
        
        <form onSubmit={updateType} className="flex flex-col gap-3">
            <input
            type="text"
            placeholder={`${name}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className=" p-3 text-sm outline-none border-b-1 "
            />
            <div className="relative">
            <button 
                type="button"
                className="bg-gray-300 hover:bg-gray-400 border-dashed border-2 relative flex flex-col justify-center items-center p-5 rounded-[15px] text-gray-700 w-full"
            >
                <h5>Choose one image</h5>
                <p className="text-sm">image/jpeg, image/png, image/webp</p>
                
                <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="border p-2 rounded-lg text-sm opacity-0 inset-0 absolute cursor-pointer" 
                />
            </button>
            {file && (
                <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                <p className="text-xs  truncate">
                    You selected: <span className='text-green-700'>{file.name}</span>
                </p>
                </div>
            )}
            </div>
            
            <footer className="flex gap-2 mt-2">
            <button
                type="button"
                onClick={() => setOpen(false)}
                className={`flex-1 px-4 py-2 rounded-lg transition duration-200 ${
                    submit.process 
                        ? "bg-gray-300 text-gray-400 cursor-not-allowed" 
                        : "bg-gray-400 hover:bg-gray-500 text-white cursor-pointer"
                }`}
                disabled={submit.process}
            >
                Cancel
            </button>
            <button
                type="submit"
                className={`flex-1 px-4 py-2 rounded-lg transition duration-200 ${
                    submit.process 
                        ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover: cursor-pointer"
                }`}
                disabled={submit.process}
            >
                Submit
            </button>
          
            
            </footer>
        </form>
        </article>
    </aside>
  )
}

export default EditForm