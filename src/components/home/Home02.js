/* eslint-disable */
import React, { Component ,useEffect, useState} from 'react';
import './Home.css'
import Zoomimage from '../showWindow/Zoomimage';
import { Link } from 'react-router-dom';
import {dev_ver} from '../../pages/global_const';
import axios from 'axios';

function Home2() {
    const [artData, setArtData] = useState([{
        imageurl : '',
        artname : '',
        displaydate:'',
        artist:'',
        arttext:'',
        id:''
        
    }
    ]);

    useEffect(() => {
        axios.get(`http://${dev_ver}:4000/api/home2`)
        .then((res) => {
          
            setArtData(res.data)
            console.log(res.data)
        })
        .catch(()=>{
            console.log('error')
        })
    }, [])

    return(
        <div className="home_2_div">
            <div className="home_2_div_img">{artData != null && <Zoomimage image={artData.imageurl} size='548'></Zoomimage>}</div>
            <div className="home_2_text">
                  {artData ? <p className="home_2_text_1">{artData.artist}</p> : null}
                {artData ? <p className="home_2_text_1">{artData.artname}</p> : null}
                {artData ? <p className="home_2_text_2">{artData.displaydate}</p> : null}
                {artData ? <p className="home_2_text_2">{artData.artist}</p> : null}
            </div>
            <div className="home_2_textArea">
            {artData ? artData.arttext : null}
           
            </div>
            <div className="home_2_btn">
                {artData != null && <Link to={`/exhibition3/${artData.id}`}><p>View more</p></Link>}
            </div>    
        </div>
    )
}
export default Home2;