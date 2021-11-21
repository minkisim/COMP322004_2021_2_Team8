/* eslint-disable */

import React, { Component, useState, useEffect } from 'react';
import ShowWindow6 from '../showWindow/ShowWindow6';
import './Home.css'
import {dev_ver} from '../../pages/global_const';
import  axios from 'axios';
import { Link } from 'react-router-dom'


function Home4( ){
    const [data, setdata] = useState(
        [
            {
                artist:'',
                artwork:'',
                imgUrl:'',
                moreUrl:'',
                id:''
            }
        ] 
    );
    useEffect(() => {
        
        axios.get(`http://${dev_ver}:4000/api/home4/data`).
        then((res)=>{
            console.log('받아온 것');
            console.log(res.data);
       // console.log(res.data)
            setdata(res.data);
            console.log('data');
            console.log(data);
        })
        .catch(()=>{
        alert('error');
        });

    },[])   
    
    return(
        <div className="new_artwork">
            <p>New artwork</p>
            <div className="new_artwork_box">
                <div className="new_first">
                    {data[0] != null && data[0].artist !='' ? <Link to={`/exhibition3/${data[0].id}`} ><ShowWindow6 data={data[0]} /></Link> : null}
                </div>
                <div className="new_second">
                    {data[1] ? <Link to={`/exhibition3/${data[1].id}`} ><ShowWindow6 data={data[1]} /></Link> : null}
                </div>
                <div className="new_third">
                    {data[2] ? <Link to={`/exhibition3/${data[2].id}`} ><ShowWindow6 data={data[2]} /></Link> : null}
                </div>    
            </div>
            
        </div>
    )
}
export default  Home4;