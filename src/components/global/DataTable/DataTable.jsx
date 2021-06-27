import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const DataTable = (props) => {

  const handleClick = (id) => {
    props.editClicked(id);
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {props.headers.map(header => (
              <TableCell key={header} align="center">{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => (
            <TableRow key={row.id}>
              {
                Object.keys(row).map(key => {
                  if (key == 'id') {
                    return null
                  }else if(key == 'edit'){
                    return <TableCell align="center"><Button variant="contained" color="primary" key={row['id']} onClick={(key)=> handleClick(row['id'])}>Edit</Button></TableCell>
                  }
                  else {
                    return <TableCell align="center">{row[key]}</TableCell>
                  }

                })
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DataTable;
