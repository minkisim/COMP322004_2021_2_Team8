import './exhibition.css'
import react, {useState, useEffect} from 'react';
import Chart03 from '../chartcomponent/chart03';
import Chart02 from '../chartcomponent/chart02';
import Chart04 from '../chartcomponent/chart04';
import axios from 'axios';
import Zoomimage from '../showWindow/Zoomimage';
import {Link} from 'react-router-dom'
import {dev_ver} from '../../pages/global_const';

function Exhibition2({match}){

 


    const [exhibition, setexhibition] = useState(
        [
            {
                artist:'',
                day:'',
                musium:'',
                img:'',
                artworkUrl:'',
                textTitle:'',
                textArea:'',
                datenumber:0,
                totalnumber:'',
                time:''
            }
        ]
    )

    const [rankdata,setrankdata] = useState(
        [
            {
                rank: 0,
                art: '',
                looktime:''
            }
        ]
    )

    const [chart03data,setchart03data] = useState(
        [
            {
                name: '',
                 '관람객': 0
            }
        ]
    )

    const [chart04data,setchart04data] = useState(
        [
            {
                name: '',
                value: 0 
            }
        ]
    )

    useEffect(() => {
        let jsondata = {}
        if(match.params.exhibition != null && match.params.exhibition != undefined && match.params.exhibition.length>=1)
        {
            jsondata.exhibition = match.params.exhibition
            
        }
        
        axios.post(`http://${dev_ver}:4000/api/exhibition2/exhibition`,jsondata).then((res)=>{
          
            // console.log(res.data)
            setexhibition(res.data);
            
        })
        .catch(()=>{
        alert('error');
        });

        
        axios.post(`http://${dev_ver}:4000/api/exhibition2/rank`,jsondata).
        then((res)=>{
            
       // console.log(res.data)
            setrankdata(res.data);
           
        })
        .catch(()=>{
        alert('error');
        });

        axios.get(`http://${dev_ver}:4000/api/exhibition2/chart03/day`).
        then((res)=>{
            
       // console.log(res.data)
            setchart03data(res.data);
           
        })
        .catch(()=>{
        alert('error');
        });
        
        axios.get(`http://${dev_ver}:4000/api/exhibition2/chart04`).
        then((res)=>{
            
       // console.log(res.data)
            setchart04data(res.data);
            
        })
        .catch(()=>{
        alert('error');
        });

    },[match.params.exhibition])   
    
    return(
        <div className='exhibition_page'>
            <div className='exhibition2'>
                <p className='exhibition2_title'>Exhibition</p>
                {exhibition[0]!=null && exhibition[0].artist != '' ? <div className='exhibition2_box'>
                    <div className="exhibition2_img"> <Zoomimage image={exhibition[0].img} size='250'></Zoomimage></div>
                    <p className="exhibition2_artist">{`${exhibition[0].artist} :`}</p>
                    <p className="exhibition2_day">{exhibition[0].day}</p>
                    <p className="exhibition2_musium">{exhibition[0].musium}</p>
                    <Link to={exhibition[0].artworkUrl}><div className="exhibition2_btn1"><p>Art Work</p></div></Link>
                    <p className="exhibition2_textTitle">{exhibition[0].textTitle}</p>
                    <div className="exhibition2_textArea">
                        {exhibition[0].textArea}
                    </div>
                    <div className="exhibition2_data_box1">
                        <div>
                            <p className="data_box_name">금일 전시 관람객</p>
                        </div>
                        <div>
                            <p className="data_box_number">{exhibition[0].datenumber}</p>
                        </div>
                    </div>
                    <div className="exhibition2_data_box2">
                        <div>
                            <p className="data_box_name">금일 전시 관람 체류 시간</p>
                        </div>
                        <div>
                            <p className="data_box_number">{exhibition[0].totalnumber}</p>
                        </div>
                    </div>
                    <div className="data_date"><p>{exhibition[0].time}</p></div>
                </div> : null
            }
            </div>
            <p className="rank_title">주요 전시 작품</p>
            <div className="rank_table">
                <div className="table_header">
                    <div className="table_rank"><p className="table_font">순위</p></div>
                    <div className="table_art"><p className="table_font">작품</p></div>
                    <div className="table_time"><p className="table_font">관람 누적 체류 시간</p></div>
                </div>
                { rankdata[0]!=null &&  rankdata[0].art != '' && rankdata.map( part => 
                    <div className="table_body">
                        <div className="body_rank"><p className="body_font">{part.rank}</p></div>
                        <Link to={`/exhibition3/${part.id}`}><div className="body_art"><p className="body_font">{part.art}</p></div></Link>
                        <div className="body_time"><p className="body_font">{part.looktime}</p></div>
                    </div>
               )}
            </div>
            <p className="customer_title">시간대 별 관람객 수</p>
            <div className="customer_graph">
                <Chart03 data={chart03data}></Chart03>
            </div>
            <p className="old_title">전시 연령별 선호도</p>
            <div className="old_graph">
                <Chart04 data={chart04data}></Chart04>
            </div>

        </div>
    )
}

export default Exhibition2;
