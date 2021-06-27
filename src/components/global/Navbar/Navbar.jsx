import React from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/actions';

import classes from './Navbar.module.scss'

const Navbar = () => {
    const dispatch = useDispatch();
    const route = useLocation();
    const history = useHistory();

    const role = useSelector(state => state.auth.role)

    const logout = () =>{
        dispatch(actions.logout)
        history.go('/login')
    }

    let lowerNav = (
        <div className={classes.Nav__lower}>
            <ul className={classes.Nav__lower__list}>
                <li className={classes.Nav__lower__list__item}><NavLink to='/' activeClassName={classes.activeRoute} exact>Home</NavLink></li>
                <li className={classes.Nav__lower__list__item}><NavLink to='/order' activeClassName={classes.activeRoute}>Orders</NavLink></li>
                <li className={classes.Nav__lower__list__item}><NavLink to='/inventory' activeClassName={classes.activeRoute}>Inventory</NavLink></li>
                <li className={classes.Nav__lower__list__item}><NavLink to='/recipent' activeClassName={classes.activeRoute}>Recipents</NavLink></li>
                {role === 'superadmin' ? <li className={classes.Nav__lower__list__item}><NavLink to='/users' activeClassName={classes.activeRoute}>Users</NavLink></li> : null}
            </ul>
            <button onClick={logout}>Logout</button>
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
