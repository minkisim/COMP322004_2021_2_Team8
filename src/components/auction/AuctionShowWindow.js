import axios from 'axios';
import react from 'react';
import {BrowserRouter, Router, Switch, Route, Link} from 'react-router-dom'
import './auction.css';
import { dev_ver } from '../../pages/global_const';

export default function AuctionShowWindow(props){
    //console.log(props.data.KRWpriceEnd.toLocaleString(undefined, {maximumFractionDigits:2}));

    function isStarted()
    {
        
        axios.post(`http://${dev_ver}:4000/api/AuctionMain/isStarted`,{
            art_id:props.data.id//art_id
        })
        .then((result)=>{
            console.log(result.data)

            var begindate = result.data.begin_point.split('-')
            var enddate = result.data.end_point.split('-')
            var diffDate1 = new Date(begindate[0],begindate[1]-1,begindate[2],0,0,0)
            var diffDate2 = new Date(enddate[0],enddate[1]-1,enddate[2],0,0,0)

            
            var currentDate = new Date()
            //alert(result.data.begin_point)
            //alert(result.data.end_point)
            var diff1 =(currentDate.getTime() - diffDate1.getTime() )>=0
            var diff2 =(diffDate2.getTime() - currentDate.getTime())>=0

           

            if(diff1 && diff2)
            {
                
               document.location.href=`/auctiondata?id=${props.data.id}`
            }
            else if(!diff1)
            {
                alert('해당 작품은 아직 경매가 시작되지 않았습니다.')
                return false
            }
            else if(!diff2)
            {
                document.location.href=`/auctionpay?id=${props.data.id}`
            }
            
          
        })
        .catch((err)=>{
            alert(err)
        })
    }

    return(
        
                <div className="auction_ShowWindow">
                    <div><img className="auction_ShowWindow_img" src={`/img/${props.data.img}`}  onError={(e)=>{ e.target.onerror = null; e.target.src = '/img/notfound.png'}} width={props.size} alt="그림" /></div>
                    <div className="auction_ShowWindow_artist"> 
                        <p>{props.data.artwork}</p>
                        <p>{props.index+1}</p>
                    </div>
                    <div className="auction_ShowWindow_artwork"><p>{props.data.artist}</p></div>
                    <div><hr className="auction_line1"/></div>
                    <div className="auction_type"><p>{props.data.type}</p></div>
                    <div className="auction_size">
                        <p>{props.data.size}</p>
                    </div>
                    <div><hr className="auction_line2"/></div>
                    <div className="auction_ShowWindow_price">
                        <p>추정가</p>
                        <div className="auction_ShowWindow_KRW">
                            <p>KRW {props.data.KRWpriceStart.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                            <p>~ {props.data.KRWpriceEnd.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                        </div>
                    </div>
                    <div className="auction_ShowWindow_USD">
                            <p>USD  {props.data.USDpriceStart.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                            <p>~  {props.data.USDpriceEnd.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                    </div>
                    <div><hr className="auction_line1"/></div>
                    <div className="auction_btn_div" >
                    <div className="auction_ShowWindow_btn" onClick={isStarted}><p>작품응찰신청</p></div>
                        { //props.data.expired==null ? <Link to={`/auctiondata?id=${props.data.id}`} ><div className="auction_ShowWindow_btn"><p>작품응찰신청</p></div></Link> : 
                        //<Link to={`/auctionpay?id=${props.data.id}`}><div className="auction_ShowWindow_btn"><p>작품응찰신청</p></div></Link>
                    }
                    </div>
                </div>
            
    )
}