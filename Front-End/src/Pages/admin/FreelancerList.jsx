import './FreelancerList.scss';
import React, { useEffect, useState } from 'react'
import { Table } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';
import Alert from 'react-bootstrap/Alert';
import { sidebarStatus } from "../../App";

const FreelancerList = () => {

  const [freelancers, setfreelancers] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0
  });

  useEffect(() => {
    setfreelancers({ ...freelancers, loading: true })
    axios.get("http://localhost:3000/api/freelancers/getAllFreelancers")
      .then(
        resp => {
          console.log(resp.data);
          setfreelancers({ results: resp.data.freelancers, loading: false, err: null });
          console.log(resp);
        }
      ).catch(err => {
        setfreelancers({ ...freelancers, loading: false, err: err.response.data.msg });
        console.log(err);
      })
  }, [freelancers.reload]);

  return (
    <>
      <section className={sidebarStatus() ? 'FreelancerListPageActive' : 'FreelancerListPage sidebar-close-freelancer'}>
        <div>
          <h1>Freelancers List</h1>
        </div>
        <div className='freelancerContain-table'>
          {freelancers.loading == false && freelancers.err == null && (
            <Table striped>
              <thead>
                <tr>
                  <th>
                    Image_url
                  </th>
                  <th>
                    Name
                  </th>
                  <th>
                    Email
                  </th>
                  <th>
                    Country
                  </th>
                  <th className='action'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {freelancers.loading == false && freelancers.err == null && (
                  freelancers.results.map((freelancer => (
                    <tr>
                      <td>
                        <Link className='freelancerProfilePage' to={"/usersProfile/" + freelancer._id}>
                          <img src={freelancer.image_url} className="button muted-button gl-profile-btn" />
                        </Link>
                      </td>
                      <td className="desc">
                        {freelancer.name}
                      </td>
                      <td className="desc">
                        {freelancer.email}
                      </td>
                      <td className="desc">
                        {freelancer.country}
                      </td>
                      <td className="test">
                        <img src='./img/block.png' className="button muted-button gl-block-btn" />
                      </td>
                    </tr>
                  )))
                )
                }
              </tbody>
            </Table>
          )
          }
          {
            freelancers.loading == false && freelancers.err !== null && (
              <Alert variant={'danger'} className='err-msg-custom'>
                {freelancers.err}
              </Alert>
            )
          }
        </div>
      </section>
    </>
  )
}


const clicked = () => {
  $(".addCategoryButton").addClass("clicked");

  setTimeout(() => {
    $(".addCategoryButton").removeClass("clicked");
  }, 0.05);
}

export default FreelancerList;