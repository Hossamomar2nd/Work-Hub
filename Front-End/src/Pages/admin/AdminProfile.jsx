import React, { useRef, useState } from "react";
import "./AdminProfile.scss";
import { sidebarStatus } from "../../App";
import { Link } from "react-router-dom";
import { getAuthUser } from "../../localStorage/storage";


function UpdateProfile() {

    const user = getAuthUser();
    const [courseContainer, setCourseContainer] = useState({
        loading: false,
    });
    return (
        <section className={sidebarStatus() ? 'adminProfilePage' : 'adminProfilePage sidebar-close-adminProfile'}>
            <h1>My Profile</h1>
            <div className="adminProfileContainer">
                <div className="adminProfile">
                    <div className="top">
                        <img className='adminProfileImage' src={user.image_url} />
                    </div>
                    <div className="bottom">
                        <h2 htmlFor="">Name: <span>{user.name}</span></h2>
                        <h2 htmlFor="">Email: <span>{user.email}</span></h2>
                        <button onClick={() => setCourseContainer({ ...courseContainer, loading: true })} className="updateAdminProfilebtn">Update Pofile</button>
                    </div>
                </div>
            </div>
            {courseContainer?.loading == true &&
                <div className="updateAdminProfileContainer">
                    <div className="updateAdminProfile">
                        <div className="top">
                            <img className='updateAdminProfileImage' src="/img/profile.jpg" />
                        </div>
                        <div className="bottom">
                            <section className="updateAdminProfileForm">
                                <form>
                                    <div className="form-control">
                                        <h2>Name</h2>
                                        <input
                                            placeholder="Enter Name"                                            
                                        />
                                    </div>
                                    <div className="form-control">
                                        <h2>Email</h2>
                                        <input
                                            placeholder="Enter Description"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <h2>Phone Number</h2>
                                        <input
                                            placeholder="Enter Description"
                                        />
                                    </div>
                                    <div className="updateAdminProfile-btn-container">
                                        <button type="submit" className="update-button">
                                            Update
                                        </button>
                                        <Link reloadDocument to={"/adminProfile"}>
                                            <button className="cancel-button">Cancel</button>
                                        </Link>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            }
        </section>
    );
}

export default UpdateProfile;