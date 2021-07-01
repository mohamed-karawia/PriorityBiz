import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import SubNav from '../../components/global/SubNav/SubNav';
import GetOrders from './GetOrders/GetOrders';
import CreateOrder from './CreateOrder/CreateOrder';

import classes from './Orders.module.scss';

const Order = () => {
    const route = useRouteMatch();
    const subRoutes = [
        {name: 'Orders', path:'/'},
        {name: 'Create New Order', path:'/add-update'},
    ]

    return (
        <>
            <SubNav subRoutes={subRoutes}></SubNav>
            <Switch>
                <Route path={`${route.path}/`} component={GetOrders} exact></Route>
                <Route path={`${route.path}/add-update`} component={CreateOrder} exact></Route>
            </Switch>
        </>
    )
}

export default Order
