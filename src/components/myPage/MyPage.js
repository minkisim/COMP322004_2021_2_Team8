import React, { Component, useEffect, useState } from 'react';
import  './MyPage.css';
import islogin from '../../pages/doTokenExist';
import {Link} from 'react-router-dom';

import {dev_ver} from '../../pages/global_const';
import axios from 'axios';
axios.defaults.withCredentials = true;

function MyPage({history}){
       // console.log(islogin);
        const [userdata, setUserdata] = useState({
                username:'',
                name:'',
                email:''
        })

        const [myPicture,setmyPicture] = useState(
                [
                    {
                        artist: '',
                        artname: '',
                        ownerindex: '',
                        imgUrl: '',
                        isauctioned:''                
                    }
                ]
            )


       


       useEffect(() => {
        
                        //console.log("로그인 유무 검사")
                        axios.get(`http://${dev_ver}:4000/api/checkAdmin`)      
                        .then((result) => {
                                if(result.data.success==false)
                                {
                                        alert('로그인이 필요합니다')
                                        //console.log(result.data.success)
                                        
                                        window.location.replace("/loginPage")
                                }

                                else{
                                        setUserdata(result.data)
                                }
                        })
                        .catch((err)=>{
                                alert(err)
                        })
       
                         //get으로 바꿈
                         axios.get(`http://${dev_ver}:4000/api/Transfer/artdata`)      
                         .then((result) => {
                                 if(result.data.success==false)
                                 {
                                         alert('로그인이 필요합니다')
                                        
                                         window.location.replace("/")
                                 }
 
                                 else{
                                     //데이터 받아오기
                                        setmyPicture(result.data)
                                        console.log(result.data)
                                 }
                         })
                         .catch()
       }, [])
        
       function quit()
       {
        if(window.confirm('탈퇴하시겠습니까?'))
        {
                var jsondata = {username : userdata.username}
                axios.post(`http://${dev_ver}:4000/api/deleteuser`,jsondata)
                .then((result)=>{
                        if(result.data.success)
                        {
                                alert('탈퇴하였습니다.')
                                window.location.replace("/")
                        }
                })
                .catch()
                
        }

       }

    return(
            <div className="myPage_Page">
                {/*개인 정보*/}
                <p className="personal_data_title">내 정보</p>
                <div className="MyQuit_button" onClick={quit}><p>회원 탈퇴</p></div>  
                <div className="personal_data_div">
                        <p>이름 : {userdata ? userdata.name : null}</p>
                        <p>이메일 : {userdata ? userdata.email : null}</p>
                </div>
                <Link to="/Myauction"><div className="MyAuction_button"><p>내 경매</p></div></Link>
                <Link to={`/transfer?mine=${userdata.username}`}><div className="Transfer_button"><p>보유 작품 양도</p></div> </Link>
                
                {/*보유 중인  작품 목록*/}
                <p className="name">보유 작품</p>
                <div className="collection">
                        <div className="collection_header_flex">
                                <div><p className="collect_num">번호</p></div>
                                <div><p className="collect_art">작품명</p></div>
                                <div><p className="collect_artist">작가명</p></div>
                                <div><p className="collect_day">구매 날짜</p></div>
                        </div>


                        {/*이 데이터의 반복 */}
                        
                        {myPicture[0] !=undefined && myPicture.map((data,index)=>
                                <div className="collection_data_flex">
                                        <div><p className="data_num">{index+1}</p></div>
                                        <div><p className="data_picture1">{data.artname}</p></div>
                                        <div><p className="data_artist1">{data.artist}</p></div>
                                        <div><p>{data.expired}</p></div>
                                 </div>

                        ) }

                        
                        {/* 데이터 반복 끝. */}     
                </div>

                {/*
                <p className="name">관심 작품</p>
                <div className="like_art">
                <div className="collection_header_flex">
                                <div><p className="like_art_num">번호</p></div>
                                <div><p className="like_art_art">작품명</p></div>
                                <div><p className="like_art_artist">작가명</p></div>
                                
                        </div>


                        
                        {
                                
                        }

                        <div className="collection_data_flex">
                                <div><p className="data_num">1</p></div>
                                <div><p className="data_picture2">picutre</p></div>
                                <div><p className="data_artist2">artist</p></div>
             
                        </div>
                        <div className="collection_data_flex">
                                <div><p  className="data_num">2</p></div>
                                <div><p className="data_picture2">picutre</p></div>
                                <div><p className="data_artist2">artist</p></div>
                      
                        </div>      
                        <div className="collection_data_flex">
                                <div><p  className="data_num">3</p></div>
                                <div><p className="data_picture2">picutre</p></div>
                                <div><p className="data_artist2">artist</p></div>
                                
                        </div>         
                        <div className="collection_data_flex">
                                <div><p className="data_num">4</p></div>
                                <div><p className="data_picture2">picutre</p></div>
                                <div><p className="data_artist2">artist</p></div>
                        </div>    
                        <div className="collection_data_flex">
                                <div><p className="data_num">5</p></div>
                                <div><p className="data_picture2">picutre</p></div>
                                <div><p className="data_artist2">artist</p></div>
                        </div>    
                          
                </div>
                */}

            </div>


    )

}
export default MyPage;