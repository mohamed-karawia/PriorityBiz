import React, { useState } from 'react';
import { useLocation } from 'react-router';
import classes from './ShipMethod.module.scss';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const ShipMethod = () => {
    const location = useLocation();
    console.log(location.state);
    const lineItems = location.state.lineItem;
    const shipRates = location.state.shipRayes
    const [signature, setSignature] = useState('NO_SIGNATURE');
    const [notify, setNotify] = useState(false)
    const [shippingMethod, setShippingMethod] = useState([]);

    const changeMethod = (method, carrier, service) => {
        setShippingMethod([carrier, service])
        console.log(shippingMethod)
    }
    return (
        <React.Fragment>
            <div className={classes.RecipientDetails}>
                <h2>Recipient: {location.state.order.recipient.name} {location.state.order.recipient.contact} | {location.state.order.recipient.country}</h2>
                <p>Total Weight: {location.state.total_weight}</p>
                <p>Total Packages: {location.state.total_packages}</p>
                <p>Insurance Cost: {location.state.insurance_cost} (built in to rates below)</p>
            </div>
            <p>Shipment contents: </p>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Item Name</TableCell>
                            <TableCell align="center">Item #</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center"># (Cases)</TableCell>
                            <TableCell align="center"># (Units)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lineItems.length > 0 ? (
                            lineItems.map(line => (
                                <TableRow>
                                    <TableCell align="center">{line.item.name}</TableCell>
                                    <TableCell align="center">{line.item.number}</TableCell>
                                    <TableCell align="center">{line.item.description}</TableCell>
                                    <TableCell align="center">{line.quantity_cases}</TableCell>
                                    <TableCell align="center">{line.quantity_units}</TableCell>
                                </TableRow>
                            ))
                        ) : <p>lines are empty</p>}

                    </TableBody>
                </Table>
            </TableContainer>
            <div className={classes.Form}>
                <p>With FedEx or USPS Priority Mail parcel insurance for the first $100.00 is included at no extra cost. Additional insurance is available at additional cost (shown on the next page). To add additional insurance input the total declared value of this shipment. Leave blank for default insurance (if any)</p>
                <input type="number" style={{ height: '2rem', marginTop: '1rem' }} />
                <FormControl component="fieldset">
                    <RadioGroup aria-label="gender" name="gender1" value={signature} onChange={e => setSignature(e.target.value)}>
                        <FormControlLabel value="NO_SIGNATURE" control={<Radio />} label="No Signature Required" />
                        <FormControlLabel value="DIRECT_SIGNATURE" control={<Radio />} label="Direct Signature Required (anyone at delivery address)" />
                        <FormControlLabel value="ADULT_SIGNATURE" control={<Radio />} label="Adult Signature required (at delivery address, must show ID)" />
                    </RadioGroup>
                </FormControl>
                <p>Note: Additional Carrier fees for signature required services will be applied when shipment is processed.</p>
                <div className={classes.Form__shipment}>
                    <div>
                        <p>Please select a shipping method</p>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center"></TableCell>
                                        <TableCell align="center">Carrier</TableCell>
                                        <TableCell align="center">Service</TableCell>
                                        <TableCell align="center">List Rate</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {shipRates.length > 0 ? (
                                       
                                        shipRates.map(rate => (
                                            <TableRow>

                                                <TableCell align="center"><FormControlLabel control={<Radio />} onClick={(e) => changeMethod(e, rate.carrier, rate.service)} /></TableCell>

                                                <TableCell align="center">{rate.carrier}</TableCell>
                                                <TableCell align="center">{rate.service}</TableCell>
                                                <TableCell align="center">{rate.service}</TableCell>
                                            </TableRow>)
                                            )
                                            ) : <p>lines are empty</p>}
                                            <p>{shippingMethod}</p>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                        <div class={classes.subForm}>
                            <label>Shipment Identifier/Reference</label>
                            <input type="text" />
                            <p>shipment recipient: {location.state.order.recipient.email}</p>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="checkedB"
                                        color="primary"
                                        onChange={() => setNotify(!notify)}
                                        checked={notify}
                                    />
                                }
                                label="Check to receive a copy of this shipment's notifications"
                            />
                            <label>Additionally Notify (email)</label>
                            <input type="text" />
                            <label>Ship From Company</label>
                            <input type="text" />
                            <label>Ship From Phone</label>
                            <input type="text" />
                        </div>
                    </div>
                    <Button variant="contained" color="primary">Submit Shipment</Button>

                </div>
        </React.Fragment>
            )
}

            export default ShipMethod;
