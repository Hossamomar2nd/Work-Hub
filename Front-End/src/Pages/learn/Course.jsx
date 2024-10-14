import React, { useEffect, useState } from 'react'
import "./Course.scss"
import Slider from '../../Pages/gig/Slider';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import axios from "axios";
import swal from "sweetalert";
import { getAuthUser } from "../../localStorage/storage";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';



function Course() {
    const user = getAuthUser();
    const { pathname } = useLocation();

    const [courseContainer, setCourseContainer] = useState({
        loading: false,
    });

    const [freelancer, setFreelancer] = useState({
        err: null,
        loading: false,
        id: "65fa0541cb3af93721ac2647"
    });

    // const [conversation, setConversation] = useState({
    //   err: null,
    //   loading: false,
    //   id: "123456"
    // });

    const navigate = useNavigate();

    const message = (e) => {
        // console.log(e.target.value);
        const freelancerId = e.target.value;

        axios
            .post("http://localhost:3000/api/conversations/addConversation", {
                freelancer: freelancerId,
                client: user._id
            })
            .then((resp) => {
                const conversationId = resp.data.newConversationData[0]._id;
                // console.log(resp.data.newConversationData[0]._id);
                navigate("/message/" + conversationId);
            })
            .catch((errors) => {
                console.log(errors);
                navigate("/messages");
            });
    }


    const [course, setCourse] = useState({
        loading: true,
        enrollStatus: null,
        results: null,
        err: null,
        reload: 0,
    });

    let { id } = useParams();

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/courses/getCourseById/" + id)
            .then((resp) => {
                let status = false;

                if(user.role == "freelancer") {
                    resp.data.courseData.enrolledFreelancersIds.filter((id) => {
                        if(id == user._id) {
                            status = true;
                        }
                    })
                }

                if(user.role == "client") {
                    resp.data.courseData.enrolledClientsIds.filter((id) => {
                        if(id == user._id) {
                            status = true;
                        }
                    })
                }

                setCourse({ results: resp.data.courseData, loading: false, err: null, enrollStatus: status });
            })
            .catch((err) => {
                console.log(err);
            });
    }, [course.reload]);


    const enrollCourse = () => {
        axios
        .put("http://localhost:3000/api/courses/enrollCourse/" + id + "/" + user._id + "/" + user.role)
        .then((resp) => {
            window.location.replace("http://localhost:3001/course/" + id);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const unenrollCourse = () => {
        axios
        .put("http://localhost:3000/api/courses/unenrollCourse/" + id + "/" + user._id + "/" + user.role)
        .then((resp) => {
            window.location.replace("http://localhost:3001/course/" + id);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const navigation = () => {
        window.location = "http://localhost:3001/login/";
    }

    return (
        <div className="course">
            <div className="courseContainer">
                <div className="left">
                    {course.loading == false &&
                        <>
                            <div className='breadcrumbsCourse'>
                              <Link reloadDocument className='learnHome' to="/learn"><span className='breadcrumbsCourseFirst'>Courses</span></Link> {'>'} <span className="breadcrumbsCourseSecond">{course.results.categoryId.categoryName}</span>
                            </div>
                            <h1 className='courseName'>{course.results.courseTitle}</h1>
                            <p className='courseDesc'>{course.results.courseDesc}</p>
                            <div className="courseInfo">
                                <img
                                    className="youtubeIcon"
                                    src="/img/youtube.png"
                                />
                                <span>1 video</span>
                                <img
                                    className="hourIcon"
                                    src="/img/hour.png"
                                />
                                <span>{course.results.courseDuration} Hours</span>
                            </div>
                            {course.enrollStatus == true &&
                                <Container>
                                    <div className="ratio ratio-16x9">
                                        <iframe src={course.results.courseLink} title="YouTube video" allowFullScreen></iframe>
                                    </div>
                                </Container>
                            }
                            <div className="professor">
                                <div className="user">
                                    <img
                                        src={course.results.proffImage_url}
                                    />
                                    <div className="info">
                                        <span className='professorName'>{course.results.proffName}</span>
                                        <span className='professorDesc'>{course.results.ProffDesc}</span>
                                        {/* {user?.role == "client" && (<button value={freelancer.id} onClick={message}>Contact Me</button>)} */}
                                    </div>
                                </div>
                            </div>

                            <div className='aboutCourse'>
                                <h2 className='aboutCourseHeader'>About This Course</h2>
                                <p className='aboutCourseDesc'>
                                    {course.results.courseDesc}
                                </p>
                            </div>
                        </>
                    }

                    <div className='requirement'>
                        <h3 className='requirementHeader'>Requirements</h3>
                        <ul className='requirementDesc'>
                            <li><span>Access to Internet</span> </li>
                            <li><span>Computer / Laptop / Mobile Device</span></li>
                        </ul>
                    </div>

                    <div className='thirdPart'>
                        <h4 className='thirdPartHeader'>What Is Included?</h4>
                        <div className="thirdPartDesc">
                            <img className='greenCheckImg' src="/img/greenCheckImg.png" />
                            <span>Immediate unlimited access to course materials</span>
                        </div>
                        <div className="thirdPartDesc">
                            <img className='greenCheckImg' src="/img/greenCheckImg.png" />
                            <span>30-day money-back guarantee</span>
                        </div>
                        <div className="thirdPartDesc">
                            <img className='greenCheckImg' src="/img/greenCheckImg.png" />
                            <span>Exercises and quizzes to help you put theory into practice to course materials</span>
                        </div>
                        <div className="thirdPartDesc">
                            <img className='greenCheckImg' src="/img/greenCheckImg.png" />
                            <span>English Closed Captions</span>
                        </div>
                        <div className="thirdPartDesc">
                            <img className='greenCheckImg' src="/img/greenCheckImg.png" />
                            <span>Suitable for mobile or desktop</span>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="features">
                        <div className="item">
                            <img src="/img/free.png" alt="" />
                            <span>Free courses forever</span>
                        </div>
                        <div className="item">
                            <img src="/img/infinity.png" alt="" />
                            <span>Unlimited access, anywhere, anytime</span>
                        </div>
                        <div className="item">
                            <img src="https://cdn-themes.thinkific.com/114242/358329/hand-vetted-1616701090.svg" alt="" />
                            <span>Learn from hand-vetted instructors, experts in their field</span>
                        </div>
                    </div>
                    {/* {user && user.role!== "admin" ? <button onClick={() => setCourseContainer({ ...courseContainer, loading: true })}>Enroll</button> 
                    :
                    <div className='adminBtnsContainer'>
                        <button className='updateBtn' onClick={() => setCourseContainer({ ...courseContainer, loading: true })}>Update</button>
                        <button className='deleteBtn' onClick={() => setCourseContainer({ ...courseContainer, loading: true })}>Delete</button>
                    </div>
                    } */}
                    {user && user?.role !== "admin" && course.results && course.enrollStatus == false && <button className='enrollBtn' onClick={enrollCourse}>Enroll</button>}
                    {user && user?.role !== "admin" && course.results && course.enrollStatus == true && <button className='unenrollBtn' onClick={unenrollCourse}>Unenroll</button>}
                    {!user && <button onClick={navigation} className='enrollBtn'>Enroll</button>}
                    {user && user?.role == "admin" &&
                        <div className='adminBtnsContainer'>
                            <button className='updateBtn'>Update</button>
                            <button className='deleteBtn'>Delete</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Course;
