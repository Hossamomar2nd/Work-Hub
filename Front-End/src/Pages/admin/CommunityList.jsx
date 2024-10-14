import React, { useEffect, useState } from 'react'
import './CommunityList.scss'
import { Table } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';
import Alert from 'react-bootstrap/Alert';
import { sidebarStatus } from "../../App";

const CommunityList = () => {

    const [communities, setCommunities] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0
    });

    useEffect(() => {
        setCommunities({ ...communities, loading: true })
        axios.get("http://localhost:3000/api/communities/getAllCommunities")
            .then(
                resp => {
                    console.log(resp.data);
                    setCommunities({ results: resp.data.allCommunities, loading: false, err: null });
                    console.log(resp);
                }
            ).catch(err => {
                setCommunities({ ...communities, loading: false, err: err.response.data.msg });
                console.log(err);
            })
    }, [communities.reload]);

    // const deleteCategory = (e) => {
    //     e.preventDefault();
    //     const category_id = e.target.value;
    //     axios.delete("http://localhost:3000/api/categories/deleteCategory/" + category_id)
    //         .then(
    //             resp => {
    //                 console.log(resp);
    //                 swal(resp.data.msg, "", "success");
    //                 setCategories({ ...categories, reload: categories.reload + 1 });
    //             }
    //         ).catch(error => {
    //             console.log(error);
    //         })
    // }
    return (
        <>
            <section className={sidebarStatus() ? 'CommunityListPage sidebar-open-category' : 'CommunityListPage sidebar-close-community'}>
                <div>
                    <h1>Community List</h1>
                </div>
                <div className='contain-table'>
                    <Link reloadDocument to={'/addCommunity'}>
                        <button className='addCategoryButton' onClick={clicked}>
                            Add Community
                        </button>
                    </Link>
                    {communities.loading == false && communities.err == null && (
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>
                                        Name
                                    </th>
                                    <th>
                                        Description
                                    </th>
                                    <th colSpan={2} className='action'>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {communities.loading == false && communities.err == null && (
                                        communities.results.map((community) => (
                                            <tr>
                                                <td>
                                                    {community.communityName}
                                                </td>
                                                <td className="desc">
                                                    {community.communityDesc}
                                                </td>
                                                <td className="test" colSpan={2}>
                                                    <Link reloadDocument to={'/updateCategory/' + community._id}>
                                                        <button className="button muted-button gl-update-btn">
                                                            Update
                                                        </button>
                                                    </Link>
                                                    <button value={community._id} className="button muted-button gl-delete-btn">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                        </Table>
                    )
                    }
                    {
                        communities.loading == false && communities.err !== null && (
                            <Alert variant={'danger'} className='err-msg-custom'>
                                {communities.err}
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

export default CommunityList;
