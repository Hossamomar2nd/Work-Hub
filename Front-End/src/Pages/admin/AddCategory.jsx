import React, { useState } from 'react';
import './AddCategory.scss';
import { Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import {sidebarStatus} from "../../App";

const AddCategory = () => {

    const[category, setCategory] = useState({
        categoryName: "",
        categoryDesc: "",
        loading: false,
        err: null
      });
    
      const addCategory = (e) => {
        e.preventDefault();
        setCategory({...category, loading: true, err: null});
        axios.post("http://localhost:3000/api/categories/addCategory", {
            categoryName: category.categoryName,
            categoryDesc: category.categoryDesc
        })
        .then((resp) => {
            setCategory({...category, loading: false, err: null});
            swal(resp.data.msg,"","success");
            document.querySelector("#addCategoryForm").reset();
            // document.getElementById("categoryName").value = "";
            // document.getElementById("categoryDesc").value = "";
            console.log(resp);
        })
        .catch((errors) => {
            console.log(errors);
            swal(errors.response.data,"","error");
            setCategory({...category, loading: false, err: errors.response.data.errors});
        })
      }
  return (
    <div className={sidebarStatus() ? 'addCategoryContainerActive' : 'addCategoryContainer sidebar-close-addCategory'}>
            <section className='AddCategoryPage'>
                <div>
                    <h1>Add Category</h1>
                </div>
            </section>

            <section className='AddCategory'>
                <form id='addCategoryForm' onSubmit={addCategory}>
                    <div className='form-control'>
                        <h2>Name</h2>
                        <input
                        id='categoryName'
                        required
                        placeholder='Enter Name'
                        value={category.categoryName}
                        onChange={(e) => setCategory({...category, categoryName: e.target.value})}
                        />
                    </div>
                    <div className='form-control'>
                        <h2>Description</h2>
                        <input
                        id='categoryDesc'
                        required
                        placeholder='Enter Description'
                        value={category.categoryDesc}
                        onChange={(e) => setCategory({...category, categoryDesc: e.target.value})}
                        />
                    </div>
                    <div className='btn-container'>
                        <button type="submit" className='add-button'>Add</button>

                        <Link reloadDocument to={"/category"}>
                            <button className='cancel-button'>Cancel</button>
                        </Link>
                    </div>
                </form>
            </section>
        </div>
  )
}

export default AddCategory
