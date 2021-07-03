import React, {useState} from 'react';
import { Link } from 'react-router-dom'
import classes from './Import.module.scss';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Spinner from '../../components/global/Spinner/Spinner'
import axios from 'axios';

const ImportRecipient = (props) => {
    const [selectedFile, setSelectedFile] = useState();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    const onFileChange = (e) => {
        setSelectedFile(e.target.files[0])
        console.log(selectedFile)
    }

    const uploadFile = () => {
        setLoading(true)
        const form = new FormData();
        form.append('uploads', selectedFile)
        axios.post(props.link, form)
        .then(res => {
            console.log(res)
            if(res.data.fail){
                setError(res.data.errors[0])
                setLoading(false)
                return
            }
            setLoading(false)
            setMessage('File Imported Successfully')
            setError('')
        })
        .catch(err => {
            console.log(err.response)
            setLoading(false)
            setError('An error occured please try again');
            setMessage('')
        })
    }

    return (
        <div className={classes.import}>
            <Alert severity="info" style={{ width: '100%' }}>This expects plain vanilla CSV files, not UTF-8 encoded CSV files, not Excel files.</Alert>
            <form>
                <label>{props.importLabel}</label>
                <input type="file" onChange={e => onFileChange(e)}/>
                {message ? <p style={{color: 'green'}}>{message} <Link to={props.redirectPath}>{props.redirectLabel}</Link></p> : null}
                {error ? <p style={{color: 'red'}}>{error}</p> : null}
                <Button variant="contained" color="primary" onClick={uploadFile}>{loading ? <Spinner /> : 'Upload'}</Button>
            </form>
        </div>
    )
}

export default ImportRecipient
