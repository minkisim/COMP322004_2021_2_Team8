import React from 'react';
import { Route,Redirect } from 'react-router-dom';
import doTokenExist from './doTokenExist';

function PublicRoute({ component: Component,isLogin, restricted, ...rest }) {
    
  //console.log(document.cookie)
    return (
      <Route
        {...rest}
        render={props =>
         (isLogin == 'true') && restricted ? (
            <Redirect to="/" />
          ) : (
            <Component {...props} />
          )
        }
      />
    );
  }
  
  export default PublicRoute;