import react from 'react';
import './ShowWindow.css';
import Zoomimage from './Zoomimage';
function ShowWindow6(props){
   
    return(
        <div className="new_art">
            <Zoomimage image={props.data.imgUrl} size='287'></Zoomimage>
            <p>{`${props.data.artist} :`}</p>
            <p>{props.data.artwork}</p>
            <div className="new_art_btn">
                <a href={props.data.moreUrl}><p>View more</p></a>
            </div>
        </div>          
    )



}

export default ShowWindow6;