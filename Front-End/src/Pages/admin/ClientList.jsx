import './ClientList.scss';
import React, { useEffect, useState } from 'react'
import { Table } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';
import Alert from 'react-bootstrap/Alert';
import { sidebarStatus } from "../../App";

const ClientList = () => {

  const [clients, setClients] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0
  });

  useEffect(() => {
    setClients({ ...clients, loading: true })
    axios.get("http://localhost:3000/api/clients/getAllClients")
      .then(
        resp => {
          console.log(resp.data);
          setClients({ results: resp.data, loading: false, err: null });
          console.log(resp);
        }
      ).catch(err => {
        setClients({ ...clients, loading: false, err: err.response.data.msg });
        console.log(err);
      })
  }, [clients.reload]);

  return (
    <>
      <section className={sidebarStatus() ? 'ClientsListPageActive' : 'ClientsListPage sidebar-close-client'}>
        <div>
          <h1>Clients List</h1>
        </div>
        <div className='contain-table'>
          {/* {categories.loading == false && categories.err == null && ( */}
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
              {clients.loading == false && clients.err == null && (
                clients.results.map((client => (
                  <tr>
                    <td>
                      <Link reloadDocument className='clientsProfilePage' to={"/usersProfile/" + client._id}>
                          <img src={client.image_url} className="button muted-button gl-profile-btn" />
                      </Link>
                    </td>
                    <td className="desc">
                      {client.name}
                    </td>
                    <td className="desc">
                      {client.email}
                    </td>
                    <td className="desc">
                      {client.country}
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
          {/* ) */}
          {/* } */}
          {/* {
            categories.loading == false && categories.err !== null && (
              <Alert variant={'danger'} className='err-msg-custom'>
                {categories.err}
              </Alert>
            )
          } */}
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

export default ClientList;