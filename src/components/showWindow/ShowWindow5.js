import react from 'react';
import '../../App.css';
import Zoomimage from './Zoomimage';


function ShowWindow5(props){
    return(
        <div className="show_window_5">
            <Zoomimage image={props.data.img} size='450'></Zoomimage>
            <p>{props.data.text}</p>
        </div>
    )
}


export default ShowWindow5;