import React from 'react';


import SubNav from '../../components/global/SubNav/SubNav';
import getInventory from './getInventory/getInventory';
import CreateInventory from './CreateInventory/CreateInventory';
import ImportInventory from './ImportInventory/ImportInventory';
import UploadHistory from './UploadHistory/UploadHistory';
import { Switch, Route, useRouteMatch } from 'react-router-dom';


const Inventory = () => {
    const route = useRouteMatch();
    const subRoutes = [
        {name: 'Inventory', path: '/?page=1'},
        {name: 'Create new inventory Item', path: '/add-update/null'},
        {name: 'Import Inventory', path: '/import'},
        {name: 'Upload History', path: '/history'},
    ]


    return (
        <>
            <SubNav subRoutes={subRoutes}></SubNav>
            <Switch>
                <Route path={`${route.path}/`} component={getInventory} exact></Route>
                <Route path={`${route.path}/add-update/:id`} component={CreateInventory} exact></Route>
                <Route path={`${route.path}/import`} component={ImportInventory} exact></Route>
                <Route path={`${route.path}/history`} component={UploadHistory} exact></Route>
            </Switch>
        </>
    )
}

export default Inventory
