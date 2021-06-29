import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import classes from './UploadHistory.module.scss'

import DataTable from '../../../components/global/DataTable/DataTable';

const UploadHistory = () => {
    
    const headers = ['Created', 'User', 'Filename'];
    const data = []
    
    return (
        <React.Fragment>
            <form className={classes.filters__container}>
                <TextField
                    id="startDate"
                    label="Start Date"
                    type="date"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="startDate"
                    label="End Date"
                    type="date"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button variant="contained" color="primary" type="submit">Filter</Button>
            </form>
            {data.length > 0 ? <DataTable headers={headers} data={data}></DataTable> : <p>Data is empty..</p>}
        </React.Fragment>
    )
}

export default UploadHistory;
