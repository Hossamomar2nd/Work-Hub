import React, { useState } from "react";
import "./Login.scss";
// import newRequest from "../../utils/newRequest.js";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import swal from 'sweetalert';
import { getAuthUser, setAuthUser } from '../../localStorage/storage';
import { Link } from "react-router-dom";


function Login() {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  let { id } = useParams();

  const navigate = useNavigate();

  const user = getAuthUser();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await newRequest.post("/auth/login", { username, password });
  //     localStorage.setItem("currentUser", JSON.stringify(res.data));
  //     navigate("/")
  //   } catch (err) {
  //     setError(err.response.data);
  //   }
  // };

  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
    loading: false,
    err: []
  });


  const processData = (data) => {
    console.log(data);
    const processedData = data[0].split(",");
    console.log(processedData);
    return processedData;
  }

  const userLoginFun = (e) => {
    e.preventDefault();
    setUserLogin({ ...userLogin, loading: true, err: [] });
    axios.post("http://localhost:3000/api/auth/login", {
      email: userLogin.email,
      password: userLogin.password,
    }).then((resp) => {
        setUserLogin({ ...userLogin, loading: false, err: [] });
        if(resp.data.userData.role == "freelancer") {
          resp.data.userData.skills = processData(resp.data.userData.skills);
          resp.data.userData.languages = processData(resp.data.userData.languages);
        }

        setAuthUser(resp.data.userData);
        if (resp.data.userData.role == "admin") {
          window.location = "http://localhost:3001/adminDashboard";
        }
        else {
          window.location = "http://localhost:3001/userDashboard";
        }
        // navigate("/gigs");
        // window.location.reload();
      }).catch((errors) => {
        console.log(errors.response);
        // swal(errors.response.data.msg, "", "error");
        setUserLogin({ ...userLogin, loading: false, err: errors.response.data.errors });
      })
  }

  return (
    <div className="loginContainer">
      <div className="loginLeft">
        <div className="imgDesc">
          <h1>Success starts here</h1>
          <p><img className="loginCheck" src="/img/loginCheck.png" />Over 600 categories</p>
          <p><img className="loginCheck" src="/img/loginCheck.png" />Pay per project, not per hour</p>
          <p><img className="loginCheck" src="/img/loginCheck.png" />Courses Platform</p>
          <p><img className="loginCheck" src="/img/loginCheck.png" />Access to talent and businesses across the globe</p>
        </div>
        <img className="loginPic" src="/img/loginPic.png" />
      </div>
      <div className="loginRight">
        <div className="login">

          <form onSubmit={userLoginFun}>
            <h1>Sign in to your account</h1>
            <label className="emailLabel" htmlFor="">Email</label>
            <input
              name="username"
              required
              type="email"
              value={userLogin.email}
              placeholder="Enter your Email"
              autoFocus
              onChange={(e) => setUserLogin({ ...userLogin, email: e.target.value })}
            />

            <label className="passLabel" htmlFor="">Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="Enter your Password"
              value={userLogin.password}
              onChange={(e) => setUserLogin({ ...userLogin, password: e.target.value })}
            />
            <button type="submit">Login</button>
            <span className="alreadyHaveAccount">New to WorHub ?<Link reloadDocument to={"/register"} className="alreadyHaveAccountLink"> Sign Up</Link></span> 
            {error && error}
          </form>
        </div>
        <div className="desc">
          <span>By joining, you agree to the WorkHub Terms of Service and to occasionally receive emails from us. Please read our Privacy Policy to learn how we use your personal data.</span>
        </div>
      </div>
    </div>
  );
}

export default Login;