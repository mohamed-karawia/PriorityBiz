import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import SubNav from '../../components/global/SubNav/SubNav';
import Orders from '../../components/Orders/Orders/Orders';
import CreateNewOrder from '../../components/Orders/CreateNewOrder/CreateNewOrder';

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
                <Route path={`${route.path}/`} component={Orders} exact></Route>
                <Route path={`${route.path}/add-update`} component={CreateNewOrder} exact></Route>
            </Switch>
        </>
    )
}

export default Order
