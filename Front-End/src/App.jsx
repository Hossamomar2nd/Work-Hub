import React, { useState } from 'react';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './Pages/home/Home';
import Gigs from './Pages/gigs/Gigs';
import Gig from './Pages/gig/Gig';
import Add from './Pages/add/Add';
import Orders from './Pages/orders/Orders';
import Messages from './Pages/messages/Messages';
import Message from './Pages/message/Message';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation
} from "react-router-dom";
import './App.scss'
import Login from './Pages/login/Login';
import PrivacyPolicy from './Pages/privacy/PrivacyPolicy';
import ContactUs from './Pages/contactUs/ContactUs';
import Register from './Pages/register/Register';
import Learn from './Pages/learn/Learn';
import Community from './Pages/community/Community';
import CommunityProfile from './Pages/communityProfile/CommunityProfile';
import Course from './Pages/learn/Course';
import UpdateProfile from './Pages/updateProfile/UpdateProfile';
import Profile from './Pages/profile/Profile';
import Skills from './components/skills/Skills';
import { Language } from '@mui/icons-material';
import AdminDashboard from './Pages/admin/AdminDashboard';
import { getAuthUser } from './localStorage/storage';
import Category from './Pages/admin/Category';
import AddCategory from './Pages/admin/AddCategory';
import UpdateCategory from './Pages/admin/UpdateCategory';
import ManageLearn from './Pages/admin/ManageLearn';
import AddCourse from './Pages/admin/AddCourse';
import LearnMenu from './components/LearnMenu/LearnMenu';
import PersistentDrawerLeft from './Pages/admin/test';
import MiniDrawer from './Pages/admin/test';
import ClientList from './Pages/admin/ClientList';
import AdminProfile from './Pages/admin/AdminProfile';
import MyCourses from './Pages/myCourses/MyCourses';
import FreelancerList from './Pages/admin/FreelancerList';
import OrdersList from './Pages/admin/OrdersList';
import Requests from './Pages/requests/Requests';
import ClientProfile from './Pages/admin/ClientProfile';
import ScrollToTop from './ScrollToTop';
import UpdateService from './Pages/updateService/UpdateService';
import SelectCommunity from './components/selectCommunity/SelectCommunity';
import CommunityList from './Pages/admin/CommunityList';
import AddCommunity from './Pages/admin/AddCommunity';
import UserDashboard from './Pages/userDashboard/UserDashboard';
import CommunityFilter from './Pages/communityFilter/CommunityFilter';
import AdminCommunity from './Pages/admin/AdminCommunity';
import GigsFilter from './Pages/gigs/GigsFilter';

import Chatbot from './components/chatbot/Chatbot';
import FilterLearn from './Pages/learn/FilterLearn';
let dashboardData;

export function sidebarStatus() {
  return dashboardData;
}

export default function App() {
  // const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  // const OpenSidebar = () => {
  //   setOpenSidebarToggle(!openSidebarToggle)
  //   dashboardData = openSidebarToggle;
  // }


  // return <Chatbot />
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
    dashboardData = !open;
    console.log(dashboardData);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    dashboardData = !open;
    console.log(dashboardData);
  };


  const Admin = () => {
    const { pathname } = useLocation();

    const handleClasses = (pathname) => {
      if (pathname == "/adminDashboard") {
        return 'grid-container'
      }
      else {
        if (pathname == "/manageLearn") {
          return "adminManageLearn"
        }
        return sidebarStatus() ? 'adminGigsContainer' : 'adminGigsContainer sidebar-close-gigsContainer'
      }
    }

    const auth = getAuthUser();
    return (
      <>
        {
          (auth !== undefined) && (auth.role == 'admin') ?
            <>
              <div className={handleClasses(pathname)}>
                <MiniDrawer open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
                <Outlet />
              </div>
            </>
            : <Navigate to={'/'} />
        }
      </>
    )
  }

  const Layout = () => {
    const { pathname } = useLocation()

    const auth = getAuthUser();
    console.log(auth);
    return (
      <>

        {
          (auth !== undefined) && (auth.role == 'admin') &&
          <Navigate to={'/adminDashboard'} />
        }


        {
          (auth == undefined) &&
          <div id='appScroll' className="app">
            <Navbar />
            <Outlet />
            <Footer />
          </div>
        }

        {
          (auth !== undefined) && (auth.role == 'freelancer') && pathname !== "/login" && pathname !== "/" && pathname !== "/register" &&

          <div id='appScroll' className="app">
            <Navbar />
            <Outlet />
            <Footer />
          </div>
        }

        {
          (auth !== undefined) && (auth.role == 'client') && pathname !== "/login" && pathname !== "/" && pathname !== "/register" && pathname !== "/add" &&

          <div id='appScroll' className="app">
            <Navbar />
            <Outlet />
            <Footer />
          </div>
        }


        {
          (auth !== undefined) && (auth.role == 'freelancer') && pathname == "/login" &&
          <Navigate to={'/userDashboard'} />
        }

        {
          (auth !== undefined) && (auth.role == 'freelancer') && pathname == "/register" &&
          <Navigate to={'/userDashboard'} />
        }

        {
          (auth !== undefined) && (auth.role == 'freelancer') && pathname == "/" &&
          <Navigate to={'/userDashboard'} />
        }



        {
          (auth !== undefined) && (auth.role == 'client') && pathname == "/login" &&
          <Navigate to={'/userDashboard'} />
        }

        {
          (auth !== undefined) && (auth.role == 'client') && pathname == "/register" &&
          <Navigate to={'/userDashboard'} />
        }

        {
          (auth !== undefined) && (auth.role == 'client') && pathname == "/add" &&
          <Navigate to={'/userDashboard'} />
        }

        {
          (auth !== undefined) && (auth.role == 'client') && pathname == "/" &&
          <Navigate to={'/userDashboard'} />
        }


      </>
    )
  }

  const router = createBrowserRouter([
    {
      // path: "/admin",
      element: <Admin />,
      children: [
        {
          path: "/adminDashboard",
          element: <AdminDashboard />
        },
        {
          path: "/adminGigs",
          element: <Gigs />
        },
        {
          path: "/adminGigs/:category",
          element: <Gigs />
        },
        {
          path: "/category",
          element: <Category />
        },
        {
          path: "/addCategory",
          element: <AddCategory />
        },
        {
          path: "/updateCategory/:id",
          element: <UpdateCategory />
        },
        {
          path: "/manageLearn",
          element: <ManageLearn />
        },
        {
          path: "/addCourse",
          element: <AddCourse />
        },
        {
          path: "/clientList",
          element: <ClientList />
        },
        {
          path: "/freelancerList",
          element: <FreelancerList />
        },
        {
          path: "/adminProfile",
          element: <AdminProfile />
        },
        {
          path: "/ordersList",
          element: <OrdersList />
        },
        {
          path: "/usersProfile/:id",
          element: <Profile />
        },
        {
          path: "/adminCommunity",
          element: <AdminCommunity />
        },
        {
          path: "/communityList",
          element: <CommunityList />
        },
        {
          path: "/addCommunity",
          element: <AddCommunity />
        },
      ]
    },

    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/gigs",
          element: <Gigs />
        },
        {
          path: "/gigsFilter/:id",
          element: <GigsFilter />
        },
        {
          path: "/gig/:id",
          element: <Gig />
        },
        {
          path: "/orders",
          element: <Orders />
        },
        {
          path: "/requests",
          element: <Requests />
        },
        {
          path: "/mycourses",
          element: <MyCourses />
        },
        {
          path: "/add",
          element: <Add />
        },
        {
          path: "/message/:id",
          element: <Message />
        },
        {
          path: "/messages",
          element: <Messages />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/register",
          element: <Register />
        },
        {
          path: "/privacyPolicy",
          element: <PrivacyPolicy />
        },
        {
          path: "/contactUs",
          element: <ContactUs />
        },
        {
          path: "/learn",
          element: <Learn />
        },
        {
          path: "/filterLearn/:id",
          element: <FilterLearn />
        },
        {
          path: "/course/:id",
          element: <Course />
        },
        {
          path: "/updateProfile",
          element: <UpdateProfile />
        },
        {
          path: "/updateService/:id",
          element: <UpdateService />
        },
        {
          path: "/community",
          element: <Community />
        },
        {
          path: "/community/:id",
          element: <CommunityFilter />
        },
        {
          path: "/communityProfile/:id",
          element: <CommunityProfile />
        },
        {
          path: "/profile/:id",
          element: <Profile />
        },
        {
          path: "/test",
          element: <MiniDrawer />
        },
        {
          path: "/selectCommunity",
          element: <SelectCommunity />
        },
        {
          path: "/userDashboard",
          element: <UserDashboard />
        },
        {
          path: "/chatbot/:id",
          element: <Chatbot />
        },
      ]
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
