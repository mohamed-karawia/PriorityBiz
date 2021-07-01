import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory, useRouteMatch } from 'react-router';
import queryString from 'query-string'
import classes from './GetUsers.module.scss';
import CreateUser from '../CreateUser/CreateUser';

import LargeSpinner from '../../../components/global/LargeSpinner/LargeSpinner'
import DataTable from '../../../components/global/DataTable/DataTable';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Pagination from '@material-ui/lab/Pagination';
import { getUsers } from '../../../store/actions';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const GetUsers = () => {

    const matClasses = useStyles();
    const dispatch = useDispatch();
    const { search } = useLocation()
    const history = useHistory();
    const route = useRouteMatch()

    /*console.log(search)*/
    const values = queryString.parse(search)
    const [page, setPage] = useState(parseInt(values.page))
    const [active, setActive] = useState(values.active);

    const handleChangeFilter = (e) => {
        history.replace(`/users?page=${page}&active=${e.target.value}`)
        setActive(e.target.value)
    }

    const changePage = (event, value) => {
        history.replace(`/users?page=${value}&active=${active}`)
        setPage(value)
    }


    useEffect(() => {
        dispatch(getUsers(active, page));
    }, [active, page, history])

    const headers = ['Edit', 'Adjust Discounts', 'ID', 'Company', 'First Name', 'Last Name', 'Status', 'Roles'];
    const rows = useSelector(state => state.users.users);
    const loading = useSelector(state => state.users.loading);
    const pages = useSelector(state => Math.ceil(state.users.total/10))
    const presentRows = [];
    if (rows) {
        rows.forEach(row => {
            presentRows.push({
                id: row._id,
                edit: 'Edit',
                adjust: 'adjust',
                showId: row._id,
                company: row.company,
                firstName: row.first_name,
                lastName: row.last_name,
                status: row.is_enabled ? 'Active' : 'Inactive',
                role: row.role,
            })
        });
    }

    const editUser = (id) => {
        console.log(id);
        const filterdUser = rows.filter(row => row._id == id)
        console.log(filterdUser[0])
        history.push(`${route.path}add-update/${id}`, filterdUser[0])
    }

    const adjustUser = (id) => {
        history.push(`/discounts/${id}`)
    }

    let data = (
        <h4 style={{ marginTop: '2rem', padding: '2rem' }}>No users found..</h4>
    )

    if (loading) {
        data = (<LargeSpinner />)
    } else {
        if (presentRows.length > 0) {
            data = (<DataTable headers={headers} rows={presentRows} editClicked={editUser} adjustClicked={adjustUser}></DataTable>)
        } else {
            data = (<h4 style={{ marginTop: '2rem', padding: '2rem' }}>No users found..</h4>)
        }
    }

    return (
        <>
            <div className={classes.filter}>
                <FormControl className={matClasses.formControl}>
                    <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        value={active}
                        onChange={handleChangeFilter}
                        className={matClasses.selectEmpty}
                    >

                        <MenuItem value={'all'}>All</MenuItem>
                        <MenuItem value={'active'}>Active</MenuItem>
                        <MenuItem value={'Inactive'}>Not Active</MenuItem>
                    </Select>
                </FormControl>
            </div>
            {data}
            <div className={classes.pagination}>
                <Pagination count={pages} page={page} onChange={changePage} color="primary" />
            </div>
        </>
    )
}

export default GetUsers
