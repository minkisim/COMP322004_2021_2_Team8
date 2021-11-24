/* eslint-disable */
import React,{useState} from 'react';
import './ShowWindow.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import { Link } from 'react-router-dom';
import Zoomimage from './Zoomimage';
function ShowWindow1(props){
    return(
       <div className="show_window1">
         <div>
           <Zoomimage image={props.data.imgUrl} size='250'></Zoomimage>
          </div>
         <div>
           <Link to={`/artist01/${props.data.artist_id}`}><p className="artist_name1">{props.data.artist}</p></Link>
           <Link to={`/exhibition3/${props.data.art_id}`}><p className="day1">{props.data.artname}</p></Link>
           <Link to={`/exhibition2/${props.data.exhibition_id}`}><p className="musium_name1">{props.data.musium}</p></Link>
         </div>
       </div>
    )
}

export default ShowWindow1;