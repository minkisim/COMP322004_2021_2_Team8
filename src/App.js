/* eslint-disable */

/* 이 부분은 글자 혹은 이미지 깨지는 부분 없음 */

import React,{useState,useLayoutEffect} from 'react';
import './App.css';
import MainPage from './pages/MainPage';
import {dev_ver} from './pages/global_const'
import axios from 'axios'
axios.defaults.withCredentials = true;

function App() {

  const [isAdmin, setIsAdmin] = useState('');
  const [isLogin, setIsLogin] = useState('');

    useLayoutEffect(() => {
        
                          
      axios.get(`http://${dev_ver}:4000/api/checkAdmin`)
      /*fetch(`http://${dev_ver}:4000/api/checkAdmin`,{
          method:'get',
          credentials: 'include'
      })
      .then(result=>result.json())*/      
      .then((result) => {
          

          if(result.data.success)
          {
              setIsLogin('true')
                  
              if(result.data.userrole == 'ROLE_ADMIN')
              { 
                  setIsAdmin(result.data.userrole);
                          
              }
          }
          else{
            setIsLogin('false')
          }
          /*
          else if(result.expire)//토큰 기한이 만료되었을 경우
          {
              console.log('토큰 만료 : \n')
              var expireDate = new Date();
              expireDate.setDate(expireDate.getDate() - 1);
              document.cookie = "user= " + "; expires=" + expireDate.toGMTString() + "; path=/";
              
          }
            */  
      })
      .catch((err) => {
          alert(err)
      })


  }, [])

  return (
    <div className="App">
         <MainPage isLogin={isLogin} isAdmin={isAdmin}/>  
         
    </div>
  )
}
export default App;
