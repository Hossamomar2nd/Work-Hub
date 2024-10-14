import React, { useEffect, useRef, useState } from 'react'
import "./LearnMenu.scss"
import { gigs } from "../../data";
import LearnCard from '../LearnCard/LearnCard';
import axios from "axios";
import swal from "sweetalert";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAuthUser } from '../../localStorage/storage';
import { sidebarStatus } from "../../App";
import Alert from "@mui/material/Alert";

const FilterLearnMenu = () => {

    const user = getAuthUser();

    let { id } = useParams();

    const [filterCourses, setFilterCourses] = useState({
        loading: false,
        results: null,
        err: null,
        reload: 0,
    });

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/courses/getCoursesByCategoryId/" + id)
            .then((resp) => {
                setFilterCourses({ results: resp.data.modifiedCourses, loading: false, err: null });
                console.log(resp.data.modifiedCourses);
                console.log(resp);
            })
            .catch((err) => {
                console.log(err);
                setFilterCourses({ ...filterCourses, loading: false, err: err.response.data.msg });
            });
    }, [filterCourses.reload]);

    // const [sort, setSort] = useState("sales");
    // const [open, setOpen] = useState(false);
    // const minRef = useRef();
    // const maxRef = useRef();

    // const reSort = (type) => {
    //     setSort(type);
    //     setOpen(false);
    // };

    // const apply = () => {
    //     console.log(minRef.current.value)
    //     console.log(maxRef.current.value)
    // }

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
                    // console.log(resp.data);
                    setCategories({ results: resp.data, loading: false, err: null });
                    // console.log(resp);
                }
            ).catch(err => {
                setCategories({ ...categories, loading: false, err: err.response.data.msg });
                console.log(err);
            })
    }, [categories.reload]);


    const { pathname } = useLocation();

    return (
        <div className='learnMenuContainer'>
            {
                (pathname == "/filterLearn/" + id) &&
                <div className='learnMenu'>
                    {categories.loading == false && categories.err == null && (
                        categories.results.map((category => (
                            <>
                                <div className='category'><Link reloadDocument className='learnMenuLink' to={"/filterLearn/" + category._id}>{category.categoryName}</Link></div>
                            </>
                        )))
                    )
                    }
                </div>
            }
            <div className={sidebarStatus() ? "learnCards" : "allLearnCards"}>
                {filterCourses.loading == false &&
                    filterCourses.err == null &&
                    filterCourses.results &&
                    filterCourses.results.length > 0 &&
                    filterCourses.results.map((course) => (
                        <LearnCard key={course._id} item={course} />
                    ))}
            </div>
            {filterCourses.err !== null &&
                <div className='courseFilterAlert'>
                    <Alert severity="info">{filterCourses.err}</Alert>
                </div>
            }
        </div>
    )
}
export default FilterLearnMenu