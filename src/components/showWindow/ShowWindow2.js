/* eslint-disable */
import React,{useState} from 'react';
import '../../App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Zoomimage from './Zoomimage';
function ShowWindow2(props){
    //console.log(props.artdata.artist)
    return(
    <div className="show_window2">
        <div className="show_window2_picture" ><Zoomimage image={props.artdata.imageurl} size='125'></Zoomimage></div>
        <div className="total_name2">
            <p className="name2">{props.artdata.artist}</p>
            <p className="name2">{props.artdata.artname}</p>
            <p className="musium_name2">{props.artdata.exhibition}</p>
        </div>
        <img className="plus_btn2" src="/img/plus_btn.png" alt="+" />
    </div> 
    )
}

export default ShowWindow2;