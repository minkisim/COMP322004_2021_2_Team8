/* eslint-disable */

import React, { PureComponent,useState, useEffect,useLayoutEffect } from 'react';
import {BrowserRouter, Router, Switch, Route, Link} from 'react-router-dom'
import '../App.css';

/* vaneTitle and  SideBar Part*/
import VaneTitle from '../components/VaneTitle';
import Sidebar from '../components/Sidebar/Sidebar';

/* Home import Part */
import Home from '../components/home/Home01';
import Home2 from '../components/home/Home02';
import Home3 from '../components/home/Home03';
import Home4 from '../components/home/Home04';

/* LoginPage Part */
import MyPage from '../components/myPage/MyPage';
import MyAuction from '../components/myPage/MyAuction';
import LoginPage from './LoginPage';
import SignupPage from './signupPage';
import Transfer from '../components/myPage/Transfer';
import AuctionMain from '../components/auction/AuctionMain';
import Auctiondata from '../components/auction/Auctiondata';
import AuctionPay from '../components/auction/AuctionPay';
import UploadAuction from './Uploadauction';
import UploadArtwork from './Uploadartwork';
import UploadArtist from './Uploadartist';
import SearchArtist from './Searchartist';
import SearchArtwork from './searchArtwork';
/* Exhibition Part */
import Exhibition from '../components/exhibition/exhibition1';
import Exhibition2 from '../components/exhibition/exhibition2';
import Exhibition3 from '../components/exhibition/exhibition3';

/* Artist Part */
import Artist from '../components/box/Artist';
import Artist01 from '../components/box/Artist01';

/*Artwork Part*/
import Artwork from '../components/box/Artwork';

/*Route setting*/
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import AdminRoute from './AdminRoute';

/*Error part */
import  Error404  from './Error404';

/*Title part */
import TitlePage from '../components/home/TitlePage';

import {dev_ver} from './global_const';

import axios from 'axios';
axios.defaults.withCredentials = true;

function MainPage({isLogin, isAdmin}){
/*
    const [isAdmin, setIsAdmin] = useState('');
    const [isLogin, setIsLogin] = useState('');
    //로그인 검사
    useLayoutEffect(() => {
       
                        
                        //axios.get(`http://${dev_ver}:4000/api/checkAdmin`)
                        fetch(`http://${dev_ver}:4000/api/checkAdmin`,{
                            method:'get',
                            credentials: 'include'
                        })
                        .then(result=>result.json())      
                        .then((result) => {
                            console.log(result)

                            if(result.success)
                            {
                                setIsLogin('true')
                                    
                                if(result.userrole == 'ROLE_ADMIN')
                                { 
                                    setIsAdmin(result.userrole);
                                            
                                }
                            }
                            /*
                            else if(result.expire)//토큰 기한이 만료되었을 경우
                            {
                                console.log('토큰 만료 : \n')
                                var expireDate = new Date();
                                expireDate.setDate(expireDate.getDate() - 1);
                                document.cookie = "user= " + "; expires=" + expireDate.toGMTString() + "; path=/";
                                
                            }
                              /  
                        })
                        .catch((err) => {
                            alert(err)
                        })
       
           
       }, [])

*/

    return (
        <BrowserRouter> 
        
        <div>
            <VaneTitle isLogin={isLogin} isAdmin={isAdmin} />
            <Sidebar />
        </div>
        
        <div>
            <Switch>
                <Route path="/home" component={Home} exact></Route>
                <Route path="/home2" component={Home2} exact ></Route>
                <Route path="/home3" component={Home3} exact></Route>
                <Route path="/home4" component={Home4} exact></Route>
    
                <Route path="/exhibition" component={Exhibition} exact></Route>
                <Route path="/exhibition2" component={Exhibition2} exact></Route>
                <Route path="/exhibition2/:exhibition" component={Exhibition2} exact></Route>
                <Route path="/exhibition3/:id" component={Exhibition3} exact></Route>
                <Route path="/exhibition3" component={Exhibition3} exact></Route>

                <Route path="/artwork" component={Artwork} exact></Route>
    
                <Route path="/artist" component={Artist} exact></Route>
                <Route path="/artist01" component={Artist01} exact></Route>
                <Route path="/artist01/:artist" component={Artist01} exact></Route>
    
                {<Route  path="/loginPage" restricted={true} component={LoginPage} exact></Route>  }
                {<Route  path="/signupPage" restricted={true} component={SignupPage} exact></Route>} 
                
                { isLogin=='true' && <PrivateRoute isLogin={isLogin} path="/mypage" component={MyPage} exact></PrivateRoute>            } 
                { isLogin=='true' && <PrivateRoute isLogin={isLogin} path="/myauction" component={MyAuction} exact></PrivateRoute>      }   
                { isLogin=='true' && <PrivateRoute isLogin={isLogin} path="/Transfer" component={Transfer} exact></PrivateRoute>        }  
                { isLogin=='true' && <PrivateRoute isLogin={isLogin} path="/auctiondata" component={Auctiondata} exact></PrivateRoute>  } 
                { isLogin=='true' && <PrivateRoute isLogin={isLogin} path="/auctionpay" component={AuctionPay} exact></PrivateRoute>    }  


                { isLogin=='false' && <PrivateRoute isLogin={isLogin} path="/mypage" component={MyPage} exact></PrivateRoute>            } 
                { isLogin=='false' && <PrivateRoute isLogin={isLogin} path="/myauction" component={MyAuction} exact></PrivateRoute>      }   
                { isLogin=='false' && <PrivateRoute isLogin={isLogin} path="/Transfer" component={Transfer} exact></PrivateRoute>        }  
                { isLogin=='false' && <PrivateRoute isLogin={isLogin} path="/auctiondata" component={Auctiondata} exact></PrivateRoute>  } 
                { isLogin=='false' && <PrivateRoute isLogin={isLogin} path="/auctionpay" component={AuctionPay} exact></PrivateRoute>    }   
                {<Route  path="/auctionmain"  component={AuctionMain} exact></Route> }   
                {console.log("isLogin : "+isLogin)}
                
                
                


                { isLogin && isAdmin && <AdminRoute path="/uploadartwork" isLogin={isLogin} isAdmin={isAdmin}  component={UploadArtwork} exact></AdminRoute> }
                { isLogin && isAdmin && <AdminRoute path="/uploadartist"  isLogin={isLogin} isAdmin={isAdmin} component={UploadArtist} exact></AdminRoute>   }
                { isLogin && isAdmin && <AdminRoute path="/uploadauction" isLogin={isLogin} isAdmin={isAdmin}  component={UploadAuction} exact></AdminRoute> }
                { isLogin && isAdmin && <AdminRoute path="/searchartist"  isLogin={isLogin} isAdmin={isAdmin} component={SearchArtist} exact></AdminRoute>   }
                { isLogin && isAdmin && <AdminRoute path="/searchartwork" isLogin={isLogin} isAdmin={isAdmin}  component={SearchArtwork} exact></AdminRoute> }
                
                
                <Route path="/" component={TitlePage} exact></Route>


                { !(isLogin==undefined || isLogin=='' || isLogin.length<1) && <Route component={Error404}></Route>}
            </Switch>            
        </div> 
        
        </BrowserRouter>
    )

}

export default MainPage;