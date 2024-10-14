import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SideBar.scss";
import { getAuthUser } from "../../localStorage/storage";
import axios from "axios";
import Button from "@mui/material/Button";
import swal from "sweetalert";
import { sidebarStatus } from '../../App';


const SideBar = () => {
  const user = getAuthUser();
  const [communityListOpen, setCommunityListOpen] = useState(true);

  const [communities, setCommunities] = useState({
    loading: true,
    results: [],
    err: null,
    communityName: "",
    communityDesc: "",
    reload: 0,
  });

  const [joinedCommunities, setjoinedCommunities] = useState({
    loading: true,
    results: [],
    err: null,
    caption: "",
    reload: 0,
  });

  useEffect(() => {
    setCommunities({ ...communities, loading: true });
    axios
      .get("http://localhost:3000/api/communities/getAllCommunities")
      .then((resp) => {
        // console.log(resp.data.allCommunities);
        setCommunities({
          results: resp.data.allCommunities,
          loading: false,
          err: null,
        });

        if(user && user.role == "admin") {
          setCommunityListOpen(true);
        }

        // console.log(resp);
      })
      .catch((err) => {
        setCommunities({
          ...communities,
          loading: false,
          err: err.response.data.msg,
        });
        console.log(err);
      });
  }, [communities.reload]);

  const joinCommunity = (e) => {
    const commmunity_id = e.target.value;
    console.log(commmunity_id);
    axios
      .put(
        "http://localhost:3000/api/communities/joinCommunity/" +
          commmunity_id +
          "/" +
          user?._id +
          "/" +
          user?.role
      )
      .then((resp) => {
        console.log(resp);
        setjoinedCommunities({ reload: joinedCommunities.reload + 1 });
        // window.location.replace("http://localhost:3001/course/" + id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setjoinedCommunities({ ...joinedCommunities, loading: true });
    if (user) {
      axios
        .get(
          "http://localhost:3000/api/communities/getJoinedCommunities/" +
            user?._id +
            "/" +
            user?.role
        )
        .then((resp) => {
          console.log(resp.data.communitiesData);
          setjoinedCommunities({
            results: resp.data.communitiesData,
            loading: false,
            err: null,
          });
          // console.log(resp);
        })
        .catch((err) => {
          setjoinedCommunities({
            ...joinedCommunities,
            loading: false,
            err: err.response.data.msg,
          });
          console.log(err);
        });
    }
  }, [joinedCommunities.reload]);

  const handelCommunityJoinBtn = (communityId) => {
    let status = true;

    if (joinedCommunities.results) {
      joinedCommunities.results.filter((community) => {
        if (communityId == community._id) {
          status = false;
        }
      });
    }

    return status;
  };

  const unjoinCommunity = (e) => {
    e.preventDefault();
    const community_id = e.target.value;
    console.log(community_id);
    // console.log(e);
    axios
      .put(
        "http://localhost:3000/api/communities/unjoinCommunity/" +
          community_id +
          "/" +
          user._id +
          "/" +
          user.role
      )
      .then((resp) => {
        console.log(resp);
        swal(resp.data.msg, "", "success");
        setjoinedCommunities({ reload: joinedCommunities.reload + 1 });
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const manageCommunity = () => {
    window.location = "http://localhost:3001/communityList";
  }

  return (
    <>
      {user && user.role != "admin" && (
        <div className={user ? "sidebar" : "guestSidebar"}>
          <div className="sidebarContainer">
            <ul className="sidebarList">
              <li className="sidebarListItem">
                {user && (
                  <Link
                    reloadDocument
                    className="sidebarLink"
                    to={"/communityProfile/" + user?._id}
                  >
                    <img className="sidebarProfileImg" src={user?.image_url} />
                    <img className="onlineImg" src={user?.activityStatus == "online" ? "/img/online.png" : "/img/offline.png"}/>
                    <span className="sidebarListItemText">{user?.name}</span>
                  </Link>
                )}
              </li>

              <li className="sidebarListItem">
                <Link reloadDocument className="sidebarLink" to="/community">
                  <img className="sidebarIcon" src="/img/feed.png" />
                  <span className="sidebarListItemText">Feeds</span>
                </Link>
              </li>

              {/* <li className="sidebarListItem">
                {user &&
                  <Link reloadDocument className='sidebarLink' to="/">
                    <img className='sidebarIcon' src="/img/chat.png" />
                    <span className='sidebarListItemText'>Chats</span>
                  </Link>
                }
              </li> */}

              <li className="sidebarListItem">
                <div
                  onClick={() => setCommunityListOpen(!communityListOpen)}
                  className="sidebarLink"
                >
                  <img className="sidebarIcon" src="/img/groups.png" />
                  <span className="sidebarListItemText">Communities</span>
                </div>

                {communityListOpen && (
                  <>
                    <ul className="communityList">
                      {communities.loading == false &&
                        communities.err == null &&
                        communities.results &&
                        communities.results.length > 0 &&
                        communities.results.map((community) => (
                          <>
                            <li className="communityListContent">
                              <Link
                                className="sidebarLink"
                                reloadDocument
                                to={"/community/" + community?._id}
                              >
                                {community?.communityName}
                              </Link>
                              {joinedCommunities.loading == false &&
                                // joinedCommunities.err == null &&
                                // joinedCommunities.results &&
                                // joinedCommunities.results.length > 0 &&
                                handelCommunityJoinBtn(community?._id) && (
                                  <>
                                    <Button
                                      variant="contained"
                                      className="approveBtn"
                                      value={community?._id}
                                      onClick={joinCommunity}
                                    >
                                      Join
                                    </Button>
                                  </>
                                )}
                            </li>
                          </>
                        ))}
                    </ul>
                  </>
                )}
              </li>

              <li className="sidebarListItem">
                <Link reloadDocument className="sidebarLink" to="/gigs">
                  <img className="sidebarIcon" src="/img/marketplace.png" />
                  <span className="sidebarListItemText">Marketplace</span>
                </Link>
              </li>

              <li className="sidebarListItem">
                <Link reloadDocument className="sidebarLink" to="/learn">
                  <img className="sidebarIcon" src="/img/course.png" />
                  <span className="sidebarListItemText">Courses</span>
                </Link>
              </li>
            </ul>
            {user && user.role != "admin" && (
              <>
                <hr className="sidebarHr-1" />
                <span className="sidebaMenuText">Joined Communities</span>
                <hr className="sidebarHr-2" />
                <ul className="sidebarCommunityList">
                  {joinedCommunities.loading == false &&
                    // joinedCommunities.err == null &&
                    joinedCommunities.results &&
                    joinedCommunities.results.length > 0 &&
                    joinedCommunities.results.map((joinedCommunity) => (
                      <>
                        <li className="sidebarCommunity">
                          <Link
                            className="unjoinLink"
                            reloadDocument
                            to={"/community/" + joinedCommunity?._id}
                          >
                            <span className="sidebarCommunityName">
                              {joinedCommunity?.communityName}
                            </span>
                          </Link>
                          {/* <button className='sidebarJoinButton'>Join</button> */}
                          <Button
                            variant="contained"
                            className="sidebarJoinButton"
                            value={joinedCommunity?._id}
                            onClick={unjoinCommunity}
                          >
                            Unjoin
                          </Button>
                        </li>
                      </>
                    ))}
                </ul>
              </>
            )}
          </div>
          <span></span>
        </div>
      )}

      {user && user.role == "admin" && (
        <div className={sidebarStatus() ? "AdminSidebarActive" : "AdminSidebar"}>
          <div className="sidebarContainer">
            <ul className="sidebarList">
              {/* <li className="sidebarListItem">
                {user && (
                  <Link
                    reloadDocument
                    className="sidebarLink"
                    to={"/communityProfile/" + user?._id}
                  >
                    <img className="sidebarProfileImg" src={user?.image_url} />
                    <span className="sidebarListItemText">{user?.name}</span>
                  </Link>
                )}
              </li> */}

              <li className="sidebarListItem">
                <Link reloadDocument className="sidebarLink" to="/community">
                  <img className="sidebarIcon" src="/img/feed.png" />
                  <span className="sidebarListItemText">All Posts</span>
                </Link>
              </li>

              <li className="sidebarListCommunityItems">
                <div className="communitiesContainer">
                  <div
                    onClick={() => setCommunityListOpen(!communityListOpen)}
                    className="sidebarLink"
                  >
                    <img className="sidebarIcon" src="/img/groups.png" />
                    <span className="sidebarListItemText">Communities</span>

                  </div>

                  <Button
                      variant="contained"
                      className="manageCommunityBtn"
                      onClick={manageCommunity}
                    >
                      Manage
                  </Button>
                </div>

                {communityListOpen && (
                  <>
                    <ul className="communityList">
                      {communities.loading == false &&
                        communities.err == null &&
                        communities.results &&
                        communities.results.length > 0 &&
                        communities.results.map((community) => (
                          <>
                            <li className="communityListContent">
                              <Link
                                className="sidebarLink"
                                reloadDocument
                                to={"/community/" + community?._id}
                              >
                                {community?.communityName}
                              </Link>
                              {/* {joinedCommunities.loading == false &&
                                // joinedCommunities.err == null &&
                                // joinedCommunities.results &&
                                // joinedCommunities.results.length > 0 &&
                                handelCommunityJoinBtn(community?._id) && (
                                  <div className="BtnsContainer">
                                    <Button
                                      variant="contained"
                                      className="updateCommunityBtn"
                                      value={community?._id}
                                      onClick={joinCommunity}
                                    >
                                      Update
                                    </Button>

                                    <Button
                                      variant="contained"
                                      className="deleteCommunityBtn"
                                      value={community?._id}
                                      onClick={joinCommunity}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                  
                                )} */}
                            </li>
                          </>
                        ))}
                    </ul>
                  </>
                )}
              </li>

              {/* <li className="sidebarListItem">
                <Link reloadDocument className="sidebarLink" to="/gigs">
                  <img className="sidebarIcon" src="/img/marketplace.png" />
                  <span className="sidebarListItemText">Marketplace</span>
                </Link>
              </li> */}

              {/* <li className="sidebarListItem">
                <Link reloadDocument className="sidebarLink" to="/learn">
                  <img className="sidebarIcon" src="/img/course.png" />
                  <span className="sidebarListItemText">Courses</span>
                </Link>
              </li> */}
            </ul>
            {user && user.role != "admin" && (
              <>
                <hr className="sidebarHr-1" />
                <span className="sidebaMenuText">Joined Communities</span>
                <hr className="sidebarHr-2" />
                <ul className="sidebarCommunityList">
                  {joinedCommunities.loading == false &&
                    // joinedCommunities.err == null &&
                    joinedCommunities.results &&
                    joinedCommunities.results.length > 0 &&
                    joinedCommunities.results.map((joinedCommunity) => (
                      <>
                        <li className="sidebarCommunity">
                          <Link
                            className="unjoinLink"
                            reloadDocument
                            to={"/community/" + joinedCommunity?._id}
                          >
                            <span className="sidebarCommunityName">
                              {joinedCommunity?.communityName}
                            </span>
                          </Link>
                          {/* <button className='sidebarJoinButton'>Join</button> */}
                          <Button
                            variant="contained"
                            className="sidebarJoinButton"
                            value={joinedCommunity?._id}
                            onClick={unjoinCommunity}
                          >
                            Unjoin
                          </Button>
                        </li>
                      </>
                    ))}
                </ul>
              </>
            )}
          </div>
          <span></span>
        </div>
      )}

      {/* )} */}
    </>
  );
};

export default SideBar;
