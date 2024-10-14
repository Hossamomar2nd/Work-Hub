import "./ClientProfile.scss";
import React, { useEffect, useRef, useState } from "react";
import GigCard from '../../components/GigCard/GigCard';
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getAuthUser } from '../../localStorage/storage';
import Alert from '@mui/material/Alert';

const ClientProfile = () => {

    const user = getAuthUser();

    let { id } = useParams();

    const [services, setServices] = useState({
        loading: false,
        results: null,
        err: null,
        reload: 0,
    });

    useEffect(() => {
        setServices({ loading: true });

        axios
            .get("http://localhost:3000/api/services/getFreelancerServices/" + user._id)
            .then((resp) => {
                setServices({ results: resp.data.services, loading: false, err: null });
                console.log(resp.data.services);
            })
            .catch((err) => {
                setServices({ loading: false, err: err.response.data.msg });
                console.log(err);
                // setConversation({ ...conversation, loading: false, err: err.response.data.errors });
            });
    }, [services.reload]);


    // useEffect(() => {
    //     axios
    //         .get("http://localhost:3000/api/freelancers/getFreelancerById/" + user._id)
    //         .then((resp) => {
    //             // setServices({ results: resp.data.services, loading: false, err: null });
    //             console.log(resp);
    //             console.log(resp.data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             // setConversation({ ...conversation, loading: false, err: err.response.data.errors });
    //         });
    // });


    const [sort, setSort] = useState("sales");
    const [open, setOpen] = useState(false);
    // var skills;

    const minRef = useRef();
    const maxRef = useRef();

    // const processSkills = () => {
    //     // console.log(user.skills);
    //     const data = user.skills;
    //     const processedData = data[0].split(",");
    //     // console.log(processedData);
    //     skills = processedData;
    //     // console.log(skills.slice(0,1));
    // }

    // processSkills();

    const [skillsArrayLength, setSkillsArrayLength] = useState(5);

    const showMoreSkills = () => {
        setSkillsArrayLength(user.skills.length)
        // console.log(skillsArrayLength);
    }


    const reSort = (type) => {
        setSort(type);
        setOpen(false);
    };

    const apply = () => {
        console.log(minRef.current.value)
        console.log(maxRef.current.value)
    }

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

    const { pathname } = useLocation();


    

    return (
        <div className='usersProfile'>
            <div className="usersProfileContainer">
                <div className="myServiceHeader"><h1>My Profile</h1></div>
                <div className="left">
                    <div className="profileUser">
                        <img
                            src={user.image_url}
                            alt=""
                        />
                        <div className="info">
                            <span className='myName'>{user.name}</span>
                            <div className="userInfo">
                                <img
                                    className="locationIcon"
                                    src="/img/location.png"
                                />
                                <span>{user.country}</span>

                                {user && user?.role == "freelancer" &&
                                    <>
                                        <img
                                            className="languageIcon"
                                            src="/img/profileLanguage.png"
                                        />
                                        <span className="languageContainer">{user.languages.map((language,index) => (
                                        <>
                                                {language} {index !== user.languages.length - 1 ? ", " : null}
                                        </> 
                                        ))}</span>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="rightContainer">
                            {/* <div className="option">
                            <Link to={"/updateProfile"}><button><img src="/img/profileOption.png" />Edit Profile</button></Link>
                        </div> */}
                            <div className="right">
                                <div className="rightFeatures">
                                    <div className="rightProfileUser">
                                        <img
                                            src={user.image_url}
                                            alt=""
                                        />
                                        <div className="rightInfo">
                                            <span className='rightMyName'>{user.name}</span>
                                        </div>
                                    </div>
                                </div>
                                {user.role == "client" && <button value={id} onClick={message}><img src="/img/send.png" />Contact Me</button>}
                                {pathname == "/profile" && user.role == "freelancer" && <Link to={"/updateProfile"}><button value={id}><img src="/img/profileOption.png" />Update</button></Link>}
                            </div>
                        </div>
                    </div>

                    {user && user?.role == "freelancer" &&
                        <div className='aboutUser'>
                            <h2 className='aboutUserHeader'>About me</h2>
                            <div className='aboutUserDesc'>
                                <p>
                                    {user.desc}
                                </p>
                            </div>
                        </div>
                    }

                    {user && user?.role == "freelancer" &&
                        <div className='skills'>
                            <h2 className='skillsHeader'>Skills</h2>
                            <ul className='skillsDesc'>
                                {user.skills.slice(0, skillsArrayLength).map((skill) => (
                                    <li className={skill.split(" ").length > 2 ? "style" : null}>{skill}</li>
                                ))}
                            </ul>
                            {user.skills.length > skillsArrayLength && <Link onClick={showMoreSkills} className="showMore">+{user.skills.length - 5}</Link>}
                        </div>
                    }
                </div>
                
                {user && user?.role == "freelancer" &&
                    <div className="myServiceSection">
                        <div className="myServiceHeader"><h2>My Services</h2></div>
                        <div className="myServiceGigsCards">
                            {services.loading == false &&
                                services.err == null &&
                                services.results &&
                                services.results.length > 0 &&
                                services.results.map((service) => (
                                    <GigCard key={service._id} item={service} />
                                ))}
                        </div>
                    </div>
                }

                {services.err != null && services.loading == false && services.results == null && user && user?.role == "freelancer" &&
                    <div>
                        <Alert severity="error">{services.err}</Alert>
                    </div>
                }
            </div>
        </div>
    )
}

export default ClientProfile