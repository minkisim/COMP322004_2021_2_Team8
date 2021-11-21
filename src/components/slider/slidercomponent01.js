import React from "react";
import './slider.css'
import Zoomimage from "../showWindow/Zoomimage";
import {Link} from 'react-router-dom'
function Slidercomponent01(props){
    
    return(
        <div className="slider_component1">
            <Link to={`/exhibition3/${props.data.art_id}`}><p className="component1_artist">{props.data.artname}</p></Link>
            <p className="component1_type">{props.data.type}</p>
            <p className="component1_size">{props.data.size}</p>
            <p className="component1_musium">{props.data.musium}</p>
            <div className="component1_img"><Zoomimage image={props.data.imgUrl} size='360'></Zoomimage></div>
            
 
        </div>    
    )
}
export default Slidercomponent01;