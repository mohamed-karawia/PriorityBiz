import React, { useEffect, useState } from 'react';
import { useLocation, useHistory, Redirect } from 'react-router';
import * as actions from '../../../store/actions/index';
import { useDispatch, useSelector } from 'react-redux';
import classes from './AddOrder.module.scss'

import Spinner from '../../../components/global/Spinner/Spinner';
import LargeSpinner from '../../../components/global/LargeSpinner/LargeSpinner';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';


const AddOrder = () => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const pages = useSelector(state => Math.ceil(state.inventory.total/10))
    const [page, setPage] = useState(1);
    const [nextPageLoading, setNextPageLoading] = useState(false)

    useEffect(() => {
        if (location.state) {
            dispatch(actions.getOrderAndUpdate(location.state.orderId))
            dispatch(actions.getInventory(page))
        }
    }, [])

    const inventory = useSelector(state => state.inventory.inventory)
    const presentRows = [];
    inventory.forEach(row => {
        presentRows.push({
            id: row._id,
            name: row.name,
            item: row.number,
            caseQuantity: row.case_quantity,
            desc: row.description,
            stockCase: row.qoh_case,
            stockUnits: row.qoh_units,
            caseWeight: row.case_weight,
            reOrder: row.reorder_quantity,
            length: row.length,
            width: row.width,
            height: row.height,
            shipReady: row.ship_ready ? 'Yes' : 'No',
            add: 'Add to order'

        })
    });

    const addOrder = (e, invId) => {
        const data = {
            quantity_cases: 0,
            quantity_units: 0,
            inventoryId: invId,
            orderId: location.state.orderId,
        }
        dispatch(actions.addInventory(data))
    }

    const lines = useSelector(state => state.orders.ordersLines)
    const loading = useSelector(state => state.orders.loading)

    let newLines = lines;
    const editQuantityCase = (e, id) => {
        newLines = lines.map(line =>
            line._id === id
                ? { ...line, quantity_cases: Number(e.target.value) }
                : line
        );
    }
    const editQuantityUnits = (e, id) => {
        newLines = lines.map(line =>
            line._id === id
                ? { ...line, quantity_units: Number(e.target.value) }
                : line
        );
    }

    const saveOrder = (id) => {
        newLines.map(line => {
            if (line._id === id) {
                const data = {
                    quantity_cases: line.quantity_cases,
                    quantity_units: line.quantity_units,
                    inventoryId: line.item._id,
                    orderId: location.state.orderId,
                }
                dispatch(actions.addInventory(data))
            }
        })
    }

    const removeOrder = (id) => {
        dispatch(actions.removeOrder(id, location.state.orderId))
    }

    const orderComplete = () => {
        setNextPageLoading(true)
        axios.post('/order/add-update/select-ship-method', {
            orderId: location.state.orderId
        })
            .then(res => {
                setNextPageLoading(false)
                console.log(res)
                if(res.data.shipRayes.length < 1){
                    window.alert("Order can't be shipped (Wrong recipient info)")
                    return
                }else{
                    history.push('/ship-method', res.data)
                }
            })
            .catch(err => {
                setNextPageLoading(false)
                console.log(err.response.data.message)
                window.alert(err.response.data.message)
            })

    }

    const changePage = (e, value) => {
        setPage(value);
        dispatch(actions.getInventory(page))
    }

    return (
        <React.Fragment>
            {location.state ? (<div>
                <h2>Recipient: {location.state.name} {location.state.contact} | {location.state.country}</h2>
                <h1>Items on Order</h1>
                {loading ? <LargeSpinner /> : (<TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Number</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Quantity (Cases)</TableCell>
                                <TableCell align="center">Quantity (Units)</TableCell>
                                <TableCell align="center">Remove</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lines.length > 0 ? (
                                lines.map(row => (
                                    <TableRow>
                                        <TableCell align="center">{row.item.number}</TableCell>
                                        <TableCell align="center">{row.item.name}</TableCell>
                                        <TableCell align="center">{row.item.description}</TableCell>
                                        <TableCell align="center">
                                            <p>{row.quantity_cases}</p>
                                            <input type="number" style={{ width: '4rem' }} onChange={e => editQuantityCase(e, row._id)} />
                                        </TableCell>

                                        <TableCell align="center">
                                            <p>{row.quantity_units}</p>
                                            <input type="number" style={{ width: '4rem' }} onChange={e => editQuantityUnits(e, row._id)} />
                                        </TableCell>

                                        <TableCell align="center">
                                            <Button variant="contained" color="primary" style={{ marginRight: '1rem' }} onClick={() => saveOrder(row._id)}>Save</Button>
                                            <Button variant="contained" color="secondary" onClick={() => removeOrder(row._id)}>Remove from Order</Button>
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                ))
                            ) : <p>lines are empty</p>}

                        </TableBody>
                    </Table>
                </TableContainer>)}
                {lines.length > 0 ? <Button variant="contained" color="primary" style={{ margin: '1rem' }} onClick={orderComplete}>{nextPageLoading ? <Spinner /> : 'Order Complete'}</Button> : null}
                {/************************************************************************ */}
                <h1>Add more to the order.</h1>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Item#</TableCell>
                                <TableCell align="center">Case Quantity</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Stock (Case)</TableCell>
                                <TableCell align="center">Stock (Units)</TableCell>
                                <TableCell align="center">Case Weight (pounds)</TableCell>
                                <TableCell align="center">Re-order Quantity</TableCell>
                                <TableCell align="center">Length (inches)</TableCell>
                                <TableCell align="center">Width (inches)</TableCell>
                                <TableCell align="center">Height (inches)</TableCell>
                                <TableCell align="center">Ship Ready</TableCell>
                                <TableCell align="center">Add</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inventory.map((i) => (
                                <TableRow>
                                    <TableCell align="center">{i.name}</TableCell>
                                    <TableCell align="center">{i.number}</TableCell>
                                    <TableCell align="center">{i.case_quantity}</TableCell>
                                    <TableCell align="center">{i.description}</TableCell>
                                    <TableCell align="center">{i.qoh_case}</TableCell>
                                    <TableCell align="center" style={{
                                        backgroundColor: ((i.qoh_case * i.case_quantity) + i.qoh_units) < i.reorder_quantity ? 'red' : 'white'
                                    }}>{i.qoh_units})</TableCell>
                                    <TableCell align="center">{i.case_weight}</TableCell>
                                    <TableCell align="center">{i.reorder_quantity}</TableCell>
                                    <TableCell align="center">{i.length}</TableCell>
                                    <TableCell align="center">{i.width}</TableCell>
                                    <TableCell align="center">{i.height}</TableCell>
                                    <TableCell align="center">{i.ship_ready ? 'Yes' : 'No'}</TableCell>
                                    <TableCell align="center"><Button variant="contained" color="primary" onClick={(e) => addOrder(e, i._id)}>Add to Orders</Button></TableCell>
                                </TableRow>
                            ))}
                            {/*<TableRow>
                            <TableCell align="center">test</TableCell>
                        </TableRow>*/}

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>) : <Redirect to="/order?page=1" />}
            {pages > 1 ? (<div className={classes.pagination}>
                <Pagination count={pages} page={page} onChange={changePage} color="primary" />
            </div>) : null}
        </React.Fragment>
    )
}

export default AddOrder