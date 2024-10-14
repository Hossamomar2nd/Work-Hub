import React, {useEffect, useState} from 'react'
import './AddCategory.scss';
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import {sidebarStatus} from "../../App";

const UpdateCategory = () => {
  let { id } = useParams();

  const [category, setCategory] = useState({
    name: "",
    description: "",
    loading: false,
    err: null,
  });

  const updateCategory = (e) => {
    e.preventDefault();
    setCategory({ ...category, loading: true, err: null });
    axios
      .put("http://localhost:4000/categories/" + id, {
        name: category.name,
        description: category.description,
      })
      .then((resp) => {
        setCategory({ ...category, loading: false, err: null });
        swal(resp.data.msg, "", "success");
      })
      .catch((errors) => {
        setCategory({
          ...category,
          loading: false,
          err: errors.response.data.errors,
        });
        console.log(errors);
      });
  };

  useEffect(() => {
    setCategory({ ...category, loading: true });
    axios
      .get("http://localhost:4000/categories", {
        params: {
          id: id,
        },
      })
      .then((resp) => {
        console.log(resp.data);
        setCategory({
          ...category,
          name: resp.data[0].name,
          description: resp.data[0].description,
          loading: false,
          err: null,
        });
      })
      .catch((err) => {
        setCategory({ ...category, loading: false, err: err });
      });
  }, []);

  return (
    <div className={sidebarStatus() ? 'addCategoryContainer' : 'addCategoryContainer sidebar-close-addCategory'}>
      <section className="AddCategoryPage">
        <div>
          <h1>Update Category</h1>
        </div>
      </section>

      <section className="AddCategory">
        <form onSubmit={updateCategory}>
          <div className="form-control">
            <h2>Name</h2>
            <input
              placeholder="Enter Name"
              value={category.name}
              onChange={(e) =>
                setCategory({ ...category, name: e.target.value })
              }
            />
          </div>
          <div className="form-control">
            <h2>Description</h2>
            <input
              placeholder="Enter Description"
              value={category.description}
              onChange={(e) =>
                setCategory({ ...category, description: e.target.value })
              }
            />
          </div>
          <div className="btn-container">
            <button type="submit" className="add-button">
              Update
            </button>

            <Link to={"/category"}>
              <button className="cancel-button">Cancel</button>
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UpdateCategory;
