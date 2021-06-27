import React from 'react';


import SubNav from '../../components/global/SubNav/SubNav';
import getInventory from './getInventory/getInventory';
import CreateInventory from './CreateInventory/CreateInventory';
import { NavLink, Switch, Route, useRouteMatch } from 'react-router-dom';


const Inventory = () => {
    const route = useRouteMatch();
    const subRoutes = [
        {name: 'Inventory', path: '/'},
        {name: 'Create new inventory Item', path: '/add-update/null'}
    ]


    return (
        <>
            <SubNav subRoutes={subRoutes}></SubNav>
            <Switch>
                <Route path={`${route.path}/`} component={getInventory} exact></Route>
                <Route path={`${route.path}/add-update/:id`} component={CreateInventory} exact></Route>
            </Switch>
        </>
    )
}

export default Inventory
