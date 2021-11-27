/* eslint-disable */

import React, { Component, useState ,useEffect} from 'react';
import ShowWindow2 from '../showWindow/ShowWindow2';
import Chart01 from '../chartcomponent/chart01';
import  './Home.css';
import { Link } from 'react-router-dom';

import {dev_ver} from '../../pages/global_const';
import  axios from 'axios';


export default function Home( ){
    
    
    
    const [inputData,setInputData] = useState([{
        artist: '',
        artname: '',
        exhibition: '',
        imageurl:''
    }]);

    const [graph,setgraph] = useState([
        {
            name : ``,
            '전시 관람 체류 시간' : 0,
            '전시 관람객': 0
        }
    ]);
   

    //[]는 empty dependency
    useEffect(()=>{
      
        axios.get(`http://${dev_ver}:4000/api/home1/about`).
        then((res)=>{
       // console.log(res.data)
         setInputData(res.data)

         
            axios.get(`http://${dev_ver}:4000/api/home1/about2`).
            then((result)=>{
             //console.log(result.data)
             setgraph(result.data)
            })
            .catch(()=>{
            alert('error');
            });


        })
        .catch(()=>{
        alert('error');
        });



        

        
    },[])

    return(
       
        <div>
           
            <div className="Weekly">Weekly exhibition</div>
            <div className="show_window_flexbox2">
                          
            {inputData[0] ? <Link to={`/exhibition3/${inputData[0].art_id}`}><ShowWindow2 artdata={inputData[0]}  /></Link>   :null}
            {inputData[1] ? <Link to={`/exhibition3/${inputData[1].art_id}`}><ShowWindow2 artdata={inputData[1]}  /></Link>   :null}
            {inputData[2] ? <Link to={`/exhibition3/${inputData[2].art_id}`}><ShowWindow2 artdata={inputData[2]}  /></Link>   :null}
           
           
            </div>   
           
            {graph[0] ? <Chart01 data={graph}/>:null}

            
        </div>
        
    )
}