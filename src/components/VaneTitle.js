/* eslint-disable */
import React,{useState} from 'react';
import Sidebar from './Sidebar/Sidebar';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import '../App.css';
import {Link} from 'react-router-dom';
import { IoMdLogOut } from 'react-icons/io';

import axios from 'axios';
axios.defaults.withCredentials = true;
import {dev_ver} from '../pages/global_const'

function VaneTitle({isLogin,isAdmin}){
    
    const [search, setSearch] = useState('')
    const [id, setId] = useState(1)
    function logOut()
    {
      
      
      axios.get(`http://${dev_ver}:4000/api/logout`)
      .then(()=>{
        alert('로그아웃 하였습니다.')
      })
      //var expireDate = new Date();
      //expireDate.setDate(expireDate.getDate() - 1);
      //document.cookie = "user= " + "; expires=" + expireDate.toGMTString() + "; path=/";
      window.location.replace("/")
    }

    function mainSearch()
    {
      
      
      axios.post(`http://${dev_ver}:4000/api/mainsearch`,{check:id, name:search})
      .then((result)=>{
        console.log(result.data)
        if(result.data.id != undefined)
        {
          
          
          if(id==1)
              window.location.replace(`/exhibition3/${result.data.id}`)
            

          else if(id == 2)
              window.location.replace(`/artist01/${result.data.id}`)


          else if(id==3)
             window.location.replace(`/exhibition2/${result.data.id}`)
        }
        else if(result.data.err)
        {
          alert('해당 이름의 결과는 존재하지 않습니다.')
        }
      })
      .catch((err)=>{
        alert(err)
      })
      
    }

    const onKeyPress = (e) => {
      if(e.key == 'Enter'){
        mainSearch()
      }
  }

    return(
      <>
      <div className="art_data_title">
        <div className="logo">
            <Link to="/">
              <img src="/img/logo.png" alt="로고" />
            </Link>       
        </div>
      </div>
        <ul className="menu_bar">
        <li><Link to="/home">MainPage</Link></li>
          <li><Link to="/home2">Today Artwork</Link></li>
          <li><Link to="/home3">Weekly Exhibition</Link></li>
          <li><Link to="/home4">New Artwork</Link></li>
          { isAdmin && <li><Link to="/uploadartist">Admin</Link></li>}
        </ul>
        

        <div className="search_bar">
          <select name = "type" onChange={(e)=>{setId(e.target.value)}}>
              <option value="1" >작품명</option>
              <option value="2" >작가명</option>
              <option value="3" >전시관</option>
            </select>

          <input type="text" placeholder="검색" onKeyPress={onKeyPress} onChange={(e) => {setSearch(e.target.value)}} />
          <img src="/img/search_btn.png" onClick={mainSearch} alt="검색버튼"/>
        </div>
        <div className="user_icon">
        <Link to="/mypage"><div className="icon_sample"></div></Link>
        </div>

      
      {isLogin=='true' && <div className="title_login_btn" onClick={logOut}><p>Logout</p> </div>}
      {isLogin=='false' && <div className="title_login_btn"><Link to="/loginPage"><p >Login</p></Link></div> }
      </>
    )
  }

function Show_window_first(props){
    return(
       <div className="show_window">
         <div><img src="/img/picture.png" alt="그림" /></div>
         <div>
           <p className="artist_name">Joan Miro : Joan</p>
           <p className="day">Mar 2 - Jul 21, 2021</p>
           <p className="musium_name">MoMA Museum</p>
         </div>
       </div>
    )
  }
  function Main_show_window(props){
    return(
      <div className="main_show_window">
        <div><img src="/img/picture.png" alt="그림" /></div>
        <div>Joan Miro : Joan</div>
        <div>MoMA Museum</div>
      </div>
  
    )
  }
export default VaneTitle;