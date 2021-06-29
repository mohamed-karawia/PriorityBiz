import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';


import Navbar from './components/global/Navbar/Navbar';
import Auth from './pages/Auth/Auth';
import Home from './pages/home/home';
import Orders from './pages/Orders/Orders';
import Inventory from './pages/Inventory/Inventory';
import Recipents from './pages/Recipents/Recipents';
import Users from './pages/Users/Users'
import Discounts from './pages/Discounts/Discounts';

import * as actions from './store/actions/index'




function App() {
  const dispatch = useDispatch()
  const history = useHistory();
  console.log(history);
  const isAuth = useSelector(state => state.auth.token !== null);
  const role = useSelector(state => state.auth.role)
  const token = useSelector(state => state.auth.token)


  useEffect(() => {
    dispatch(actions.authCheckState())
  }, [])

  axios.defaults.baseURL = 'https://scms-api.herokuapp.com';
  axios.defaults.headers.common['Authorization'] = `auth ${token}`;

  let routes = (
    <Switch>
      <Route path="/login" component={Auth}></Route>
    </Switch>
  )
  if (isAuth) {
    if(role === 'superadmin'){
      routes = (
        <Switch>
          <Route path="/order" component={Orders}></Route>
          <Route path="/inventory" component={Inventory}></Route>
          <Route path="/recipent" component={Recipents}></Route>
          <Route path="/users" component={Users}></Route>
          <Route path="/discounts/:id" component={Discounts}></Route>
          <Route path="/" component={Home} exact></Route>
          <Redirect to="/" />
        </Switch>
      )
    }else {
      routes = (
        <Switch>
          <Route path="/order" component={Orders}></Route>
          <Route path="/inventory" component={Inventory}></Route>
          <Route path="/recipent" component={Recipents}></Route>
          <Route path="/" component={Home} exact></Route>
          <Redirect to="/" />
        </Switch>
      )
    }
  }

  return (
      <Router>
        <Navbar />
          {routes}
      </Router>
  );
}

export default App;