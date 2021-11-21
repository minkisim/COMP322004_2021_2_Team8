/* global history */
/* global location */
/* global window */

/* eslint no-restricted-globals: ["off"] */
import React, { Component, useState, useEffect } from 'react';
import  './MyPage.css';
import {Link} from 'react-router-dom';
import {dev_ver} from '../../pages/global_const'
import axios from 'axios'
import { useAsync } from 'react-async';
function MyAuction(){
        const [userdata, setUserdata] = useState({
                username:'',
                name:'',
                email:''
        })

        

        const [ongoing,setOngoing] = useState()
        const [complete,setComplete] = useState()
        const [isLoading, setLoading] = useState(true);

        async function onload() {
                const result2 = await axios.get(`http://${dev_ver}:4000/api/checkAdmin`)      
                
                        if(result2.data.success==false)
                        {
                                alert('로그인이 필요합니다')

                                
                                window.location.replace("/loginPage")
                        }

                        else{
                                setUserdata(result2.data)

                                
                                const result = await axios.post(`http://${dev_ver}:4000/api/myauction`,{
                                        username: result2.data.username,
                                        id : result2.data.id
                                })
                                
                                
                                        /*
                                        console.log(result.data.temp1)
                                        console.log(result.data.temp2)
                                       setOngoing(result.data.temp1)
                                       setComplete(result.data.temp2)
                                        */
                                        let temp1 = []
                                        let temp2 = []
                                        console.log(result.data.dib)
                                       

                                        if(result.data.dib != undefined)
                                        {
                                        result.data.dib.map(async (data,index)=>{
                                                //console.log(data.artwork_id)

                                                
                                              
                                                       //console.log(response.data.isfirst)

                                                        
                                                        var enddate = data.end_point.split('-')
                                                        var diffDate2 = new Date(enddate[0],enddate[1]-1,enddate[2],0,0,0)
                                                        var currentDate = new Date()

                                                        

                                                        //
                                                        //console.log("ownerid : "+response.data.owner_id)
                                                        if(data.owner_id == null || data.owner_id.length<=0)
                                                        {
                                                                console.log("현재 주인 : "+data.owner_id)
                                                                if(diffDate2.getTime() - currentDate.getTime() < 0)
                                                                {
                                                                        //console.log('완료된 계약서')
                                                                        //setComplete([])
                                                                        if(data.isfirst=='yes')
                                                                        {
                                                                                temp2.push({
                                                                                        artwork_id : data.artwork_id,
                                                                                        artist : data.artist,
                                                                                        artname : data.artname,
                                                                                })
                                                                        }
                                                                }
                                                                else{
                                                                       //진행중인 계약서 
                                                                       //setOngoing([])
                                                                       temp1.push({
                                                                                artwork_id : data.artwork_id,
                                                                                artist : data.artist,
                                                                                artname : data.artname,

                                                                       })
                                                                }


                                                        }
                                                
                                        })
                                       }
                                        //console.log(temp1)
                                        //console.log(temp2)
                                        //console.log(ongoing)
                                        
                                        setOngoing(temp1)
                                        setComplete(temp2)
                                        setLoading(false)
                                        
                                        
                                        //history.go(0);
                                
                                
                        }
                

                 //get으로 바꿈
                 /*
                 axios.get(`http://${dev_ver}:4000/api/myauction`)      
                 .then((result) => {
                         if(result.data.success==false)
                         {
                                 alert('로그인이 필요합니다')
                                
                                 window.location.replace("/")
                         }

                         else{
                             //데이터 받아오기
                               
                         }
                 })
                 .catch()
                 */
        }

        useEffect(() => {
        
                        onload()
                        
        }, [])

    if(isLoading)
    {
            return (
                <div className="error_page">
                <p className="error_p1">Loading...</p>
                
            </div>
            )
    }

    function clickbutton(){
        if (!location.hash) { 

                location.hash = '#reload';
        
                location.href = location.href;
        
        }
    }

    return(
            <div className="myPage_Page">
                {/*개인 정보*/}
                <p className="personal_data_title">내 경매</p>
                <div className="personal_data_div">
                        <p>이름 : {userdata.name}</p>
                        <p>이메일 : {userdata.email}</p>
                </div>
                <Link to="/MyPage"><div className="MyAuction_button"><p>내 정보</p></div></Link>
                {/*보유 중인  작품 목록*/}
                <p className="name">입찰 중</p>

                <div onClick={clickbutton} className="reload_button"><p>경매확인</p></div>

                <div className="collection">
                        <div className="collection_header_flex">
                                <div><p className="collect_num">번호</p></div>
                                <div><p className="collect_art">작품명</p></div>
                                <div><p className="collect_artist">작가명</p></div>
                                <div><p className="collect_day">경매 페이지</p></div>
                        </div>
                        {/*이 데이터의 반복 */}
                        
                      
                        {ongoing.map((data,index)=>{
                               return( <div key={index} className="collection_data_flex">
                                        <div><p className="data_num">{index+1}</p></div>
                                        <div><p className="data_picture1">{data.artname}</p></div>
                                        <div><p className="data_artist1">{data.artist}</p></div>
                                        <div><a href={`/auctiondata?id=${data.artwork_id}`}><p>LINK</p></a></div>
                                 </div>)}
                         )}
                         


                        {/* 데이터 반복 끝. */}     
                </div>
                <p className="name">입찰 완료</p>
                <div className="like_art">
                <div className="collection_header_flex">
                                <div><p className="like_art_num">번호</p></div>
                                <div><p className="like_art_art">작품명</p></div>
                                <div><p className="like_art_artist">작가명</p></div>
                                <div><p>결제</p></div>
                                
                        </div>
                        {/*이 데이터의 반복 */}

                        {complete.map((data,index)=>
                                <div key={index} className="collection_data_flex">
                                        <div><p className="data_num">{index+1}</p></div>
                                        <div><p className="data_picture2">{data.artname}</p></div>
                                        <div><p className="data_artist2">{data.artist}</p></div>
                                        <div><a href={`/auctionpay?id=${data.artwork_id}`}><p>결제</p></a></div>
                                </div>
                        
                        )}

                      
                        {/* 데이터 반복 끝. */}   
                </div>


            </div>


    )

}
export default MyAuction;