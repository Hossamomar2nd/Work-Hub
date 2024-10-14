import React, { useEffect, useState } from 'react'
import './Category.scss'
import { Table } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';
import Alert from 'react-bootstrap/Alert';
import { sidebarStatus } from "../../App";

const Category = () => {

    const [categories, setCategories] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0
    });

    useEffect(() => {
        setCategories({ ...categories, loading: true })
        axios.get("http://localhost:3000/api/categories/getAllCategories")
            .then(
                resp => {
                    console.log(resp.data);
                    setCategories({ results: resp.data, loading: false, err: null });
                    console.log(resp);
                }
            ).catch(err => {
                setCategories({ ...categories, loading: false, err: err.response.data.msg });
                console.log(err);
            })
    }, [categories.reload]);

    const deleteCategory = (e) => {
        e.preventDefault();
        const category_id = e.target.value;
        axios.delete("http://localhost:3000/api/categories/deleteCategory/" + category_id)
            .then(
                resp => {
                    console.log(resp);
                    swal(resp.data.msg, "", "success");
                    setCategories({ ...categories, reload: categories.reload + 1 });
                }
            ).catch(error => {
                console.log(error);
            })
    }
    return (
        <>
            <section className={sidebarStatus() ? 'CategoryListPage sidebar-open-category' : 'CategoryListPage sidebar-close-category'}>
                <div>
                    <h1>Category List</h1>
                </div>
                <div className='contain-table'>
                    <Link to={'/addCategory'}>
                        <button className='addCategoryButton' onClick={clicked}>
                            Add Category
                        </button>
                    </Link>
                    {categories.loading == false && categories.err == null && (
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>
                                        Name
                                    </th>
                                    <th>
                                        Description
                                    </th>
                                    <th colSpan={2} className='action'>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.loading == false && categories.err == null && (
                                        categories.results.map((category => (
                                            <tr>
                                                <td>
                                                    {category.categoryName}
                                                </td>
                                                <td className="desc">
                                                    {category.categoryDesc}
                                                </td>
                                                <td className="test" colSpan={2}>
                                                    <Link reloadDocument to={'/updateCategory/' + category._id}>
                                                        <button className="button muted-button gl-update-btn">
                                                            Update
                                                        </button>
                                                    </Link>
                                                    <button value={category._id} onClick={deleteCategory} className="button muted-button gl-delete-btn">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )))
                                    )
                                }
                            </tbody>
                        </Table>
                    )
                    }
                    {
                        categories.loading == false && categories.err !== null && (
                            <Alert variant={'danger'} className='err-msg-custom'>
                                {categories.err}
                            </Alert>
                        )
                    }
                </div>
            </section>
        </>
    )
}


const clicked = () => {
    $(".addCategoryButton").addClass("clicked");

    setTimeout(() => {
        $(".addCategoryButton").removeClass("clicked");
    }, 0.05);
}

export default Category;
