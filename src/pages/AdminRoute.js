

import React,{useLayoutEffect,useState} from 'react';
import {Redirect, Route} from 'react-router-dom';
import doTokenExist from './doTokenExist';
import axios from 'axios';
import {dev_ver} from './global_const';
function AdminRoute({component : Component ,isLogin,isAdmin, ...rest})
{
  
  useLayoutEffect(()=>{
    console.log(isAdmin)
    //let temp =  document.cookie.toString().split(';')
    //console.log(temp[0])
 
     //      if(temp[0]== null || temp[0]==undefined || temp[0]=="")
      //     {
        //    console.log(temp[0]+"\n생성된 토큰 \n"+doTokenExist);
         //   window.location.href='/loginPage';
          // }
            
            
    
  },[])
 
    
    return (
        
        <Route {...rest} render={props =>
          isLogin && (isAdmin == 'ROLE_ADMIN') ? (
              <Component {...props} />
            ) : (
              <Redirect to="/loginPage"/>
            )
          }
        />
      );
    }

    export default AdminRoute;