import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { getBrandsByCategoryAPI, uploadBrandsAPI, updateBrandAPI, deleteBrandAPI} from '../../../../api/BrandProduct.api'
import { IoIosAddCircleOutline } from "react-icons/io"
import CategoryManagement from '../categoryManagement/CategoryManagement'
import AddForm from '../AddForm'
import { FaCircle } from "react-icons/fa6";
import { CiEdit, CiTrash } from 'react-icons/ci'
import EditForm from '../EditForm'
import DeleteForm from '../DeleteForm'
import { useUser } from '../../../../../context/UserContext'


const BrandManagement = ({ brand_slug, visible }) => {
  
  const { user: whoami, loading: loadingUserRole, error: userError } = useUser();
  const navigate = useNavigate();
  const params = useParams();
  const { category_slug } = params;

  const [brands, setBrands] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [submit, setSubmit] = useState({ formName: '', process: false });
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState({ formName: '', open: false });
  const [progress, setProgress] = useState(0);
  const [showname, setShowName] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState(null);


  const checkUserRole = whoami?.role === 'admin' || whoami?.role === 'seller';
  const getBrandsByCategory = async () => {
    try {
      setLoading(true)
      const brands = await getBrandsByCategoryAPI(category_slug)
      
      const brandData = brands.brands || brands || []
      setBrands(brandData)
       if (brandData.length > 0) setShowName(brandData[0].name)
      
      if (brandData.length > 0 && !brand_slug) {
        const firstBrand = brandData[0]
        navigate(checkUserRole ? `/dashboard/category/${category_slug}/brand/${firstBrand.slug}/products`: `/category/${category_slug}/brand/${firstBrand.slug}/products` ,{ replace: true })
        
      } else if (brandData.length === 0) {
        navigate(checkUserRole? `/dashboard/category/${category_slug}/brands` : `/category/${category_slug}/brands`,{ replace: true })
      }
    } catch (error) {
      setMsg({
        type: 'error', 
        text: error.response?.data.message || "Failed to fetch brands by category"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (category_slug && !loadingUserRole) {
      getBrandsByCategory()
    }
  }, [category_slug, loadingUserRole])

  const uploadBrand = async (e) => {
    e.preventDefault()

    if (!name || !file) {
      return setMsg({ type: 'error', text: "All fields are required!" })
    }        

    try {
      setMsg({ type: '', text: '' })
      setSubmit({ formName: 'add', process: true })
      setProgress(0)

      await uploadBrandsAPI({
        brand_name: name,
        file,
        category_slug: category_slug,
        onProgress: (evt) => {
          const percentage = Math.round((evt.loaded * 100) / evt.total)
          setProgress(percentage)
          return percentage
        }
      })

      setMsg({ type: "success", text: "Brand uploaded successfully! ✅" })
      await getBrandsByCategory()

      setTimeout(() => {
        setName('')
        setFile(null)
        setMsg({ type: '', text: '' })
        setOpen({ formName: '', open: false })
      }, 3000)

    } catch (error) {
      setMsg({
        type: 'error', 
        text: error.response?.data.message || "Failed to upload brand to database"
      })
    } finally {
      setSubmit({ formName: '', process: false })
    }
  }

  const updateBrand = async (e) => {
    e.preventDefault();

    try{
      setSubmit({formName : 'edit', process : true});

      await updateBrandAPI({
        brand_name : name || null,
        file : file || null,
        id : selectedBrandId,
        onUploadProgress : (evt) => {
          if(!evt) return ;
          const pct = Math.round((evt.loaded * 100)/evt.total);
          setProgress(pct);
          return pct;
        }
      })

      setMsg({type : 'success', text : "brand updated successfully!✅"});
      await getBrandsByCategory();

      setTimeout(() => {
        setName('')
        setFile(null)
        setMsg({ type: '', text: '' })
        setOpen({ formName: '', open: false })
        setSelectedBrandId(null);        
      },3000)
    }
    catch(error){
       setMsg({
        type: 'error', 
        text: error.response?.data.message || "Failed to upload brand to database"
      })
    }
    finally{
      setSubmit({ formName: '', process: false })
    }
  }

  const deleteBrand = async () => {
    try{
      setSubmit({ formName: 'delete', process: true });

      await deleteBrandAPI({
        id : selectedBrandId
      })  

      setMsg({ type: 'success', text: 'Brand deleted successfully ✅' });
      await getBrandsByCategory();

      setTimeout(() => {
        setOpen({ formName: '', open: false });
        setMsg({ type: '', text: '' });
      }, 1500);

    }
    catch(error){
         setMsg({ 
          type: 'error', 
          text: error.response?.data?.message || error.message 
        });
    }
    finally{
      setSubmit({ formName: '', process: false });
    }
  }

  const handleOpen = () => {
    setOpen({ formName: 'add', open: true })
    setName('')
    setFile(null)
    setMsg({ type: '', text: '' })
    setSubmit({ formName: '', process: false })
    setProgress(0)
  }
  
  const handleOpenEdit = (brand) => {
    setSelectedBrandId(brand.id);
    setOpen({ formName: 'edit', open: true });
    setName(brand.name || '');
    setFile(null);
    setMsg({ type: '', text: '' });
    setSubmit({formName : "", process : false})
  };

  const handleOpenDelete = (brand) => {
    setSelectedBrandId(brand.id);
    setOpen({ formName: 'delete', open: true });
    setMsg({ type: '', text: '' });
    setSelectedBrand(brand);
  };

  const handleClose = () => {
    setOpen({ formName: '', open: false });
    setName('');
    setFile(null);
    setMsg({ type: '', text: '' });
    setSubmit({ formName: '', process: false });
    setProgress(0);
  };


  return (
    <section className='w-full '>
        
      {loadingUserRole ? <p className='text-gray-300 text-center'>loading permisson...</p> : 
      
        <>
              {/* Category Management Section */}
          <CategoryManagement category_slug={category_slug} />
          
          
          {checkUserRole && <header className='bg-gray-200 px-6'>
            <div className="flex justify-between items-center md:w-[50%] py-1">
              <h4>Brands-section</h4>
              <button 
                className="rounded-[10px] flex items-center shadow-md shadow-green-400 cursor-pointer hover:text-white transition duration-200 bg-green-500 hover:bg-green-600 text-white py-1 px-3 gap-2" 
                onClick={handleOpen}
              >
                Add 
                <IoIosAddCircleOutline className="text-2xl sm:text-3xl" />
              </button>
            </div>
          </header>}

          {/* Brands Display Section */}
          <section className="relative p-6 bg-gradient-to-br from-green-100 via-lime-50 to-emerald-100 overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-green-300 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 bg-lime-300 rounded-full blur-xl animate-pulse "></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-emerald-300 rounded-full blur-lg animate-pulse "></div>
            </div>

            {/* Loading State */}
            {loading && <p className='text-gray-500 text-center'>Loading brands...</p>}

            {/* Empty State */}
            {!loading && brands.length === 0 && (
              <h4 className="text-center text-gray-500">No brands found.</h4>
            )}

            {/* Brands Grid */}
            {!loading && brands.length > 0 && ( 
              <div className='flex items-center w-full flex-col'>
                <h4 className='text-center text-green-600'>Choose your brand</h4>
                
                <div className='flex flex-wrap gap-3 md:gap-5 w-[80%] py-4 overflow-visible justify-center'>
                  {brands.map((eachBrand, index) => (
                    <article 
                      className={`relative flex flex-col items-center p-2 border rounded-[20px] border-green-500 hover:scale-110 hover:shadow-green-400 cursor-pointer transition-transform group ${
                        brand_slug === eachBrand.slug ? 'shadow-inner border-3 shadow-green-500/50' : ""
                      } hover:z-25`} 
                      key={eachBrand.id || index}
                    >
                      <NavLink 
                        to={checkUserRole ? `/dashboard/category/${category_slug}/brand/${eachBrand.slug}/products` : `/category/${category_slug}/brand/${eachBrand.slug}/products`} 
                        onClick={() => setShowName(eachBrand.name)}
                      >
                        <img
                          src={eachBrand.image_url}
                          alt={eachBrand.name}
                          className={`${checkUserRole !=='customer' ? 'w-11 h-11 sm:w-14 sm:h=14 md:w-16 md:h-16': 'w-14 h-14 sm:w-15 sm:h-15 md:w-20 md:h-20'}  object-contain mb-2 z-0`}
                          
                        />
                      </NavLink>
                      {checkUserRole && 
                      
                        <div className="flex justify-between w-full">
                          <button 
                              className="rounded-[10px] flex items-center cursor-pointer ho transition duration-200  py-1 text-xl sm:text-2xl text-green-500" 
                              onClick={() => handleOpenEdit(eachBrand)}
                          >
                              <CiEdit/>
                          </button>

                          <button 
                              className="rounded-[10px] flex items-center cursor-pointer ho transition duration-200  py-1 text-xl sm:text-2xl text-red-500" 
                              onClick={() => handleOpenDelete(eachBrand)}
                          >
                              <CiTrash/>
                          </button>

                        </div>
                      }
                      <span className="absolute top-full mt-1 bg-gray-800 text-white text-xs rounded-[10px] px-2 py-1 opacity-0   group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                        {eachBrand.name}
                      </span>
                    </article>
                  ))}
                </div>  
                
                <p className='text-green-600 text-center border px-2 rounded-[15px]'>
                  <span><FaCircle className='text-[12px] inline pr-2' /></span> 
                    selected: {showname}
                </p>
              </div>
            )}
          </section>

          {/* Add Brand Form Modal - Using AddForm Component */}
          {open.open && open.formName === 'add'&& (
            <AddForm
              type_name="Add New Brand"
              setOpen={setOpen}
              submit={submit}
              progress={progress}
              msg={msg}
              uploadCategories={uploadBrand}
              name={name}
              setName={setName}
              file = {file}
              setFile={setFile}
            />
          )}
          {open.open && open.formName === 'edit' && (
            <EditForm
              type_name="Edit brand"
              setOpen={handleClose}
              submit={submit}
              progress={progress}
              msg={msg}
              updateType = {(e) => updateBrand(e)}
              name={name}
              setName={setName}
              file = {file}
              setFile={setFile}
            />
          )}

          {open.open && open.formName === 'delete' && (
            <DeleteForm
              setOpen={handleClose}
              deleteCate={deleteBrand}
              msg={msg}
              name={name}
              submit={submit}
              typeData={selectedBrand}
            
            />
          )}
        </>
      }
    </section>
  )
}

export default BrandManagement