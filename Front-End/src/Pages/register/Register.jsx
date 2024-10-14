import React, { useRef, useState } from "react";
import "./Register.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { setAuthUser } from "../../localStorage/storage";
// import Skills from "../../components/skills/Skills";
// import Languages from "../../components/languages/Languages";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
// import "./Skills.scss";
import $ from "jquery";

function Register() {
  var [selectedSkillsOptions, setSelectedSkillsOptions] = useState();

  var [selectedLanguagesOptions, setSelectedLanguagesOptions] = useState();

  const [user, setUser] = useState({
    err: null,
    loading: false,
    name: "",
    email: "",
    password: "",
    image: "",
    country: "",
    role: "client",
    skills: "",
    languages: "",
    desc: "",
    countryCode: "",
    phoneNumber: "",
    specialization: "",
  });

  // const processData = (data) => {
  //   // console.log(user.skills);
  //   // const data = user.skills;
  //   // const processedData = data[0].split(",");
  //   console.log(data);
  //   // console.log(processedData);
  //   // return processedData;
  //   // console.log(skills.slice(0,1));
  // }

  const navigate = useNavigate();

  const image = useRef(null);

  // var skillsData;

  const processData = (data) => {

    console.log(data);
    const processedData = data[0].split(",");
    console.log(processedData);
    setSelectedSkillsOptions(processedData);
    return processedData;
  }

  const addUserData = async (e) => {
    e.preventDefault();

    setUser({ ...user, loading: true, err: null });
    // const url = await upload(file);

    // console.log(getAuthUser().id);

    const formData = new FormData();

    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("country", user.country);
    formData.append("image", image.current.files[0]);
    formData.append("phoneNumber", user.countryCode + user.phoneNumber);
    formData.append("desc", user.desc);
    formData.append("skills", selectedSkillsOptions);
    formData.append("languages", selectedLanguagesOptions);
    formData.append("specialization", user.specialization);

    axios
      .post("http://localhost:3000/api/auth/signup/" + user.role, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        // swal(
        //   "Congratulations you have Joined WorkHub Successfully",
        //   "",
        //   "success"
        // );
        console.log(resp.data.message);
        console.log(resp.data.userData);
        if (user?.role == "freelancer") {
          resp.data.userData.skills = processData(resp.data.userData.skills);
          resp.data.userData.languages = processData(resp.data.userData.languages);
        }
        // const processedSkills = resp.data.userData.skills;
        // const processedLanguages = resp.data.userData.languages;
        // setUser({ skills: processedSkills, languages: processedLanguages});
        setAuthUser(resp.data.userData);
        navigate("/gigs");
        window.location.reload();
        // navigate("/gigs", { state: { SOME_OBJECT } });
      })
      .catch((errors) => {
        swal(errors.response.data.message, "", "error");
        console.log(errors);
        console.log(errors.response.data.message);
      });
  };

  // const handleChange = (e) => {
  //   console.log(e.target.value);
  //   setUser((prev) => {
  //     return { ...prev, [e.target.name]: e.target.value };
  //   });
  // };
  // console.log(user);

  const handleRole = (e) => {
    console.log(e.target.checked);
    if (e.target.checked == true) {
      setUser((prev) => {
        return { ...prev, role: "freelancer" };
      });
    } else {
      setUser((prev) => {
        return { ...prev, role: "client" };
      });
    }
  };


  const handleSkillsChange = (event, newValue) => {
    // setSelectedSkillsOptions(newValue);
    selectedSkillsOptions = newValue;
    console.log(newValue);
    console.log(selectedSkillsOptions);
  };

  const handleLanguagesChange = (event, newValue) => {
    // setSelectedLanguagesOptions(newValue);
    selectedLanguagesOptions = newValue;
    console.log(newValue);
    console.log(selectedLanguagesOptions);
  };

  const submit = () => {
    $(".MuiIconButton-sizeMedium").click();
  }

  return (
    <div className="registerPage">
      <h1 className="signUpTitle">Sign Up</h1>
      <div className="registerContainer">
        <div className="register">
          <form onSubmit={addUserData}>
            <div className="left">
              <h1 className="createAccount">Create a new account</h1>
              <label className="singupDesc" htmlFor="">
                Name
              </label>
              <input
                className="Input"
                name="name"
                type="text"
                placeholder="Enter your Name"
                required
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
              <label className="singupDesc" htmlFor="">
                Email
              </label>
              <input
                className="Input"
                name="email"
                type="email"
                placeholder="Enter your Email"
                required
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <label className="singupDesc" htmlFor="">
                Password
              </label>
              <input
                className="Input"
                name="password"
                type="password"
                placeholder="Enter your Password"
                required
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />

              <label className="singupDesc" htmlFor="">
                Profile Picture
              </label>
              <input 
              required 
              className="Input" 
              type="file" 
              ref={image} 
              accept="image/*" 
              />              
              <label className="singupDesc" htmlFor="">
                Country
              </label>
              <select
                name="country"
                type="text"
                required
                onChange={(e) => setUser({ ...user, country: e.target.value })}
              >
                <option value={""} disabled selected>
                  Select Country
                </option>
                <option value="Afghanistan">Afghanistan</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Andorra">Andorra</option>
                    <option value="Angola">Angola</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahamas">Bahamas</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Barbados">Barbados</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Belize">Belize</option>
                    <option value="Benin">Benin</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Brunei">Brunei</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Cabo Verde">Cabo Verde</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Canada">Canada</option>
                    <option value="Central African Republic">Central African Republic</option>
                    <option value="Chad">Chad</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Comoros">Comoros</option>
                    <option value="Congo (Congo-Brazzaville)">Congo</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Dominica">Dominica</option>
                    <option value="Dominican Republic">Dominican Republic</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Egypt">Egypt</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Eswatini (fmr. Swaziland)">Eswatini</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Fiji">Fiji</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Greece">Greece</option>
                    <option value="Grenada">Grenada</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Guinea-Bissau">Guinea-Bissau</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Haiti">Haiti</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Iceland">Iceland</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran">Iran</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Italy">Italy</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Japan">Japan</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kiribati">Kiribati</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                    <option value="Laos">Laos</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Libya">Libya</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Mali">Mali</option>
                    <option value="Malta">Malta</option>
                    <option value="Marshall Islands">Marshall Islands</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Micronesia">Micronesia</option>
                    <option value="Moldova">Moldova</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Nauru">Nauru</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Niger">Niger</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="North Korea">North Korea</option>
                    <option value="North Macedonia">North Macedonia</option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Palau">Palau</option>
                    <option value="Palestine State">Palestine State</option>
                    <option value="Panama">Panama</option>
                    <option value="Papua New Guinea">Papua New Guinea</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Romania">Romania</option>
                    <option value="Russia">Russia</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                    <option value="Saint Lucia">Saint Lucia</option>
                    <option value="Samoa">Samoa</option>
                    <option value="San Marino">San Marino</option>
                    <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Solomon Islands">Solomon Islands</option>
                    <option value="Somalia">Somalia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Korea">South Korea</option>
                    <option value="South Sudan">South Sudan</option>
                    <option value="Spain">Spain</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Sudan">Sudan</option>
                    <option value="Suriname">Suriname</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Syria">Syria</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="Tajikistan">Tajikistan</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Timor-Leste">Timor-Leste</option>
                    <option value="Togo">Togo</option>
                    <option value="Tonga">Tonga</option>
                    <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Turkmenistan">Turkmenistan</option>
                    <option value="Tuvalu">Tuvalu</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Uzbekistan">Uzbekistan</option>
                    <option value="Vanuatu">Vanuatu</option>
                    <option value="Vatican City">Vatican City</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                  </select>
              <button className="registerButton" type="submit">
                Register
              </button>
            </div>
            <div className="right">
              <h1 className="becomeSeller">I want to become a freelancer</h1>
              <div className="toggle">
                <label htmlFor="">Activate the freelancer account</label>
                <label className="switch">
                  <input type="checkbox" onChange={handleRole} />
                  <span className="slider round"></span>
                </label>
              </div>
              {user?.role == "freelancer" && (
                <>
                  <label className="phoneNo" htmlFor="">
                    Phone Number
                  </label>
                  <div className="phoneNumberContainer">
                    <select
                    className="countryCodeSelect"
                    name="countryCode"
                    defaultValue="+44"
                    required
                    onChange={(e) => {
                      setUser({ ...user, countryCode: e.target.value });
                    }}
                  >
                    <option value="" disabled selected>Select Country Code</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+1">+1 (USA)</option>
                    <option value="+20">+20 (Egypt)</option>
                    <option value="+33">+33 (France)</option>
                    <option value="+61">+61 (Australia)</option>
                    <option value="+91">+91 (India)</option>
                    <option value="+91">+966 (Saudi Arabia)</option>
                    <option value="+81">+81 (Japan)</option>
                    <option value="+49">+49 (Germany)</option>
                    <option value="+86">+86 (China)</option>
                    <option value="+55">+55 (Brazil)</option>
                    <option value="+27">+27 (South Africa)</option>
                    <option value="+7">+7 (Russia)</option>
                    <option value="+34">+34 (Spain)</option>
                    <option value="+39">+39 (Italy)</option>
                    <option value="+52">+52 (Mexico)</option>
                    <option value="+62">+62 (Indonesia)</option>
                    <option value="+63">+63 (Philippines)</option>
                    <option value="+65">+65 (Singapore)</option>
                    <option value="+66">+66 (Thailand)</option>
                    <option value="+82">+82 (South Korea)</option>
                    <option value="+90">+90 (Turkey)</option>
                    <option value="+32">+32 (Belgium)</option>
                    <option value="+31">+31 (Netherlands)</option>
                    <option value="+41">+41 (Switzerland)</option>
                    <option value="+46">+46 (Sweden)</option>
                    <option value="+48">+48 (Poland)</option>
                    <option value="+47">+47 (Norway)</option>
                    <option value="+43">+43 (Austria)</option>
                    <option value="+45">+45 (Denmark)</option>
                    <option value="+351">+351 (Portugal)</option>
                    <option value="+420">+420 (Czech Republic)</option>
                    <option value="+386">+386 (Slovenia)</option>
                    <option value="+372">+372 (Estonia)</option>
                    <option value="+371">+371 (Latvia)</option>
                    <option value="+370">+370 (Lithuania)</option>
                    <option value="+358">+358 (Finland)</option>
                    <option value="+380">+380 (Ukraine)</option>
                    <option value="+375">+375 (Belarus)</option>
                    <option value="+373">+373 (Moldova)</option>
                    <option value="+995">+995 (Georgia)</option>
                    <option value="+374">+374 (Armenia)</option>
                    <option value="+994">+994 (Azerbaijan)</option>
                    <option value="+387">+387 (Bosnia and Herzegovina)</option>
                    <option value="+389">+389 (North Macedonia)</option>
                    <option value="+381">+381 (Serbia)</option>
                    <option value="+382">+382 (Montenegro)</option>
                    <option value="+383">+383 (Kosovo)</option>
                    <option value="+372">+372 (Estonia)</option>
                    <option value="+359">+359 (Bulgaria)</option>
                    <option value="+355">+355 (Albania)</option>
                    <option value="+386">+386 (Slovenia)</option>
                    <option value="+423">+423 (Liechtenstein)</option>
                  </select>
                    <input
                        className="phoneNoInput"
                        name="phoneNumber"
                        type="tel"
                        required
                        pattern="^+\?[1-9]\d{1,14}$"
                        placeholder="123-456-7890"
                        onChange={(e) =>
                          setUser({ ...user, phoneNumber: e.target.value })
                        }
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }}
                    />
                  </div>
                  <label className="singupDesc" htmlFor="">
                    Description
                  </label>
                  <textarea
                    placeholder="A short desc of yourself"
                    name="desc"
                    id=""
                    cols="30"
                    rows="10"
                    required
                    onChange={(e) => setUser({ ...user, desc: e.target.value })}
                  ></textarea>
                  <label className="singupDesc" htmlFor="">
                    Specialization
                  </label>
                  <input
                    className="Input"
                    name="specialization"
                    type="text"
                    placeholder="Enter your Specialization"
                    required
                    onChange={(e) => setUser({ ...user, specialization: e.target.value })}
                  />
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
                      className="skillsInput"
                      multiple
                      id="tags-outlined"
                      options={top100Languages}
                      getOptionLabel={(option) => option}
                      value={selectedLanguagesOptions}
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
            </div>
          </form>
        </div>
      </div>
    </div>
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



export default Register;
