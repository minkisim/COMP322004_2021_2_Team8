/* global history */
/* global location */
/* global window */
/* eslint no-restricted-globals: ["off"] */
import react,{ useState,useEffect } from 'react';
import './box.css';
import Chart04 from '../chartcomponent/chart04';
import SimpleSlider2 from '../../pages/Slider';
import styled from 'styled-components';
import axios from 'axios';
import {dev_ver} from '../../pages/global_const';

function Artist01({match}){
    
    
    const [chart04data,setchart04data] = useState(
        [
            {
                name: '',
                value: 0 
            }
        ]
    )
    const [sliderdata,setsliderdata] = useState(
        [
            {
                    artist:'',
                    type:'',
                    size:'',
                    musium:'',
                    imgUrl : '',
                    id:'',
                    artname:''
            }
        ]
    )
    const [artistdata,setartistdata] = useState(
        [
            {
                name: '',
                btnUrl: '',
                textArea: '',
                people_num: '',
                totaltime: '',
                timeline:'',
                like: ''
            }
        ]
    )

    useEffect(() => {
        console.log(match.params.artist)
        let jsondata = {}
        if(match.params.artist!=null && match.params.artist != undefined && match.params.artist.length>=1)
         {
             jsondata.id=match.params.artist
         }

        axios.post(`http://${dev_ver}:4000/api/artist01/artist`,jsondata).
        then((res)=>{
       // console.log(res.data)
            setartistdata(res.data);

        })
        .catch(()=>{
        alert('error');
        });

        axios.post(`http://${dev_ver}:4000/api/artist01/slider`,jsondata).
        then((res)=>{
       // console.log(res.data)
            setsliderdata(res.data);   
            
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
    },[match.params.id])   

    const Black_div = styled.div`
    position: absolute;
    top:160px;
    left:25px;
    width: ${props => props.width}px;
    background-color: #181818;
    height:20px;
    border-radius: 15px 0px 0px 15px;
    `;
    

    return(
        <div className="artist01_Page">
            <div className="artist01_Artist_Info">
                <p className="artist01_Artist_title">Artist</p>       
                <div className="artist01_Artist_Info_div">
                    <p className="artist01_Artist_name">{artistdata[0].name}</p>
                    <p className="artist01_Artist_button">&gt;&gt; Artist’s website</p>
                    <div className="artist01_Artist_textarea">
                        {artistdata[0].textArea}
                    </div>
                    <div className="artist01_Artist_people">
                        <p class="artist01_Artist_people_name">누적 전시 관람객</p>
                        <p className="artist01_Artist_people_num">{artistdata[0].people_num}</p>
                    </div> 
                    <div className="artist01_Artist_time">
                        <p className="artist01_Artist_time_name">누적 전시 관람 체류 시간</p>
                        <p className="artist01_Artist_time_num">{artistdata[0].totaltime}</p>
                    </div>
                    <p className="artist01_time_line">{artistdata[0].timeline}</p>
                </div>
            </div>
            <div className="artist01_Artist_Fav_Art">
                <p className="artist01_Artist_Fav_title">작가 주요 작품</p>
                <div className="artist01_Artist_Fav_Art_div">
                    <div className="Fav_Art_slider">
                        {sliderdata != undefined && <SimpleSlider2 dataset={sliderdata}></SimpleSlider2>}
                    </div>
                </div>
            </div>
            <div className="artist01_Artist_Old">
                <p className="artist01_Artist_Old_title">작가 연령별 선호도</p>
                <div className="artist01_Artist_Old_graph_div">
                    <div className="artist01_Artist_Old_graph">
                        <Chart04 data={chart04data}></Chart04>
                    </div>
                </div>
            </div>
            <p className="artist01_Art_Like_title">작품 관객 반응</p>
            <div className="artist01_Art_Like">
                
                <div className="artist01_Art_Like_div">
                    <div className="artist01_Art_Like_graph">
                        <div className="Art_like_title">
                            <p>긍정</p>
                            <p>부정</p>
                        </div>
                        
                             <div>
                                <div className="Art_like_num"> 
                                    <p>{artistdata[0].like}</p>
                                    <p>{100-artistdata[0].like}</p>
                                </div> 
                                <div className="bar_state"></div>
                                <Black_div width={350*artistdata[0].like/100}></Black_div>
                            </div>
                        
                    </div>
                </div>
            </div>
        </div>

    )

}

export default Artist01;
