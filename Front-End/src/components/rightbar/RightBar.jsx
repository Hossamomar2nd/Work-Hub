import React, { useEffect, useState } from 'react'
import axios from "axios";
import "./RightBar.scss"
import { getAuthUser } from '../../localStorage/storage';
import { Link, useParams } from 'react-router-dom';
import Button from "@mui/material/Button";
import { sidebarStatus } from '../../App';

const RightBar = ({ profile, item }) => {
  const user = getAuthUser();

  let { id } = useParams();


  const [members, setMembers] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

  useEffect(() => {
    setMembers({ ...members, loading: true });
    axios
      .get("http://localhost:3000/api/communities/getAllJoinedMembersCommunities")
      .then((resp) => {
        console.log(resp.data);
        setMembers({
          results: resp.data.modifiedMembers,
          loading: false,
          err: null,
        });
        console.log(resp);
      })
      .catch((err) => {
        setMembers({
          ...members,
          loading: false,
          err: err.response.data.msg,
        });
        console.log(err);
      });
  }, [members.reload]);



  const HomeRightbar = () => {
    return (
      <>
        <div className="imagesContainer">
          <div className="imgContainer_1">
            <img className='firstImg' src="/img/image_1.jpg" />
            <span className="imgText_1">Freelance services at your fingertips!</span>
          </div>
          <div className="imgContainer_2">
            <img className='secondImg' src="/img/image_2.jpg" />
            <span className="imgText_2">Find talent <br />your way</span>
          </div>
        </div>
      </>
    )
  }

  const ProfileRightbar = () => {
    return (
      <>
        <div className="rightbarInfo">
          <h4 className='rightbarTitle'>User information</h4>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Country:</span>
            <span className="rightbarInfoValue">{item.country}</span>
          </div>
         {user && item.role == "freelancer" && 
            <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Specialization:</span>
                <span className="rightbarInfoValue">{item.specialization}</span>
              </div>
          }
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Email:</span>
            <span className="rightbarInfoValue">{item.email}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Go to WorkHub Profile:</span>
            <span className="rightbarInfoValue"><Link className='goToProfileLink' reloadDocument to={"/profile/" + id}>{item.name}'s Profile</Link></span>
          </div>
        </div>
      </>
    )
  }

  const AdminRightbar = () => {
    return (
      <>
        <ul className="membersList">
          {members.loading == false &&
            members.err == null &&
            members.results.map((member) => (
              <li className="memberContainer">
                <Link className="memberInfo" to={""}>
                  <img src={member.image_url} className="memberImage" />
                  <span className="memberName">{member.name}</span>
                </Link>

                <Button variant="contained" className="blockBtn">
                  Block
                </Button>
              </li>
            ))}
        </ul>
      </>
    );
  };

  return (
    <>
      {user && user.role == "admin" ? (
        <div className={sidebarStatus() ? "adminRightbarActive" : "adminRightbar"}>
          <div className="adminRightbarContainer">
            <h6 className='membersListHeader'>Members</h6>
            <AdminRightbar></AdminRightbar>
          </div>
        </div>
      ) : (
        <div className="rightbar">
          <div className="rightbarContainer">
            {profile ? <ProfileRightbar /> : <HomeRightbar />}
          </div>
        </div>
      )}
    </>
  );
}

export default RightBar