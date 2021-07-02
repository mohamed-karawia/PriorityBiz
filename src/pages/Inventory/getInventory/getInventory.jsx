import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import * as actions from '../../../store/actions/index'
import queryString from 'query-string';

import classes from './getInventory.module.scss';

import LargeSpinner from '../../../components/global/LargeSpinner/LargeSpinner';
import DataTable from '../../../components/global/DataTable/DataTable';
import Pagination from '@material-ui/lab/Pagination';


const GetInventory = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const route = useRouteMatch()
    const { search } = useLocation()
    const values = queryString.parse(search)
    const [page, setPage] = useState(parseInt(values.page))

    const pages = useSelector(state => Math.ceil(state.inventory.total/10))

    useEffect(() => {
        dispatch(actions.getInventory(page))
    }, [page])

    const headers = ['Edit', 'Name', 'Item #', 'Case Quantity', 'Description', 'Stock (Case)', 'Stock (Units)', 'Total Units', 'Split Case', 'Case Weight (pounds)', 'Re-order Quantity', 'Length (inches)', 'Width (inches)', 'Height (inches)', 'Ship Ready']
    const rows = useSelector(state => state.inventory.inventory)
    const presentRows = [];
    rows.forEach(row => {
        presentRows.push({
            id: row._id,
            edit: 'Edit',
            name: row.name,
            item: row.number,
            caseQuantity: row.case_quantity,
            description: row.description,
            stockCase: row.qoh_case,
            stockUnits: row.qoh_units,
            totalUnit: row.qoh_case*row.case_quantity+row.qoh_units,
            splitCase: 'splitCase',
            caseWeight: row.case_weight,
            reOrder: row.reorder_quantity,
            length: row.length,
            width: row.width,
            height: row.height,
            shipReady: row.ship_ready ? 'Ready' : 'Not Ready'
        })
    });
    const loading = useSelector(state => state.inventory.loading);

    const changePage = (event, value) => {
        history.replace(`/inventory?page=${value}`)
        setPage(value)
    }


    const editEnventory = (id) => {
        const filteredInv = rows.filter(row => row._id == id);
        const inv = filteredInv[0]
        history.push(`${route.path}add-update/${id}`, inv)
    }

    return (
        <React.Fragment>
            {loading ? <LargeSpinner /> : <DataTable rows={presentRows} headers={headers} editClicked={editEnventory}/>}
            {pages > 1 ? (<div className={classes.pagination}>
                <Pagination count={pages} page={page} onChange={changePage} color="primary" />
            </div>) : null}
        </React.Fragment>
    );
}

export default GetInventory
