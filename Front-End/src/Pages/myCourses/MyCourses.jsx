import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MyCourses.scss";
import { getAuthUser } from "../../localStorage/storage";
import axios from "axios";
import LearnCard from "../../components/LearnCard/LearnCard";
import Alert from "@mui/material/Alert";

function MyCourses() {
  const user = getAuthUser();

  const [courses, setCourses] = useState({
    loading: false,
    results: null,
    err: null,
    reload: 0,
  });

  useEffect(() => {
    setCourses({ loading: true });

    axios
      .get(
        "http://localhost:3000/api/courses/getEnrolledCourses/" +
          user._id +
          "/" +
          user.role
      )
      .then((resp) => {
        setCourses({
          results: resp.data.coursesData,
          loading: false,
          err: null,
        });
      })
      .catch((err) => {
        console.log(err);
        setCourses({ ...courses, loading: false, err: err.response.data.msg });

      });
  }, [courses.reload]);

  return (
    <div className="myCourses">
      <div className="title">
        <h1>Enrolled Courses</h1>
      </div>
      <div className='breadcrumbsCourse'>
        <Link reloadDocument className='learnHome' to="/learn"><img className="learningImg" src="./img/learning.png" /><span className='breadcrumbsCourseFirst'>Courses</span></Link> {'>'} <span className="breadcrumbsCourseSecond">My Courses</span>
      </div>
      <div className="myCoursesContainer">
        {courses.results &&
          courses.results.map((course) => (
            <LearnCard key={course._id} item={course} />
          ))}
      </div>
      {courses.err !== null &&
        <div className='communityFilterAlert'>
          <Alert severity="info">{courses.err}</Alert>
        </div>
      }
    </div>
  );
}

export default MyCourses;
