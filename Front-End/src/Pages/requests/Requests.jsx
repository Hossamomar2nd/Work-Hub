import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Requests.scss";
import Button from '@mui/material/Button';
import { getAuthUser, setAuthUser } from "../../localStorage/storage";
import axios from "axios";
import swal from "sweetalert";
import Alert from "@mui/material/Alert";

const Requests = () => {
  const currentUser = {
    id: 1,
    username: "Anna",
    isSeller: false,
  };

  const { pathname } = useLocation();

  const user = getAuthUser();

  const navigate = useNavigate();


  const [requests, setRequests] = useState({
    loading: false,
    results: null,
    err: null,
    reload: 0,
  });


  useEffect(() => {
    setRequests({ loading: true });

    axios
      .get("http://localhost:3000/api/requests/getUserRequests/" + user.role + "/" + user._id)
      .then((resp) => {
        console.log(resp);
        console.log(resp.data);
        setRequests({ results: resp.data, loading: false, err: null });
        console.log(requests.results);
        // console.log(resp.data.services);
      })
      .catch((err) => {
        console.log(err);
        setRequests({ ...requests, loading: false, err: err.response.data.msg });
      });
  }, [requests.reload]);



  const approve = (e) => {
    // console.log(e);
    // console.log(e.target.value);
    const id = e.target.value;

    axios
    .put("http://localhost:3000/api/requests/updateRequest/" + id, {
      requestStatus: "Approved",
      freelancerId: user._id,
    })
    .then((resp) => {
      swal(
        resp.data.msg,
        "",
        "success"
      );
      setRequests({ reload: requests.reload + 1 });
      console.log(resp);
    })
    .catch((errors) => {
      swal(errors.response.data.msg, "", "error");
      console.log(errors);
      // console.log(errors.response.data.message);
    });
  }

  const decline = (e) => {
    const id = e.target.value;

    axios
    .put("http://localhost:3000/api/requests/updateRequest/" + id, {
      requestStatus: "Declined",
      freelancerId: user._id,
    })
    .then((resp) => {
      swal(
        resp.data.msg,
        "",
        "success"
      );
      setRequests({ reload: requests.reload + 1 });
      console.log(resp);
      // console.log(resp.data.message);
      // console.log(resp.data.userData);
      // setAuthUser(resp.data.userData);
      // navigate("/gigs");
    })
    .catch((errors) => {
      swal(errors.response.data.msg, "", "error");
      console.log(errors);
      // console.log(errors.response.data.message);
    });
  }


  const cancel = (e) => {
    const id = e.target.value;

    axios
    .delete("http://localhost:3000/api/requests/deleteRequest/" + id)
    .then((resp) => {
      swal(
        resp.data.msg,
        "",
        "success"
      );
      setRequests({ reload: requests.reload + 1 });
      console.log(resp);
      // console.log(resp.data.message);
      // console.log(resp.data.userData);
      // setAuthUser(resp.data.userData);
      // navigate("/gigs");
    })
    .catch((errors) => {
      swal(errors.response.data.msg, "", "error");
      console.log(errors);
      // console.log(errors.response.data.message);
    });
  }

  return (
    <div className="orders">
      <div className="ordersContainer">
        <div className="title">
          <h1><Link reloadDocument className="breadcrumbsLink" to={"/gigs"}><img className="homeIconImg" src="./img/marketplace-1.png" /> Marketplace {'>'} </Link>{pathname == "/requests" ? "Requests" : "Orders"}</h1>
        </div>
        {/* <div className="breadcrumbs">
          <Link reloadDocument className="breadcrumbsLink" to={"/"}><img className="homeIconImg" src="./img/homeIcon.png" /> Home {'>'} </Link>
        </div> */}
        <table>
          <tr>
            <th>{user.role=="client" ? null : "Client"}</th>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            {pathname == "/orders" && <th>Contact</th>}
            <th>Status</th>
            {pathname == "/requests" && <th>Action</th>}
          </tr>

          {requests.results && requests.err == null && requests.loading == false &&
          requests.results.map((request) => (
            <tr>
                <td><Link className="link" reloadDocument to={"/profile/" + request?.clientId._id}>{user.role=="client" ? null : request.clientId.name}</Link></td>
                <td>
                <Link reloadDocument to={"/gig/" + request?.serviceId._id}>
                    <img
                        className="image"
                        src={request.serviceId.serviceCover_url}
                        alt=""
                    />
                </Link> 
                </td>
                <td>{request.serviceId.serviceTitle}</td>
                <td>{request.serviceId.servicePrice}</td>
                {pathname == "/orders" && (
                <td>
                    <img className="message" src="./img/message.png" alt="" />
                </td>
                )}
                <td>{request.requestStatus}</td>
                {pathname == "/requests" && user.role !== "client" && request.requestStatus == "Pending" && (
                <td>
                    <Button
                    variant="contained"
                    className="approveBtn"
                    value={request._id}
                    onClick={approve}
                    >
                    Approve
                    </Button>
                    <Button
                    variant="contained"
                    className="delcineBtn"
                    value={request._id}
                    onClick={decline}
                    >
                    Decline
                    </Button>
                </td>
                )}

              {pathname == "/requests" && user.role == "client" && request.requestStatus == "Pending" && (
                <td>
                    <Button
                    variant="contained"
                    className="delcineBtn"
                    value={request._id}
                    onClick={cancel}
                    >
                    Cancel
                    </Button>
                </td>
                )}

              {request.requestStatus !== "Pending" && <td>----</td>}
            </tr>
          ))}
        </table>
        {requests.err !== null &&
            <div className='communityFilterAlert'>
              <Alert severity="info">{requests.err}</Alert>
            </div>
          }
      </div>
    </div>
  );
};

export default Requests;
