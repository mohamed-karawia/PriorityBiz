import React from 'react';
import { useSelector } from 'react-redux'
import { Redirect, Switch, Route } from 'react-router';
import Auth from './pages/Auth/Auth';
import Home from './pages/home/home';
import Orders from './pages/Orders/Orders';
import Inventory from './pages/Inventory/Inventory';
import Recipents from './pages/Recipents/Recipents';

const Routes = () => {
    const isAuth = useSelector(state => state.auth.token !== null)

    let routes = (
        <Switch>
          <Route path="/login" component={Auth}></Route>
          <Redirect to="/login" />
        </Switch>
      )
      if (isAuth) {
        routes = (
          <Switch>
            <Route path="/" component={Home} exact></Route>
            <Route path="/order" component={Orders}></Route>
            <Route path="/inventory" component={Inventory}></Route>
            <Route path="/recipent" component={Recipents}></Route>
            <Redirect to="/" />
          </Switch>
        )
      }
    return ({routes})
}

export default Routes;
