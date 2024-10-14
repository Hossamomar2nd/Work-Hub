import React, { useEffect, useState } from 'react'
import './ManageLearn.scss'
import { Table } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';
import Alert from 'react-bootstrap/Alert';
import { sidebarStatus } from "../../App";
import LearnMenu from '../../components/LearnMenu/LearnMenu';


const ManageLearn = () => {

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
        axios.delete("http://localhost:3000/api/categories/deleteCategory/:id", {
            params: {
                id: category_id,
            }
        })
            .then(
                resp => {
                    swal(resp.data.msg, "", "success");
                    setCategories({ ...categories, reload: categories.reload + 1 });
                }
            ).catch(error => {
                console.log(error);
            })
    }

    return (
        <section className={sidebarStatus() ? "manageLearnPage" : "manageAllLearnPage"}>
            <div>
                <h1>Course List</h1>
            </div>
            <div className='courseContain-table'>
                <Link to={'/addCourse'}>
                    <button className='addCourseButton' onClick={clicked}>
                        Add Course
                    </button>
                </Link>
            </div>
            <LearnMenu />
        </section>)
}

const clicked = () => {
    $(".addCategoryButton").addClass("clicked");

    setTimeout(() => {
        $(".addCategoryButton").removeClass("clicked");
    }, 0.05);
}

export default ManageLearn