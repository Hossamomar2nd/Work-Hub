import React, { useEffect, useRef, useState } from 'react'
import "./LearnMenu.scss"
import { gigs } from "../../data";
import LearnCard from '../LearnCard/LearnCard';
import axios from "axios";
import swal from "sweetalert";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAuthUser } from '../../localStorage/storage';
import { sidebarStatus } from "../../App";

const LearnMenu = () => {

    const user = getAuthUser();

    let { category } = useParams();

    const [courses, setCourses] = useState({
        loading: false,
        results: null,
        err: null,
        reload: 0,
    });

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/courses/getAllCourses")
            .then((resp) => {
                setCourses({ results: resp.data.modifiedCourses, loading: false, err: null });
                console.log(resp.data.modifiedCourses);
                console.log(resp);
            })
            .catch((err) => {
                console.log(err);
                // setConversation({ ...conversation, loading: false, err: err.response.data.errors });
            });
    }, [courses.reload]);

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
                (pathname == "/learn") &&
                <div className='learnMenu'>
                    {categories.loading == false && categories.err == null && (
                        categories.results.map((category => (
                            <>
                            <div className='category'><Link className='learnMenuLink' to={"/filterLearn/" + category._id}>{category.categoryName}</Link></div>
                            </>
                        )))
                    )
                    }
                </div>
            }
            <div className={sidebarStatus() ? "learnCards" : "allLearnCards"}>
                {courses.loading == false &&
                    courses.err == null &&
                    courses.results &&
                    courses.results.length > 0 &&
                    courses.results.map((course) => (
                        <LearnCard key={course._id} item={course} />
                    ))}
            </div>
        </div>
    )
}
export default LearnMenu