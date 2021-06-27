import React from 'react';
import { NavLink, Switch, Route, useRouteMatch } from 'react-router-dom';

import classes from './SubNav.module.scss';

const SubNav = (props) => {
    const route = useRouteMatch();

    return (
        <nav className={classes.SubNav}>
        <ul className={classes.SubNav__list}>
            {/*<li className={classes.SubNav__list__item}><NavLink to={`${route.path}/`}>Orders</NavLink></li>
            <li className={classes.SubNav__list__item}><NavLink to={`${route.path}/add-update`}>Create New Order</NavLink></li>
            <li className={classes.SubNav__list__item}><NavLink to='/'>Import Orders</NavLink></li>
            <li className={classes.SubNav__list__item}><NavLink to='/'>Export Shipped Orders</NavLink></li>
            <li className={classes.SubNav__list__item}><NavLink to='/'>Upload History</NavLink></li>*/}
            {props.subRoutes.map(subRoute => {
                return (
                    <li className={classes.SubNav__list__item} key={subRoute.name}><NavLink to={`${route.path}${subRoute.path}`} activeClassName={classes.activeRoute} exact>{subRoute.name}</NavLink></li>
                )
            })}
        </ul>
    </nav>
    )
}

export default SubNav
