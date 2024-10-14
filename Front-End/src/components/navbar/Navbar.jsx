import React, { useEffect, useState } from 'react'
import "./Navbar.scss"
import { Link, useLocation, useParams } from 'react-router-dom'
import { getAuthUser, removeAuthUser } from '../../localStorage/storage';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Navbar = () => {

  // const [search, setSearch] = useState("");

  let { id } = useParams();

  const [active, setActive] = useState(false);
  const [activeMenu, setActiveMenu] = useState(false);
  const [learnMenu, setLearnMenu] = useState(false);

  const [open, setOpen] = useState(false);

  const [openExplore, setOpenExplore] = useState(false);

  const [showMore, setShowMore] = useState(false);

  const [openCategoryList, setOpenCategoryList] = useState(false);

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 10 ? setActive(true) : setActive(false);
  };

  const isActiveMenu = () => {
    window.scrollY > 500 ? setActiveMenu(true) : setActiveMenu(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);

    return () => {
      window.removeEventListener("scroll", isActive);
    };

  }, []);

  useEffect(() => {
    if (pathname === "/" || pathname === "/gigs") {
      window.addEventListener("scroll", isActiveMenu);

      return () => {
        window.removeEventListener("scroll", isActiveMenu);
      };
    }
  }, [pathname]);

  const user = getAuthUser()
  // console.log(user);

  let currentUser

  if (user == undefined) {
    currentUser = null
  }
  else {
    currentUser = {
      id: user._id,
      name: user.name,
      type: user.role,
      activity: user.activityStatus
    }
  }

  const navigate = useNavigate();

  const userLogout = (e) => {
    e.preventDefault();
    const userId = user._id;
    console.log(userId);
    axios.put("http://localhost:3000/api/auth/logout/" + userId)
      .then((resp) => {
        console.log(resp);
        removeAuthUser();
        window.location.replace("http://localhost:3001/");
        // navigate("/");
      }).catch((errors) => {
        console.log(errors);
      })
  }


  const [categories, setCategories] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0
  });

  useEffect(() => {
    setCategories({ ...categories, loading: true })
    axios.get("http://localhost:3000/api/categories/getAllCategories")
      .then(
        resp => {
          // console.log(resp.data);
          setCategories({ results: resp.data, loading: false, err: null });
          console.log(resp);
        }
      ).catch(err => {
        setCategories({ ...categories, loading: false, err: err.response.data.msg });
        console.log(err);
      })
  }, [categories.reload]);

  const [categoriesLength, setCategoriesLength] = useState(8);

  const showMoreCategories = (e) => {
    e.preventDefault();
    setCategoriesLength(categories?.results.length);
    // console.log(skillsArrayLength);
  }

  return (
    <>
      {user && user.role !== "admin"  &&
        <div className={active || pathname !== "/" || activeMenu || pathname == "/gigs" ? "navbar active activeMenu" : "navbar"}>

          {/* // <div className={active || pathname !== "/" ? "navbar active activeMenu" : "navbar"} > */}
          <div className='navbarContainer'>
            <Link reloadDocument to="/" className='link'>
              <div className="logo">
                <img className='WH' src="/img/Logo.png" />
                <span className='text'>WorkHub</span>
                <span className='dot'>.</span>
              </div>
            </Link>
            <div className="links">
            {currentUser?.type !== undefined && (
                <Link reloadDocument className='link' to="/userDashboard"><span>Dashboard</span></Link>
            )}
              <div className="user" onClick={() => setOpenExplore(!openExplore)}>
                <span>Explore</span>
                {openExplore && <div className="exploreOptions">
                  <>
                    <Link reloadDocument className='link' to="/gigs"><span>Marketplace</span></Link>
                    <Link reloadDocument className='link' to="/community">Community</Link>
                    <Link reloadDocument className='link' to="/learn">Learn</Link>
                  </>
                </div>}
              </div>

              <span><img className="languageIcon" src={!active && pathname == "/" ? "/img/newLanguage.png" : "/img/language.png"} /> English</span>


              {currentUser?.activity !== "online" && <Link reloadDocument className='link' to="/login">Sign in</Link>}
              {/* {currentUser.activity !== "online" ? <Link className='link' to="/login">Sign in</Link> : null} */}

              {currentUser?.activity !== "online" && <Link reloadDocument className='link' to="/register"><button className='joinButton'>Join</button></Link>}
              {currentUser && (
                <>
                <div className="user" onClick={() => setOpen(!open)}>
                <div className='onlineImgContainerNavbar'>
                  <img src={user.image_url} />
                  <img className="onlineImg" src={currentUser?.activity == "online" ? "/img/online.png" : "/img/offline.png"}/>
                </div>
                  <span>{currentUser?.name}</span>
                  {open && <div className="options">
                    <Link reloadDocument className='link' to="/userDashboard"><span>Dashboard</span></Link>
                    <Link reloadDocument className='link' to={"/profile/" + user?._id}>Profile</Link>
                    <Link reloadDocument className='link' to="/mycourses">My Courses</Link>
                    {currentUser?.type == "freelancer" && (
                      <>
                        <Link reloadDocument className='link' to="/add">Add New Service</Link>
                      </>
                    )}
                    <Link reloadDocument className='link' to="/requests">Requests</Link>
                    <Link reloadDocument className='link' to="/orders">Orders</Link>
                    <Link reloadDocument className='link' to="/messages">Messages</Link>
                    <Link reloadDocument className='link' onClick={userLogout}>Logout</Link>
                  </div>}
                </div>
                </>
              )}
            </div>
          </div>
          {/* {(activeMenu && pathname !== "/learn" && pathname == "/" || pathname == "/gigs" && pathname == "/gigs/:category" ) && ( */}

          {(activeMenu || pathname == "/gigs" || pathname.startsWith("/gigsFilter/" + id)) && (

            <>
              <div className="search">
                <div className="searchInput">
                  <img src="../img/search.png" alt="" />
                  <input type="text" placeholder='What service are you looking for today?' />
                </div>
                <button>Search</button>
              </div>

              <ul className='menu'>
                {categories.loading == false && categories.err == null && (
                  categories.results.slice(0, categoriesLength).map((category => (
                    <>
                      <li className='category'>
                        <Link reloadDocument className='menuLink' to={"/gigsFilter/" + category._id }>
                            {category.categoryName}
                        </Link>
                      </li>
                    </>
                  )))
                )
                }

                
                {/* {openCategoryList && categories.loading == false && categories.err == null && (
                  categories.results.slice(0, categoriesLength).map((category => (
                    <>
                      <li className='category'>
                        <Link reloadDocument className='menuLink' to={"/gigsFilter/" + category._id }>
                            {category.categoryName}
                        </Link>
                      </li>
                    </>
                  )))
                )
                } */}



                {categories?.results.length > categoriesLength &&
                  <>
                    <div className='openCategoryListContainer' onClick={() => setOpenCategoryList(!openCategoryList)}>
                    <Link onClick={showMoreCategories} className="showMore"><img className='downMenuImg' src="/img/downMenu.png"/>{categories?.results.length - 8}</Link>
                    </div>
                  </>
                }
              </ul>
            </>
          )}
        </div>
      }


    {!user  &&
      <div className={active || pathname !== "/" || activeMenu || pathname == "/gigs" ? "navbar active activeMenu" : "navbar"}>

        {/* // <div className={active || pathname !== "/" ? "navbar active activeMenu" : "navbar"} > */}
        <div className='navbarContainer'>
          <Link reloadDocument to="/" className='link'>
            <div className="logo">
              <img className='WH' src="/img/Logo.png" />
              <span className='text'>WorkHub</span>
              <span className='dot'>.</span>
            </div>
          </Link>
          <div className="links">
            <div className="user" onClick={() => setOpenExplore(!openExplore)}>
              <span>Explore</span>
              {openExplore && <div className="exploreOptions">
                <>
                  <Link reloadDocument className='link' to="/gigs"><span>Marketplace</span></Link>
                  <Link reloadDocument className='link' to="/learn">Learn</Link>
                </>
              </div>}
            </div>

            <span><img className="languageIcon" src={!active && pathname == "/" ? "/img/newLanguage.png" : "/img/language.png"} /> English</span>


            {currentUser?.activity !== "online" && <Link reloadDocument className='link' to="/login">Sign in</Link>}
            {/* {currentUser.activity !== "online" ? <Link className='link' to="/login">Sign in</Link> : null} */}

            {currentUser?.activity !== "online" && <Link reloadDocument className='link' to="/register"><button className='joinButton'>Join</button></Link>}
            {currentUser && (
              <div className="user" onClick={() => setOpen(!open)}>
                <img src={user.image_url} />
                <span>{currentUser?.name}</span>
                {open && <div className="options">
                  <Link className='link' reloadDocument to={"/profile/" + user?._id}>Profile</Link>
                  <Link className='link' to="/mycourses">My Courses</Link>
                  {currentUser?.type == "freelancer" && (
                    <>
                      <Link className='link' to="/add">Add New Service</Link>
                    </>
                  )}
                  <Link reloadDocument className='link' to="/requests">Requests</Link>
                  <Link reloadDocument className='link' to="/orders">Orders</Link>
                  <Link reloadDocument className='link' to="/messages">Messages</Link>
                  <Link className='link' onClick={userLogout}>Logout</Link>
                </div>}
              </div>
            )}
          </div>
        </div>
        {/* {(activeMenu && pathname !== "/learn" && pathname == "/" || pathname == "/gigs" && pathname == "/gigs/:category" ) && ( */}

        {(activeMenu || pathname == "/gigs" || pathname.startsWith("/gigsFilter/" + id)) && (

          <>
            <div className="search">
              <div className="searchInput">
                <img src="../img/search.png" alt="" />
                <input type="text" placeholder='What service are you looking  for today?' />
              </div>
              <button>Search</button>
            </div>

            <ul className='menu'>
              {categories.loading == false && categories.err == null && (
                categories.results.slice(0, 8).map((category => (
                  <>
                    <li className='category'><Link reloadDocument className='menuLink' to="/gigs/:id">
                      {category.categoryName}</Link>
                    </li>
                  </>
                )))
              )
              }


            <div className="showMoreContainer" onClick={() => setShowMore(!showMore)}>
              <img className='downMenuStyle' src="./img/downMenu.png" alt="" />
              {showMore && <div className="showMore">

                {categories.loading == false && categories.err == null && (
                categories.results.slice(8).map((category => (
                  <>
                    <Link reloadDocument className='menuLink' to="/gigsFilter/:id">
                      {category.categoryName}
                    </Link>
                  </>
                )))
              )
              }
              </div>}
            </div>

            </ul>

          </>
        )}
      </div>
    }
  </>
  );
};

export default Navbar