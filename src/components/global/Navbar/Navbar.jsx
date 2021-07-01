import React from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/actions/index';

import classes from './Navbar.module.scss'

const Navbar = () => {
    const dispatch = useDispatch();
    const route = useLocation();
    const history = useHistory();

    const role = useSelector(state => state.auth.role)

    const logoutUser = () =>{
        dispatch(actions.logout())
        history.replace('/login')
    }

    let lowerNav = (
        <div className={classes.Nav__lower}>
            <ul className={classes.Nav__lower__list}>
                <li className={classes.Nav__lower__list__item}><NavLink to='/' activeClassName={classes.activeRoute} exact>Home</NavLink></li>
                <li className={classes.Nav__lower__list__item}><NavLink to='/order' activeClassName={classes.activeRoute}>Orders</NavLink></li>
                <li className={classes.Nav__lower__list__item}><NavLink to='/inventory?page=1' activeClassName={classes.activeRoute}>Inventory</NavLink></li>
                <li className={classes.Nav__lower__list__item}><NavLink to='/recipent?page=1' activeClassName={classes.activeRoute}>Recipents</NavLink></li>
                {role === 'superadmin' ? <li className={classes.Nav__lower__list__item}><NavLink to='/users?page=1&active=all' activeClassName={classes.activeRoute}>Users</NavLink></li> : null}
            </ul>
            <button onClick={logoutUser}>Logout</button>
        </div>
    )

    if(route.pathname === '/login'){
        lowerNav = null
    }

    return (
        <nav className={classes.Nav}>
            <h1 className={classes.Nav__heading}>PriorityBiz Shipping (codementor)</h1>
            {lowerNav}
        </nav>
    )
}

export default Navbar
