import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import RepoList from './components/RepoList';
import authService from "./services/authService"
import Dashboard from "./components/Dashboard"
import RepoDetails from './components/RepoDetails';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact={true}
          path='/'
          render={() =>
              <Redirect to='login'></Redirect>
          }
        />  
        <Route
          exact={true}
          path='/login'
          render={(e, props) =>
            authService.getAuthToken() ? (
              <Redirect to='dashboard'></Redirect>
            ) : (
              <Login {...e} data={props} />
            )
          }
        />
        <Route
          exact={true}
          path='/dashboard'
          render={() =>
            <Redirect to='repolist'></Redirect>
          }
        />
        <Route
          exact={true}
          path='/repolist'
          render={(e, props) => 
            authService.getAuthToken() ? (
                <Dashboard>
                  <RepoList {...e} data={props} />
                </Dashboard>
              ) : (
                <Redirect to='login'></Redirect>
              )
           }
        />
        <Route
          exact={true}
          path='/repolist/:owner/:name'
          render={(e, props) => 
              <Dashboard>
                <RepoDetails {...e} data={props} />
              </Dashboard>
           }
        />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
