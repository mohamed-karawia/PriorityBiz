import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classes from './Sudo.module.scss';
import * as actions from '../../store/actions'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const Sudo = () => {
    const matClasses = useStyles();
    const dispatch = useDispatch();
    const [user, setUser] = useState('');

    useEffect(() => {
        dispatch(actions.getSudo())
    }, [])

    const users = useSelector(state => state.auth.users);

    const handleChangeUser = (e) => {
        setUser(e.target.value)
    }

    const changeUser = () => {
        dispatch(actions.changeSudo(user))
    }

    return (
        <div className={classes.Container}>
            <FormControl className={matClasses.formControl}>
                <InputLabel id="demo-simple-select-label">Users</InputLabel>
                <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    onChange={handleChangeUser}
                    className={matClasses.selectEmpty}
                >
                    {users.map((user => (
                        <MenuItem key={user._id} value={user._id}>{user.username}</MenuItem>
                    )))}
                </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={changeUser}>Go</Button>
        </div>
    )
}

export default Sudo
