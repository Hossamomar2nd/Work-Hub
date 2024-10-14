import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import CategoryIcon from '@mui/icons-material/Category';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import Person4Icon from '@mui/icons-material/Person4';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import "./test.scss";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getAuthUser, removeAuthUser } from '../../localStorage/storage';
import { useEffect, useRef, useState } from "react";
import { sidebarStatus } from '../../App';


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

// export function sidebarStatus(){
//   console.log(sidebarData);
//   return sidebarData;
// }


export default function MiniDrawer({open, handleDrawerOpen, handleDrawerClose}) {
  const theme = useTheme();

  const user = getAuthUser();

  let { category } = useParams();

  const [services, setServices] = useState({
    loading: false,
    results: null,
    err: null,
    reload: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/services/getAllServices")
      .then((resp) => {
        setServices({ results: resp.data.services, loading: false, err: null });
        console.log(resp.data.services);
      })
      .catch((err) => {
        console.log(err);
        // setConversation({ ...conversation, loading: false, err: err.response.data.errors });
      });
  }, [services.reload]);

  const [sort, setSort] = useState("sales");
  const [openSortMenu, setOpenSortMenu] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();

  const reSort = (type) => {
    setSort(type);
    // setOpen(false);
  };

  const apply = () => {
    console.log(minRef.current.value)
    console.log(maxRef.current.value)
  }


  const navigate = useNavigate();

  const navigation = (e) => {
    let text = e.target.innerText;

    if (text == user.name) {
      return navigate("/adminProfile");
    }

    if(text == "Dashboard") {
      return navigate("/adminDashboard");
    }

    if (text == "Gigs") {
      return navigate("/adminGigs");
    }

    if (text == "Categories") {
      return navigate("/category");
    }

    if (text == "Courses") {
      return navigate("/manageLearn");
    }

    if (text == "Clients") {
      return navigate("/clientList");
    }

    if (text == "Freelancers") {
      return navigate("/freelancerList");
    }

    if (text == "Orders") {
      return navigate("/ordersList");
    }

    if (text == "Community") {
      return navigate("/adminCommunity");
    }

    if(text == "") {
      return navigate("/adminProfile");
    }

    text = e.target.dataset.testid;

    if(text == undefined) {
      text = e.target.nearestViewportElement.dataset.testid;
    }

    if(text == "") {
      return navigate("/adminProfile");
    }

    if(text == "DashboardIcon") {
      return navigate("/adminDashboard");
    }

    if(text == "MiscellaneousServicesIcon") {
      return navigate("/adminGigs");
    }

    if(text == "CategoryIcon") {
      return navigate("/category");
    }

    if(text == "SchoolIcon") {
      return navigate("/manageLearn");
    }

    if(text == "PersonIcon") {
      return navigate("/clientList");
    }

    if(text == "ShoppingCartIcon") {
      return navigate("/ordersList");
    }

    if(text == "PeopleIcon") {
      return navigate("/adminCommunity");
    }

    if(text == "Person4Icon") {
      return navigate("/freelancerList");
    }

    // let value = e.target.nearestViewportElement.dataset.testid;

    console.log(text);
    // console.log(value);
    console.log(e);



    // console.log("tamam");
    // console.log(e.target.__reactProps$h2p2tj3bfnn.children);
    // console.log(e.target.__reactProps$8r0tzruwz8y);
    // console.log(e.target.innerText);
    // console.log(e);

  }

  const adminLogout = (e) => {
    e.preventDefault();
    const userId = user._id;
    console.log(userId);
    axios.put("http://localhost:3000/api/auth/logout/" + userId)
    .then((resp) => {
      console.log(resp);
      removeAuthUser();
      navigate("/");
    }).catch((errors) => {
      console.log(errors);
    })
  }




  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(sidebarStatus() && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
                <div className='sidebar-brand'>
                    <img src="/img/Logo.png" className='icon_header'/>
                    <h1 className='adminLogoName'>WorkHub</h1>
                    <span className='dot'>.</span>
                </div>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[user.name, 'Dashboard', 'Gigs', 'Orders', 'Categories', 'Courses', 'Community', 'Clients', 'Freelancers'].map((text, index) => (
            <ListItem key={text} id='text' onClick={navigation} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  onClick={navigation}
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {/* {index % 2 === 0 ? <DashboardIcon /> : <MailIcon />} */}
                  {text == user.name ? <img className='profileIco' src={user.image_url} alt="" /> : null}
                  {text == "Dashboard" ? <DashboardIcon /> : null}
                  {text == "Gigs" ? <MiscellaneousServicesIcon /> : null}
                  {text == "Orders" ? <ShoppingCartIcon /> : null}
                  {text == "Categories" ? <CategoryIcon /> : null}
                  {text == "Courses" ? <SchoolIcon /> : null}
                  {text == "Community" ? <PeopleIcon /> : null}
                  {text == "Clients" ? <PersonIcon /> : null}
                  {text == "Freelancers" ? <Person4Icon /> : null}
                  {/* {text == "Categories" ? <CategoryIcon /> : null}
                  {text == "Dashboard" ? <DashboardIcon /> : null} */}
                  {/* <img src="/img/12.png" alt="" /> */}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}

            <ListItem key={"Logout"} id='text' onClick={adminLogout} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  onClick={navigation}
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={"Logout"} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box>
    </Box>
  );
}