import * as actionTypes from './actionTypes';
import * as actions from './index'
import axios from 'axios'

export const getOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    }
}

export const getOrderAndUpdateSuccess = (data) => {
    return {
        type: actionTypes.FETCH_ORDERS_AND_UPDATE_SUCCESS,
        data
    }
}

export const getOrderAndUpdate = (id) => {
    return dispatch => {
        dispatch(getOrdersStart())
        axios.get(`/order/add-update/${id}`)
        .then(res => {
            console.log(res)
            dispatch(getOrderAndUpdateSuccess(res.data.items_in_order))
        }).catch(err => {
            console.log(err.response)
        })
    }   
}

export const addInventory = (data) => {
    return dispatch => {
        axios.post('/order/add-update/add-inventory', data)
        .then(res => {
            console.log(res)
            dispatch(getOrderAndUpdate(data.orderId))
        })
        .catch(err => {
            console.log(err)
        })
    }
}

export const removeOrder = (id, orderId) => {
    return dispatch => {
        axios.post('/order/add-update/remove-inventory', {
            lineItemId: id
        })
        .then(res => {
            console.log(res)
            dispatch(getOrderAndUpdate(orderId))
        })
        .catch(err => {
            console.log(err.response)
        })
    }
}