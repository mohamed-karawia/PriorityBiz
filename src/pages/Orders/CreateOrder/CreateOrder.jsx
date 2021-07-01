import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import * as actions from '../../../store/actions/index'
import classes from './CreateOrder.module.scss';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const CreateOrder = () => {
    const matClasses = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(actions.getRecipients())
    }, [])

    const loading = useSelector(state => state.recipients.loading);
    const recipients = useSelector(state => state.recipients.recipients)
    const [reci, setReci] = useState(null);

    const handleChangeReci = (e) => {
        setReci(recipients.find(p => p._id === e.target.value))

    }

    const goCreateRec = () => {
        history.push('/recipent/add-update/null')
    }

    const goOrders = (id) => {
        //history.push('/add-order', reci)
        console.log(id)
        axios.post('/order/add-update', {
            recipientId: id
        })
        .then(res => {
            console.log(res)
            history.push('/add-order', {
                ...reci,
                orderId: res.data.data._id
            })
        })
        .catch(err => {
            console.log(err)
        })
    }


    return (
        <div className={classes.Container}>
            <Button variant="contained" color="primary" onClick={goCreateRec}>Create New Recipient</Button>
            <div className={classes.Recipient}>
                <p>Or select existing recipient</p>
                <h2>Recipient</h2>
                <FormControl className={matClasses.formControl}>
                    <InputLabel id="demo-simple-select-label">Recipient</InputLabel>
                    <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        onChange={handleChangeReci}
                        className={matClasses.selectEmpty}
                    >
                        {recipients.map((reci => (
                            <MenuItem key={reci._id} value={reci._id}>{reci.name}</MenuItem>
                        )))}
                    </Select>
                </FormControl>
                {reci ? (<div className={classes.Details}>
                    <div className={classes.Details__box}>
                        <p>Name: <span>{reci.name}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>Contact: <span>{reci.contact}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>Phone: <span>{reci.phone}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>Email: <span>{reci.email}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>Street1: <span>{reci.street1}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>Street2: <span>{reci.street2}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>City: <span>{reci.city}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>State: <span>{reci.state}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>Zip/Postal Code: <span>{reci.postal}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>Country: <span>{reci.country}</span></p>
                    </div>
                    <Button variant="contained" color="primary" onClick={() => goOrders(reci._id)}>go</Button>
                </div>
                ) : null}
            </div>
        </div>
    )
}

export default CreateOrder
