import React from 'react';
import '../../App.css';
import Zoomimage from './Zoomimage';

function ShowWindow4(props){
   //console.log(props.data);
    return(
       <div className="show_window4">
         <div className="show_window4_img"><Zoomimage image={props.data.imgUrl} size='90'></Zoomimage></div>
         <div className="show_window4_text">
           <p className="artist_name4">{props.data.artist}</p>
           <p className="art_name4">{props.data.artwork}</p>
           <p className="musium_name4">{props.data.musium}</p>
         </div>
         <img className="plus_btn4" src={`/img/plus_btn.png`} alt="그림" />
       </div>
    )
}

export default ShowWindow4;