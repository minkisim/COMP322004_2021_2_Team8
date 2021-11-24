/* eslint-disable */
import React,{useState} from 'react';
import '../../App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'


function ShowWindow3(props){
    return(
        <div className="show_window3">
            <Zoomimage image={props.data.img} size='335'></Zoomimage>
        </div>
    )

}

export default ShowWindow3;