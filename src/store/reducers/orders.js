import * as actionTypes from '../actions/actionTypes'

const initialState = {
    ordersLines : [],
    loading: false,
}

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.FETCH_ORDERS_START:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_ORDERS_AND_UPDATE_SUCCESS:
            return{
                ...state,
                ordersLines : action.data,
                loading: false
            }
        default :
            return state;
    }
}

export default reducer;