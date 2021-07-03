import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import classes from './GetOrders.module.scss';
import * as actions from '../../../store/actions/index'
import LargeSpinner from '../../../components/global/LargeSpinner/LargeSpinner';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';

const GetOrders = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { search } = useLocation();
    const values = queryString.parse(search);
    console.log(values)
    const [page, setPage] = useState(values.page ? parseInt(values.page) : 1);
    const [startDate, setStartDate] = useState(values.startDate ? values.startDate : '');
    const [endDate, setEndDate] = useState(values.endDate ? values.endDate : '');
    const [recipient, setRecipient] = useState(values.recipient ? values.recipient : '');
    const [transaction, setTransaction] = useState(values.transaction ? values.transaction : '');
    const [tracking, setTracking] = useState(values.tracking ? values.tracking : '');

    let filters = {
        startDate,
        endDate,
        recipient,
        transaction,
        tracking
    }

    useEffect(() => {
        dispatch(actions.getOrders(page, filters))
    }, [page])

    const changeFilters = (e, filterType) => {
        switch (filterType) {
            case 'startDate':
                setStartDate(e.target.value)
                filters = { ...filters, startDate: e.target.value };
                break;
            case 'endDate':
                setEndDate(e.target.value);
                filters = { ...filters, endDate: e.target.value };
                break;
            case 'recipient':
                setRecipient(e.target.value);
                filters = { ...filters, recipient: e.target.value };
                break;
            case 'transaction':
                setTransaction(e.target.value);
                filters = { ...filters, transaction: e.target.value };
                break;
            case 'tracking':
                setTracking(e.target.value);
                filters = { ...filters, tracking: e.target.value };
                break;
        }
        console.log(filters)
    }



    const submitFilter = () => {
        if (filters.recipient || filters.transaction || filters.tracking) {
            history.replace(`/order?page=${page}&recipient=${filters.recipient}&transaction=${filters.transaction}&tracking=${filters.tracking}`)
            dispatch(actions.getOrders(page, filters))
        } else if (filters.startDate || filters.endDate) {
            history.replace(`/order?page=${page}&dataRangeStart=${filters.startDate}&dataRangeEnd=${filters.endDate}`)
            dispatch(actions.getOrders(page, filters))
        } else {
            history.replace(`/order?page=${page}`)
            dispatch(actions.getOrders(page))
        }
    }

    const orders = useSelector(state => state.orders.orders);
    const loading = useSelector(state => state.orders.loading)
    const total = useSelector(state => state.orders.total)
    const pages = Math.ceil(total / 10)

    const goEdit = (e, order) => {
        const data = {
            orderId: order._id,
            name: order.recipient.name,
            contact: order.recipient.contact,
            country: order.recipient.country
        }
        history.push(`/add-order`, data)
    }

    const postShip = (e, id) => {
        axios.post('/order/add-update/ship', { orderId: id })
            .then(res => {
                history.push('ship-order', res.data)
            }).catch(err => {
                console.log(err.response)
                window.alert(err.response.data.message)
            })
    }

    const changePage = (event, value) => {
        history.replace(`/order?page=${value}`)
        setPage(value)
    }

    const cancelOrder = (e, status, id) => {
        let action = 'cancel';
        if(status === 3){
            action = 'restore'
        }
        axios.post('/order/add-update/cancel-restore', {
            orderId: id,
            action: action
        })
        .then(res => {
            console.log(res)
            dispatch(actions.getOrders(page, filters))
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <React.Fragment>
            <form className={classes.filters__container} onSubmit={e => e.preventDefault()}>
                <TextField
                    id="startDate"
                    label="Start Date"
                    type="date"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={startDate}
                    onChange={e => changeFilters(e, 'startDate')}
                    disabled={recipient || transaction || tracking}
                />
                <TextField
                    id="endDate"
                    label="End Date"
                    type="date"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={endDate}
                    onChange={e => changeFilters(e, 'endDate')}
                    disabled={recipient || transaction || tracking}
                />
                <h3>Or</h3>
                <TextField
                    id="recipient"
                    label="Recipient"
                    type="text"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={recipient}
                    onChange={e => changeFilters(e, 'recipient')}
                    disabled={startDate || endDate}
                />
                <TextField
                    id="transaction"
                    label="Transaction"
                    type="text"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={transaction}
                    onChange={e => changeFilters(e, 'transaction')}
                    disabled={startDate || endDate}
                />
                <TextField
                    id="tracking"
                    label="Tracking"
                    type="text"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={tracking}
                    onChange={e => changeFilters(e, 'tracking')}
                    disabled={startDate || endDate}
                />
                <Button variant="contained" color="primary" onClick={submitFilter}>Filter</Button>
            </form>
            {loading ? <LargeSpinner /> : (<TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Edit</TableCell>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Recipient</TableCell>
                            <TableCell align="center">Created</TableCell>
                            <TableCell align="center">Last Modified</TableCell>
                            <TableCell align="center">Shipped</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Packing Slip</TableCell>
                            <TableCell align="center">Pick Ticket</TableCell>
                            <TableCell align="center">Ship</TableCell>
                            <TableCell align="center">Tracking</TableCell>
                            <TableCell align="center">Customer Reference</TableCell>
                            <TableCell align="center">Cancel / Restore</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map(o => (
                                <TableRow key={o._id}>
                                    <TableCell align="center"><Button variant="contained" color="primary" onClick={(e) => goEdit(e, o)}>Edit</Button></TableCell>
                                    <TableCell align="center" style={{ maxWidth: '8rem' }}><p style={{ overflow: 'scroll', overflowY: 'hidden' }}>{o._id}</p></TableCell>
                                    <TableCell align="center">
                                        {o.recipient.name} {o.recipient.contact}
                                        {o.recipient.countary !== 'US' || o.recipient.country !== 'United States' ? <><br /><strong>International? {o.recipient.country}</strong></> : null}
                                        {!o.recipient.phone || o.recipient.phone.length < 8 ? <><br /><span style={{ color: 'red' }}>No recipient phone number (or phone # too short)</span></> : null}
                                    </TableCell>
                                    <TableCell align="center">{o.createdAt.slice(0, 10)}</TableCell>
                                    <TableCell align="center">{o.createdAt === o.updatedAt ? null : o.updatedAt.slice(0, 10)}</TableCell>
                                    <TableCell align="center">{o.shipped}</TableCell>
                                    <TableCell align="center">{
                                        (() => {
                                            if (o.status === 1)
                                                return 'Pending'
                                            if (o.status === 1)
                                                return 'Shipped'
                                            else
                                                return 'Cancelled'
                                        })()
                                    }</TableCell>
                                    <TableCell align="center"><Link style={{ textDecoration: 'none', color: 'blue' }}  target="_blank" to={`/picking-slip/${o._id}`} >Packing Slip</Link></TableCell>
                                    <TableCell align="center"><Link style={{ textDecoration: 'none', color: 'blue' }} target="_blank" to={`/picking-ticket/${o._id}`}>Packing Ticket</Link></TableCell>
                                    <TableCell align="center"><Button variant="contained" color="primary" onClick={e => postShip(e, o._id)}>Ship</Button></TableCell>
                                    <TableCell align="center">{
                                        (() => {
                                                if(o.tracking && o.actual_carrier === 'FedEx')
                                                    return  <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${o.tracking}`} target="_blank" rel="noopener noreferrer">{o.tracking}</a>
                                                else if(o.tracking && o.actual_carrier === 'USPS')
                                                    return  <a href={`https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${o.tracking}`} target="_blank" rel="noopener noreferrer">{o.tracking}</a>
                                                else
                                                    return <p>{o.tracking}</p>
                                                }       
                                        )()
                                    }</TableCell>
                                    <TableCell align="center">{o.customer_reference}</TableCell>
                                    <TableCell align="center"><Button variant="contained" color={o.status === 3 ? 'primary' : 'secondary'} onClick={e => cancelOrder(e, o.status, o._id)}>{o.status === 3 ? 'Restore' : 'Cancel'}</Button></TableCell>
                                </TableRow>
                            ))
                        ) : <p>lines are empty</p>}

                    </TableBody>
                </Table>
            </TableContainer>)}
            <div className={classes.pagination}>
                <Pagination count={pages} page={page} onChange={changePage} color="primary" />
            </div>
        </React.Fragment>
    )
}

export default GetOrders
