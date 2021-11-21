import react, {useState,useEffect} from 'react';
import './box.css';
import ShowWindow5 from '../showWindow/ShowWindow5';
import {dev_ver} from '../../pages/global_const';
import axios from 'axios';
function Artwork(){
    const [data,setdata] = useState(
        [
            {
                img:'',
                text:''
            }
        ]
    )
    
    useEffect(() => {
        
        axios.get(`http://${dev_ver}:4000/api/artwork/data`).
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
        <div className="exhibition_4_flex">
           {data[0].img != '' && data.map( (part) => <ShowWindow5 data={part}/>)}
        </div>
    )
}
export default Artwork;

