import React, { useEffect, useRef, useState } from "react";
import "./UpdateProfile.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { setAuthUser } from "../../localStorage/storage";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
// import "./Skills.scss";
import $ from "jquery";
import { getAuthUser } from "../../localStorage/storage";

function UpdateProfile() {
    var [selectedSkillsOptions, setSelectedSkillsOptions] = useState();

    var [selectedLanguagesOptions, setSelectedLanguagesOptions] = useState();

    const handleSkillsChange = (event, newValue) => {
        setSelectedSkillsOptions(newValue);
        selectedSkillsOptions = newValue;
        console.log(newValue);
        console.log(selectedSkillsOptions);
    };

    const handleLanguagesChange = (event, newValue) => {
        setSelectedLanguagesOptions(newValue);
        selectedLanguagesOptions = newValue;
        console.log(newValue);
        console.log(selectedLanguagesOptions);
    };


    const processData = (data) => {
        // console.log(user.skills);
    
        // const data = skillsData;
        console.log(data);
        const processedData = data[0].split(",");
        console.log(processedData);
        // setSelectedSkillsOptions(processedData);
        return processedData;
      }

    const submit = () => {
        $(".MuiIconButton-sizeMedium").click();
    }

    let { id } = useParams();

    const users = getAuthUser();

    const image = useRef(null);

    const [user, setUser] = useState({
        err: null,
        loading: false,
        name: "",
        email: "",
        country: "",
        desc: "",
        phoneNumber: "",
        skills: "",
        languages: "",
    });

    const navigate = useNavigate();


    const updateUserData = async (e) => {
        e.preventDefault();

        setUser({ loading: true, err: null });

        // const url = await upload(file);

        // console.log(getAuthUser().id);

        const formData = new FormData();

        formData.append("name", user?.name);
        formData.append("email", user?.email);
        // formData.append("password", user.password);
        formData.append("country", user?.country);
        formData.append("image", image?.current.files[0]);
        formData.append("phoneNumber", user?.phoneNumber);
        formData.append("desc", user?.desc);
        
        if(selectedSkillsOptions == undefined) {
            formData.append("skills", user?.skills);
        }
        else {
            formData.append("skills", selectedSkillsOptions);
        }

        if(selectedLanguagesOptions == undefined) {
            formData.append("languages", user?.languages);
        }
        else {
            formData.append("languages", selectedLanguagesOptions);
        }

        // console.log(selectedSkillsOptions);
        // console.log(selectedLanguagesOptions);

        axios
            .put("http://localhost:3000/api/freelancers/updateFreelancerInfo/" + users._id, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((resp) => {
                // setUser({
                //     ...user,
                //     loading: false,
                //     err: null,
                //     name: "",
                //     email: "",
                //     password: "",
                //     country: "",
                //     role: "client",
                //     desc: "",
                //     phoneNumber: "",
                // });
                // image.current.value = null;
                swal(resp.data.msg, "", "success");
                console.log(resp.data);
                console.log(resp.data.freelancerNewData);
                if(resp.data.freelancerNewData.role == "freelancer") {
                    resp.data.freelancerNewData.skills = processData(resp.data.freelancerNewData.skills);
                    resp.data.freelancerNewData.languages = processData(resp.data.freelancerNewData.languages);
                }
                setAuthUser(resp.data.freelancerNewData);
                navigate("/profile/" + users?._id);
            })
            .catch((errors) => {
                // setUser({
                //     ...user,
                //     loading: false,
                //     err: errors.response.data.errors,
                //     name: "",
                //     email: "",
                //     password: "",
                //     country: "",
                //     role: "client",
                //     desc: "",
                //     phoneNumber: "",
                // });
                // image.current.value = null;
                // swal(medicine.err.msg,"","error");
                console.log(errors);
            });
    };

    useEffect(() => {
        setUser({ ...user, loading: true });
        axios
          .get("http://localhost:3000/api/freelancers/getFreelancerById/" + users._id)
          .then((resp) => {
            console.log(resp);
            setUser({
              ...user,
              name: resp.data.freelancer.name,
              desc: resp.data.freelancer.desc,
              email: resp.data.freelancer.email,
              country: resp.data.freelancer.country,
              phoneNumber: resp.data.freelancer.phoneNumber,
              skills: resp.data.freelancer.skills,
              languages: resp.data.freelancer.languages,
              loading: false,
              err: null,
            });
          })
          .catch((err) => {
            console.log(err);
            // setUser({ ...user, loading: false, err: err });
          });
      }, []);


    // const handleChange = (e) => {
    //   console.log(e.target.value);
    //   setUser((prev) => {
    //     return { ...prev, [e.target.name]: e.target.value };
    //   });
    // };
    // console.log(user);

    const handleSeller = (e) => {
        console.log(e.target.checked);
        if (e.target.checked == true) {
            setUser((prev) => {
                return { ...prev, role: "freelancer" };
            });
        }
        else {
            setUser((prev) => {
                return { ...prev, role: "client" };
            });
        }
    };

    // const handleSubmit = async (e) => {
    //   e.preventDefault();

    //   const url = await upload(file);
    //   try {
    //     await newRequest.post("/auth/register", {
    //       ...user,
    //       image: url,
    //     });
    //     navigate("/")
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };


    return (
        <section className='updateProfilePage'>
            <div className="updateProfileContainer">
                <div className="updateProfile">
                    <form onSubmit={updateUserData}>
                        <div className="left">
                            <h1>Edit Profile</h1>
                            <label htmlFor="">Name</label>
                            <input
                                className="updateProfileInput"
                                name="name"
                                type="text"
                                // required
                                placeholder="Name"
                                value={user?.name}
                                onChange={(e) =>
                                    setUser({ ...user, name: e.target.value })
                                }
                            />
                            <label htmlFor="">Email</label>
                            <input
                                className="updateProfileInput"
                                value={user?.email}
                                name="email"
                                type="email"
                                placeholder="Email"
                                // required
                                onChange={(e) =>
                                    setUser({ ...user, email: e.target.value })
                                } />
                            {/* <label htmlFor="">Profile Picture</label>
                            <input type="file" ref={image} /> */}
                            <label htmlFor="">Country</label>

                            <select
                                name="country"
                                type="text"
                                // required
                                value={user?.country}
                                onChange={(e) =>
                                    setUser({ ...user, country: e.target.value })
                                }>
                                <option value={""} disabled selected>
                                    Select Country
                                </option>
                                <option value="Egypt">Egypt</option>
                                <option value="United States">United States</option>
                                <option value="England">England</option>
                                <option value="France">France</option>
                            </select>

                            <label htmlFor="">Profile Picture</label>
                            <input
                            className="updateProfileInput"
                            // required 
                            ref={image}
                            type="file" />
                            {users?.role == "freelancer" && (
                                <>
                                    <label className="phoneNo" htmlFor="">Phone Number</label>
                                    <input className="updateProfileInput"
                                        name="phoneNumber"
                                        type="text"
                                        placeholder="+20 1090559824"
                                        value={user?.phoneNumber}
                                        // required
                                        onChange={(e) =>
                                            setUser({ ...user, phoneNumber: e.target.value })
                                        }
                                    />
                                    <label className="singupDesc" htmlFor="">Description</label>
                                    <textarea
                                        placeholder="A short desc of yourself"
                                        name="desc"
                                        id=""
                                        cols="30"
                                        rows="10"
                                        value={user?.desc}
                                        // required
                                        onChange={(e) =>
                                            setUser({ ...user, desc: e.target.value })
                                        }
                                    ></textarea>
                                    <label className="singupDesc" htmlFor="">
                                        Skills
                                    </label>
                                    <Stack spacing={3} sx={{ width: 500 }}>
                                        <Autocomplete
                                            className="skillsInput"
                                            multiple
                                            id="tags-outlined"
                                            options={top100Skills}
                                            getOptionLabel={(option) => option}
                                            value={selectedSkillsOptions}
                                            // defaultValue={[users.skills.map((skill) => skill)]}
                                            defaultValue={users?.skills}
                                            onChange={handleSkillsChange}
                                            // onInputChange={handleInputChange}
                                            // onClose={handleCloseAutocomplete}
                                            // filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField {...params} label="" placeholder="Add Skill" />
                                            )}
                                        />
                                    </Stack>
                                    <label className="singupDesc" htmlFor="">
                                        Languages
                                    </label>
                                    <Stack spacing={3} sx={{ width: 500 }}>
                                        <Autocomplete
                                            multiple
                                            id="tags-outlined"
                                            options={top100Languages}
                                            getOptionLabel={(option) => option}
                                            value={selectedLanguagesOptions}
                                            defaultValue={users?.languages}
                                            onChange={handleLanguagesChange}
                                            // onInputChange={handleInputChange}
                                            // onClose={handleCloseAutocomplete}
                                            // filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label=""
                                                    placeholder="Add Language"
                                                />
                                            )}
                                        />
                                    </Stack>
                                </>
                            )}
                            <div className="update-cancel-btn">
                                <button className="updateProfileButton" type="submit">Update</button>

                                <Link reloadDocument to={"/profile/" + users?._id}><button className="cancelProfileButton" type="submit">Cancel</button></Link>
                            </div>
                            {/* )} */}
                        </div>
                    </form>
                    <div className="right">
                        <img className='updateProfileImage' src="/img/profile.jpg" />
                    </div>
                </div>
            </div>
            <img className='plus' src='img/plus.jpeg' />
            <img className='wave1' src='img/wave.jpeg' />
            <img className='wave2' src='img/wave.jpeg' />
            <img className='circle' src='img/circle.jpeg' />
        </section>
    );
}

const top100Languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Arabic",
    "Chinese",
    "Japanese",
    "Russian",
    "Italian",
    "Portuguese",
    "Hindi",
    "Bengali",
    "Punjabi",
    "Urdu",
    "Indonesian",
    "Turkish",
    "Dutch",
    "Polish",
    "Swedish",
    "Norwegian",
    "Danish",
    "Finnish",
    "Greek",
    "Korean",
    "Thai",
    "Vietnamese",
    "Hebrew",
    "Czech",
    "Hungarian",
    "Romanian",
    "Slovak",
    "Malay",
    "Ukrainian",
    "Bulgarian",
    "Serbian",
    "Croatian",
    "Slovenian",
    "Lithuanian",
    "Estonian",
    "Latvian",
    "Maltese",
    "Albanian",
    "Macedonian",
    "Montenegrin",
    "Luxembourgish",
    "Icelandic",
    "Gaelic",
    "Welsh",
    "Basque",
    "Catalan",
    "Galician",
    "Esperanto",
    "Klingon",
    "Esperanto",
    "Latin",
];


const top100Skills = [
    "JavaScript",
    "HTML",
    "CSS",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "SQL",
    "Python",
    "Java",
    "C#",
    "C++",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "Flutter",
    "Docker",
    "AWS",
    "Azure",
    "Google Cloud Platform",
    "Git",
    "Jenkins",
    "Kubernetes",
    "HTML5",
    "CSS3",
    "Sass",
    "Less",
    "Bootstrap",
    "Tailwind CSS",
    "Redux",
    "GraphQL",
    "RESTful API",
    "GraphQL API",
    "TypeScript",
    "Next.js",
    "Gatsby",
    "Spring Framework",
    "Hibernate",
    "ASP.NET",
    "Entity Framework",
    "Ruby on Rails",
    "Django",
    "Flask",
    "TensorFlow",
    "PyTorch",
    "Numpy",
    "Pandas",
    "Matplotlib",
    "Scikit-learn",
    "JUnit",
    "Mockito",
    "Cypress",
    "Jest",
    "Mocha",
    "Enzyme",
    "Chai",
    "Selenium",
    "JIRA",
    "Confluence",
    "Trello",
    "Slack",
    'Logo Design',
    'Illustration',
    'Branding',
    'Packaging Design',
    'Photoshop Editing',
    'Business Cards & Stationery',
    'Poster Design',
    'Flyer Design',
    'Brochure Design',
    'Label & Package Design',
    'Video Editing',
    'Animation',
    'Motion Graphics',
    'Explainer Videos',
    'Whiteboard Animation',
    'Intro & Outro Videos',
    'Short Video Ads',
    'Lyric & Music Videos',
    'Subtitles & Captions',
    'Visual Effects',
    'Copywriting',
    'Content Writing',
    'Blog Writing',
    'Article Writing',
    'Editing & Proofreading',
    'Translation',
    'Creative Writing',
    'Technical Writing',
    'Resume Writing',
    'Scriptwriting',
    'Machine Learning',
    'Natural Language Processing (NLP)',
    'Chatbot Development',
    'AI Model Deployment',
    'Image Recognition',
    'Speech Recognition',
    'Sentiment Analysis',
    'Predictive Analytics',
    'Recommendation Systems',
    'AI Consulting',
    'Social Media Marketing',
    'Search Engine Optimization (SEO)',
    'Pay-Per-Click Advertising (PPC)',
    'Content Marketing',
    'Email Marketing',
    'Influencer Marketing',
    'Affiliate Marketing',
    'Marketing Strategy',
    'Web Analytics',
    'Conversion Rate Optimization (CRO)',
    'Music Production',
    'Audio Editing',
    'Mixing & Mastering',
    'Sound Design',
    'Voice Over',
    'Jingles & Intros',
    'Foley Artist',
    'Podcast Editing',
    'Audio Restoration',
    'Music Transcription',
    'Web Development',
    'Mobile App Development',
    'Software Development',
    'Database Development',
    'DevOps',
    'Cloud Computing',
    'Cybersecurity',
    'Blockchain Development',
    'Game Development',
    'UI/UX Design',
    'Business Strategy',
    'Business Development',
    'Market Research',
    'Financial Consulting',
    'Project Management',
    'Accounting',
    'Legal Consulting',
    'Business Plan Writing',
    'Virtual Assistance',
    'HR Consulting',
];

export default UpdateProfile;
