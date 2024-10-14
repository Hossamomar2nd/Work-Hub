import './OrdersList.scss';
import React, { useEffect, useState } from 'react'
import { Table } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';
import Alert from 'react-bootstrap/Alert';
import { sidebarStatus } from "../../App";

const OrdersList = () => {

    const [orders, setOrders] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0
    });

    useEffect(() => {
        setOrders({ ...orders, loading: true })
        axios.get("http://localhost:3000/api/orders/getAllOrders")
            .then(
                resp => {
                    console.log(resp.data);
                    setOrders({ results: resp.data, loading: false, err: null });
                    console.log(resp);
                }
            ).catch(err => {
                setOrders({ ...orders, loading: false, err: err.response.data.msg });
                console.log(err);
            })
    }, [orders.reload]);

    return (
        <>
            <section className={sidebarStatus() ? 'OrdersListPageActive' : 'OrdersListPage sidebar-close-orders'}>
                <div>
                    <h1>Orders List</h1>
                </div>
                <div className='contain-table'>
                {orders.loading == false && orders.err == null && (
                    <Table striped>
                        <thead>
                            <tr>
                                <th>
                                    Client Name
                                </th>
                                <th>
                                    Freelancer Name
                                </th>
                                <th>
                                    Service Title
                                </th>
                                <th>
                                    Pricing
                                </th>
                                <th>
                                    Delivery Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.loading == false &&
                            orders.err == null &&
                            orders.results &&
                            orders.results.length > 0 && ( 
                            orders.results.map((order => (
                                <tr>
                                    <td>
                                        {order.clientId.name}
                                    </td>
                                    <td className="desc">
                                        {order.freelancerId.name} 
                                    </td>
                                    <td className="desc">
                                        {order.serviceId.serviceTitle}
                                    </td>
                                    <td className="desc">
                                        {order.serviceId.servicePrice} $
                                    </td>
                                    <td className="test">
                                        {order.orderStatus}
                                    </td>
                                </tr>
                            ))) 
                             
                )} 
                        </tbody>
                    </Table>
                    )
                    }
                    {
                        orders.loading == false && orders.err !== null && (
                            <Alert variant={'danger'} className='err-msg-custom'>
                                {orders.err}
                            </Alert>
                        )
                    }
                </div>
            </section>
        </>
    )
}
export default OrdersList;