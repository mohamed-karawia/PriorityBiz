import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import Navbar from './components/global/Navbar/Navbar';
import Auth from './pages/Auth/Auth';
import Home from './pages/home/home';
import Orders from './pages/Orders/Orders';
import Inventory from './pages/Inventory/Inventory';
import Recipents from './pages/Recipents/Recipents';
import Users from './pages/Users/Users'

import * as actions from './store/actions/index'


function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(actions.authCheckState())
  }, [])
  
  const isAuth = useSelector(state => state.auth.token !== null);
  const role = useSelector(state => state.auth.role)

  let routes = (
    <Switch>
      <Route path="/login" component={Auth}></Route>
      <Redirect to="/login" />
    </Switch>
  )
  if (isAuth) {
    if(role === 'superadmin'){
      routes = (
        <Switch>
          <Route path="/" component={Home} exact></Route>
          <Route path="/order" component={Orders}></Route>
          <Route path="/inventory" component={Inventory}></Route>
          <Route path="/recipent" component={Recipents}></Route>
          <Route path="/users" component={Users}></Route>
          <Redirect to="/" />
        </Switch>
      )
    }else {
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
  }

  return (
      <Router>
        <Navbar />
        <Switch>
          {routes}
        </Switch>
      </Router>
  );
}

export default App;