import './AddCourse.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { sidebarStatus } from "../../App";
import React, { useEffect, useRef, useState } from "react";

const AddCourse = () => {

    const [categories, setCategories] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0
    });

    const [course, setCourse] = useState({
        err: null,
        loading: false,
        proffName: "",
        ProffDesc: "",
        categoryId: "",
        courseTitle: "",
        courseDesc: "",
        aboutCourse: "",
        courseDuration: "",
        courseLink: "",
        courseCoverImage_url: "",
        proffImage_url: "",
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

    const [category, setCategory] = useState({
        categoryName: "",
        categoryDesc: "",
        loading: false,
        err: null
    });

    const image = useRef(null);

    const coverImage = useRef(null);

  const uploadProfessorImage = (id) => {

    const formData = new FormData();
    formData.append("image", image.current.files[0]);

    // for (let i = 0; i < coverImage.current.files.length; i++) {
    //   formData.append("images", coverImage.current.files[i]);
    // }
    axios
      .put("http://localhost:3000/api/courses/uploadProffImage/" + id, formData)
      .then((resp) => {
        // image.current.value = null;
        // swal(resp.data.message, "", "success");
        console.log(resp);
      })
      .catch((errors) => {
        // swal(errors.response.data.message, "", "error");
        console.log(errors);
        // console.log(errors.response.data.message);
      });
  }

  const uploadCourseImage = (id) => {

    const formData = new FormData();
    formData.append("coverImage", coverImage.current.files[0]);

    // for (let i = 0; i < coverImage.current.files.length; i++) {
    //   formData.append("images", coverImage.current.files[i]);
    // }
    axios
      .put("http://localhost:3000/api/courses/uploadCourseCoverImage/" + id, formData)
      .then((resp) => {
        // image.current.value = null;
        // swal(resp.data.message, "", "success");
        console.log(resp);
      })
      .catch((errors) => {
        // swal(errors.response.data.message, "", "error");
        console.log(errors);
        // console.log(errors.response.data.message);
      });
  }
    const addCourse = (e) => {
        e.preventDefault();
        setCourse({ ...course, loading: true, err: null });
        axios.post("http://localhost:3000/api/courses/addCourse", {
            proffName: course.proffName,
            ProffDesc: course.ProffDesc,
            categoryId: course.categoryId,
            courseTitle: course.courseTitle,
            courseDesc: course.courseDesc,
            aboutCourse: course.aboutCourse,
            courseDuration: course.courseDuration,
            courseLink: course.courseLink,
        })
        .then((resp) => {
            console.log(resp);
            const courseId = resp.data.newCourse._id;
            uploadCourseImage(courseId);
            uploadProfessorImage(courseId);
            window.location.reload();
            window.location = "http://localhost:3001/manageLearn";
            // document.getElementById("serviceFrom").reset();
            // document.getElementById("service").value = "";
            // let list = document.querySelectorAll('#service')
            // console.log(list);
            // window.location.reload();
            // for (let i = 0; i < featureList.length; i++) {
            //   handleFeaturesRemove(i);
            // }    
            // document.getElementById("selectCategory").selectedIndex = 0;
            // swal(resp.data.message, "", "success");
            // console.log(resp);
            // console.log(service);
          })
          .catch((errors) => {
            // swal(errors.response.data.message, "", "error");
            console.log(errors);
          });
    }
    return (
        <div className={sidebarStatus() ? 'addCourseContainerActive' : 'addCourseContainer sidebar-close-addCourse'}>
            <section className='AddCoursePage'>
                <div>
                    <h1>Add Course</h1>
                </div>
            </section>
            <section className='AddCourse'>
                <form id='addCourseForm' onSubmit={addCourse}>
                    <div className='form-control'>
                        <h2>Professor Name</h2>
                        <input
                            id='courseName'
                            required
                            placeholder='Enter Professor Name'
                            onChange={(e) => setCourse({ ...course, proffName: e.target.value })}
                        />
                    </div>
                    <div className='form-control'>
                        <h2>Professor Description</h2>
                        <input
                            id='courseDesc'
                            required
                            placeholder='Enter Professor Description'
                            onChange={(e) => setCourse({ ...course, ProffDesc: e.target.value })}
                        />
                    </div>
                    <div className='form-control'>
                        <h2>Professor Image</h2>
                        <input id='courseDesc' className='professorImg' required type="file" ref={image} />
                    </div>
                    <div className='form-control'>
                        <h2>Category</h2>
                        <select
                            name="categoryId"
                            required
                            onChange={(e) =>
                                setCourse({ ...course, categoryId: e.target.value })
                            }
                            id="selectCategory"
                        >
                            <option value={""} disabled selected>
                                Select Category
                            </option>
                            {categories.loading == false &&
                                categories.err == null &&
                                categories.results &&
                                categories.results.length > 0 &&
                                categories.results.map((category) => (
                                    <>
                                        <option value={category._id}>
                                            {category.categoryName}
                                        </option>
                                    </>
                                ))}
                        </select>
                    </div>
                    <div className='form-control'>
                        <h2>Course Title</h2>
                        <input
                            id='categoryDesc'
                            required
                            placeholder='Enter Course Title'
                            // value={category.categoryDesc}
                            onChange={(e) => setCourse({ ...course, courseTitle: e.target.value })}
                        />
                    </div>
                    <div className='form-control'>
                        <h2>Course Description</h2>
                        <input
                            id='categoryDesc'
                            required
                            placeholder='Enter Course Description'
                            // value={category.categoryDesc}
                            onChange={(e) => setCourse({ ...course, courseDesc: e.target.value })}
                        />
                    </div>
                    <div className='form-control'>
                        <h2>About Course</h2>
                        <input
                            id='categoryDesc'
                            required
                            placeholder='Enter The About Course Description'
                            // value={category.categoryDesc}
                            onChange={(e) => setCourse({ ...course, aboutCourse: e.target.value })}
                        />
                    </div>
                    <div className='form-control'>
                        <h2>Course Image</h2>
                        <input id='courseDesc' className='professorImg' required type="file"  ref={coverImage} />
                    </div>
                    <div className='form-control'>
                        <h2>Course Duration</h2>
                        <input
                            id='categoryDesc'
                            required
                            placeholder='Enter Course Duration in minutes'
                            // value={category.categoryDesc}
                            onChange={(e) => setCourse({ ...course, courseDuration: e.target.value })}
                        />
                    </div>
                    <div className='form-control'>
                        <h2>Course Link</h2>
                        <input
                            id='categoryDesc'
                            required
                            placeholder='Enter Course Link'
                            // value={category.categoryDesc}
                            onChange={(e) => setCourse({ ...course, courseLink: e.target.value })}
                        />
                    </div>
                    <div className='btn-container'>
                        <button type="submit" className='add-button'>Add</button>

                        <Link reloadDocument to={"/manageLearn"}>
                            <button className='cancel-button'>Cancel</button>
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default AddCourse
