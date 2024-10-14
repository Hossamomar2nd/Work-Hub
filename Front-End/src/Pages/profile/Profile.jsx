import "./Profile.scss";
import React, { useEffect, useRef, useState } from "react";
import GigCard from '../../components/GigCard/GigCard';
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getAuthUser } from '../../localStorage/storage';
import Alert from '@mui/material/Alert';

const Profile = () => {

    var [selectedSkillsOptions, setSelectedSkillsOptions] = useState();

    var [selectedLanguagesOptions, setSelectedLanguagesOptions] = useState();

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
            .get("http://localhost:3000/api/services/getFreelancerServices/" + id)
            .then((resp) => {
                setServices({ results: resp.data.services, loading: false, err: null });
                console.log(resp.data.services);

                console.log(resp);
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
                client: user?._id
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

    const processData = (data) => {

        console.log(data);
        const processedData = data[0].split(",");
        console.log(processedData);
        setSelectedSkillsOptions(processedData);
        return processedData;
    }

    const { pathname } = useLocation();

    const [freelancer, setFreelancer] = useState({
        loading: true,
        results: null,
        err: null,
        reload: 0,
    });

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/freelancers/getFreelancerById/" + id)
            .then((resp) => {
                resp.data.freelancer.skills = processData(resp.data.freelancer.skills);
                resp.data.freelancer.languages = processData(resp.data.freelancer.languages);
                setFreelancer({ results: resp.data.freelancer, loading: false, err: null });
                console.log(resp);
                console.log(resp.data.freelancer);
            })
            .catch((err) => {
                console.log(err);
                // setConversation({ ...conversation, loading: false, err: err.response.data.errors });
            });
    }, [freelancer.reload]);

    const showMoreSkills = (e) => {
        e.preventDefault();
        setSkillsArrayLength(freelancer?.results.skills.length);
        // console.log(skillsArrayLength);
    }


    const [client, setClient] = useState({
        loading: true,
        results: null,
        err: null,
        reload: 0,
    });

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/clients/getClientById/" + id)
            .then((resp) => {
                setClient({ results: resp.data.client, loading: false, err: null });
                console.log(resp);
                console.log(resp.data.client);
            })
            .catch((err) => {
                console.log(err);
                // setConversation({ ...conversation, loading: false, err: err.response.data.errors });
            });
    }, [client.reload]);

    return (
        <div className='profile'>
            {freelancer?.loading == false &&
                <div className="profileContainer">
                    <div className="myServiceHeader"><h1>{freelancer?.results.name !== user?.name ? freelancer?.results.name + "'s Profile" : "My Profile"}</h1></div>
                    <div className="left">
                        <div className="profileUser">
                            <img
                                src={freelancer?.results.image_url}
                                alt=""
                            />
                            <img className="onlineImg" src={freelancer?.results.activityStatus == "online" ? "/img/online.png" : "/img/offline.png"}/>
                            <div className="info">
                                <span className='myName'>{freelancer?.results.name}</span>
                                <div className="freelancerSpecialization"><span>{freelancer?.results.specialization}</span></div>

                                <div className="userInfo">
                                    <img
                                        className="locationIcon"
                                        src="/img/location.png"
                                    />
                                    <span>{freelancer?.results.country}</span>

                                    {freelancer?.results.role == "freelancer" &&
                                        <>
                                            <img
                                                className="languageIcon"
                                                src="/img/profileLanguage.png"
                                            />
                                            <span className="languageContainer">{freelancer?.results.languages.map((language, index) => (
                                                <>
                                                    {language} {index !== freelancer?.results.languages.length - 1 ? ", " : null}
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
                                                src={freelancer?.results.image_url}
                                                alt=""
                                            />
                                            <img className="onlineImg" src={freelancer?.results.activityStatus == "online" ? "/img/online.png" : "/img/offline.png"}/>
                                            <div className="rightInfo">
                                                <span className='rightMyName'>{freelancer?.results.name}</span>
                                                <span className="onlineStatus">{freelancer?.results.activityStatus}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {user?.role == "client" && <button value={id} onClick={message}><img src="/img/send.png" />Contact Me</button>}
                                    {id == user?._id && <Link reloadDocument to={"/updateProfile"}><button value={id}><img src="/img/profileOption.png" />Update Profile</button></Link>}
                                </div>
                            </div>
                        </div>

                        {freelancer?.results.role == "freelancer" &&
                            <>
                                <div className='aboutUser'>
                                    <h2 className='aboutUserHeader'>About me</h2>
                                    <div className='aboutUserDesc'>
                                        <p>
                                            {freelancer?.results.desc}
                                        </p>
                                    </div>
                                </div>

                                <div className='skills'>
                                    <h2 className='skillsHeader'>Skills</h2>
                                    <ul className='skillsDesc'>
                                        {freelancer?.results.skills.slice(0, skillsArrayLength).map((skill) => (
                                            <li className={skill.split(" ").length > 2 ? "style" : null}>{skill}</li>
                                        ))}
                                    </ul>
                                    {freelancer?.results.skills.length > skillsArrayLength && <Link onClick={showMoreSkills} className="showMore">+{freelancer?.results.skills.length - 5}</Link>}
                                </div>
                            </>
                        }
                    </div>

                    {freelancer?.results.role == "freelancer" &&
                        <div className="myServiceSection">
                            <div className="myServiceHeader"><h2>{freelancer?.results.name !== user?.name ? freelancer?.results.name + "'s Services" : "My Services"}</h2></div>
                            <Link reloadDocument to={"/add"}><button className="addNewServiceBtn">Add New Service</button></Link>
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

                    {services.err !== null && services.loading == false && services.results == null && freelancer?.results.role == "freelancer" &&
                        <div>
                            <Alert severity="error">{services.err}</Alert>
                        </div>
                    }
                </div>
            }

            {client?.loading == false &&
                <div className="profileContainer">
                    <div className="myServiceHeader"><h1>{client?.results.name !== user?.name ? client?.results.name + "'s Profile" : "My Profile"}</h1></div>
                    <div className="left">
                        <div className="profileUser">
                            <img
                                src={client?.results.image_url}
                                alt=""
                            />
                            <img className="onlineImg" src={client?.results.activityStatus == "online" ? "/img/online.png" : "/img/offline.png"}/>
                            <div className="info">
                                <span className='myName'>{client?.results.name}</span>
                                <div className="userInfo">
                                    <img
                                        className="locationIcon"
                                        src="/img/location.png"
                                    />
                                    <span>{client?.results.country}</span>

                                    {/* {freelancer?.results.role == "freelancer" &&
                                        <>
                                            <img
                                                className="languageIcon"
                                                src="/img/profileLanguage.png"
                                            />
                                            <span className="languageContainer">{freelancer?.results.languages.map((language, index) => (
                                                <>
                                                    {language} {index !== freelancer?.results.languages.length - 1 ? ", " : null}
                                                </>
                                            ))}</span>
                                        </>
                                    } */}
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
                                                src={client?.results.image_url}
                                                alt=""
                                            />
                                            <img className="onlineImg" src={client?.results.activityStatus == "online" ? "/img/online.png" : "/img/offline.png"}/>
                                            <div className="rightInfo">
                                                <span className='rightMyName'>{client?.results.name}</span>
                                                <span className="onlineStatus">{client?.results.activityStatus}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {user && user.role !== "admin" && client?.results._id !== user._id && (
                                        <button value={id} onClick={message}><img src="/img/send.png" />Contact Me</button>
                                    )}
                                    {id == user?._id && <Link reloadDocument to={"/updateProfile"}><button value={id}><img src="/img/profileOption.png" />Update Profile</button></Link>}
                                </div>
                            </div>
                        </div>

                        {/* {freelancer?.results.role == "freelancer" &&
                            <>
                                <div className='aboutUser'>
                                    <h2 className='aboutUserHeader'>About me</h2>
                                    <div className='aboutUserDesc'>
                                        <p>
                                            {freelancer?.results.desc}
                                        </p>
                                    </div>
                                </div>

                                <div className='skills'>
                                    <h2 className='skillsHeader'>Skills</h2>
                                    <ul className='skillsDesc'>
                                        {freelancer?.results.skills.slice(0, skillsArrayLength).map((skill) => (
                                            <li className={skill.split(" ").length > 2 ? "style" : null}>{skill}</li>
                                        ))}
                                    </ul>
                                    {freelancer?.results.skills.length > skillsArrayLength && <Link onClick={showMoreSkills} className="showMore">+{freelancer?.results.skills.length - 5}</Link>}
                                </div>
                            </>
                        } */}
                    </div>

                    {/* {freelancer?.results.role == "freelancer" &&
                        <div className="myServiceSection">
                            <div className="myServiceHeader"><h2>{freelancer?.results.name !== user?.name ? freelancer?.results.name + "'s Services" : "My Services"}</h2></div>
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

                    {services.err !== null && services.loading == false && services.results == null && freelancer?.results.role == "freelancer" &&
                        <div>
                            <Alert severity="error">{services.err}</Alert>
                        </div>
                    } */}
                </div>
            }



        </div>

    )
}

export default Profile