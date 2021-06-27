import React, { useEffect } from 'react';
import * as actions from '../../../store/actions/index';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router';

import LargeSpinner from '../../../components/global/LargeSpinner/LargeSpinner';
import DataTable from '../../../components/global/DataTable/DataTable';

const GetRecipient = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    const route = useRouteMatch()

    useEffect(() => {
        dispatch(actions.getRecipients())
    }, [])


    const headers = ['Edit', 'Name', 'Contact', 'Phone', 'Email', 'Address']
    const rows = useSelector(state => state.recipients.recipients);
    const loading = useSelector(state => state.recipients.loading);
    const presentRows = [];
    rows.forEach(row => {
        presentRows.push({
            id: row._id,
            edit: 'Edit',
            name: row.name,
            contact: row.contact,
            phone: row.phone,
            email: row.email,
            address: row.street1,
        })
    });

    const editRecipient = (id) => {
        const filteredRecipient = rows.filter(row => row._id == id)
        console.log(filteredRecipient[0])
        history.push(`${route.path}add-update/${id}`, filteredRecipient[0])
    }

    return (
        <React.Fragment>
            {loading ? <LargeSpinner /> : <DataTable rows={presentRows} headers={headers} editClicked={editRecipient} />}
        </React.Fragment>
    )
}

export default GetRecipient
