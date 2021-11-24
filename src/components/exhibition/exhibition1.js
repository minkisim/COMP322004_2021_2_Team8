import './exhibition.css'
import react , {useState, useEffect} from 'react';
import ShowWindow1 from '../showWindow/ShowWindow1';
import {dev_ver} from '../../pages/global_const';
import axios from 'axios';

function Exhibition(){
    const [data, setdata] = useState([
        {
            artist:'',
            artname:'',
            musium:'',
            imgUrl:''
        }
    ]
    )

    useEffect(() => {
        
        axios.get(`http://${dev_ver}:4000/api/exhibition1/data`).
        then((res)=>{
            
            setdata(res.data);
            console.log(res.data)
        })
        .catch(()=>{
        alert('error');
        });

    },[])   
    
    return(
        <div class="show_window_flexbox2">
            { data[0] != null && data[0].artist != '' && data.map( part => <div><ShowWindow1 data={part}/></div>)}
        </div>//data[0] != null추가
    )
}

export default Exhibition;