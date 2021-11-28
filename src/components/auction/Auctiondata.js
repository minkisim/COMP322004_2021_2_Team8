import React, {useState,useLayoutEffect,useRef} from 'react'
import axios from 'axios'
import './auction.css'
import './Auctioncheck.css'
import { dev_ver } from '../../pages/global_const'
import queryString from 'query-string'
import Auctiontimer from './Auctiontimer'

export default function Auctiondata({location, match}){
    const [clickbtn1,setclickbtn1] = useState(false);
    const [clickbtn2,setclickbtn2] = useState(false);
    const [clickcheck,setclickcheck] = useState(false);
    const [data,setdata] = useState(
        {
            artist:'',
            artistyear:'',
            artwork:'',
            size:'',
            year:"",
            type:'',
            KRWpriceStart:'',
            KRWpriceEnd:'',
            nowprice:'',
            enddate:'',
            artworkInfo:'',
            artistInfo:"",
            artistyearInfo:''
        }
    );
    const [bidsearch, setBidsearch] = useState('')
    const [currentprice, setCurrentprice] = useState('0')
    const [userdata, setUserdata] = useState({
        username:'',
        name:'',
        email:''
        })

    const [timeout, setTimeout] = useState(false);
    const gettime = () => {
        setTimeout(true)
    }
    
    const currentbid = useRef(null)

    const [tminus,setTminus] = useState()
    const [enddate, setEnddate] = useState()
    const [enddate2, setEnddate2] = useState()

    const [artistdata,setArtistdata] = useState()
    const [auctionUnit,setAuctionUnit] = useState('1')


    useLayoutEffect(()=> {
        axios.get(`http://${dev_ver}:4000/api/checkAdmin`)      
                        .then((result) => {
                                if(result.data.success==false)
                                {
                                        alert('로그인이 필요합니다')

                                        
                                        window.location.replace("/")
                                }

                                else{
                                        setUserdata(result.data)
                                }
                        })
                        .catch((err)=>{
                                alert(err)
                        })


        const query = queryString.parse(location.search)

        console.log(query.id)

        axios.post(`http://${dev_ver}:4000/api/auctiondata`,{
            id:query.id
        })
        .then((result2)=>{
            if(result2.data==null)
            {
                alert('접근할 수 없는 작품입니다.')
                document.location.replace('/')
            }

            setdata(result2.data)
            //console.log("결과 : "+result2.data.artname)



            axios.post(`http://${dev_ver}:4000/api/auctiondata/search`,{
                id:query.id,
                artname:result2.data.artname
            })
            .then((result)=>{
                //console.log(result.data)
                if(result.data.success)
                {
                    
                    setBidsearch(result.data.result)
                    if(result.data.result[0] != undefined )//&& result.data.result[0].userprice != undefined && result.data.result[0].userprice.length>=1)
                    {
                        setCurrentprice(result.data.result[0].userprice)
                    }
                }
            })
            .catch((err)=>{
                alert("search error:\n"+err)
            })

        //console.log("artname : "+result2.data.artname)


        axios.post(`http://${dev_ver}:4000/api/auctiondata/isStarted`,{
            artname: result2.data.art_id
        })
        .then((result)=>{
            //console.log("begin_point : "+result.data.begin_point)
            
            var begindate = result.data.begin_point.split('-')
            var enddate = result.data.end_point.split('-')
            var diffDate1 = new Date(begindate[0],begindate[1]-1,begindate[2],0,0,0)
            var diffDate2 = new Date(enddate[0],enddate[1]-1,enddate[2],0,0,0)
            //console.log("diff : "+diffDate2.getDay())

            var week=['일','월','화','수','목','금','토']

            setEnddate(enddate)
            setEnddate2(week[diffDate2.getDay()])
            setAuctionUnit(result.data.auction_unit)

            var currentDate = new Date()
            var seconds = (diffDate2.getTime() - currentDate.getTime())/1000
            /*var diff1 =(currentDate.getTime() - diffDate1.getTime() )>=0
           


           

            var day = parseInt((seconds/3600)/24)
            var hour = parseInt((seconds/3600)%24);
            var min = parseInt((seconds%3600)/60);
            var sec = parseInt(seconds%60);*/

            //console.log(day+" "+hour + " " + min + " " + sec)
            
            if(seconds<=0)
            {
                alert('이미 완료된 경매입니다.')
                document.location.replace('/')
            }
            setTminus(seconds)//(diffDate2.getTime() - currentDate.getTime())/1000)
        })
        .catch((err)=>{
            alert("date Error:\n"+err)
        })


        /*
        axios.post(`http://${dev_ver}:4000/api/auctiondata/artist`,{
            artist : result2.data.artist_id,
            artname: result2.data.artname
        })
        .then((result)=>{
            setArtistdata(result.data)
        })
        .catch((err)=>{
            alert(err)
        })
        */

        })
        .catch((err)=>{
            alert(err)
        })

       

    },[])
    

    function click_auction_btn1(){
        const query = queryString.parse(location.search)
        console.log(data)

        console.log('1번 클릭');
        console.log(clickbtn1);
        if(clickbtn1 == false){

            axios.post(`http://${dev_ver}:4000/api/auctiondata/search`,{
                id:query.id,
                artname:data.artname
            })
            .then((result)=>{
                if(result.data.success)
                {
                    setBidsearch(result.data.result)
                    if(result.data.result[0] != undefined)// && result.data.result[0].userprice !=undefined && result.data.result[0].userprice.length>=1)
                    {
                        setCurrentprice(result.data.result[0].userprice)
                    }
                }
            })
            .catch((err)=>{
                alert(err)
            })

            setclickbtn1(true);
        }
        else{
            setclickbtn1(false);
        }
    }


    function click_auction_btn2(){

        if(timeout==false)
        {
            console.log('2번 클릭');
            console.log(clickbtn2);
            if(clickbtn2 == false){
                setclickbtn2(true);
            }
            else{
                setclickbtn2(false);
            }
        }

        else{
            alert('기한이 만료된 경매입니다.')
        }

    }

    function click_check(){
        if(clickcheck){
            
            setclickcheck(false);
        }
        else{
            
            setclickcheck(true);
        }
    }


    function auct_sub()
    {
        let price = currentbid.current.value
        console.log(price)

        if(price==undefined || price.length<1 || price=='0')
        {
            alert('응찰할 금액을 입력하십시오')
            return false
        }

        console.log(currentprice)
        
        if(parseInt(price)<=parseInt(currentprice))
        {
            alert('현재 가격보다 높은 가격을 제시하여야 합니다.')
            return false
        }

        if(parseInt(price)<parseInt(data.KRW_lower))
        {
            alert('예상 최소가보다 낮은 값을 입력할 수 없습니다.')
            return false
        }

       
        const curr = new Date();
        const utc =  curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        const kr_curr =  new Date(utc + (KR_TIME_DIFF));
        
        const year = kr_curr.getFullYear()
        const monthdate =( kr_curr.getMonth()+1 )
        const month = (monthdate/10 < 1) ? '0'+monthdate : monthdate
        const day = kr_curr.getDate()/10 < 1 ? '0'+kr_curr.getDate() : kr_curr.getDate()
        const hour = kr_curr.getHours()/10 < 1 ? '0'+kr_curr.getHours() : kr_curr.getHours()
        const min = kr_curr.getMinutes()/10 < 1 ? '0'+kr_curr.getMinutes() : kr_curr.getMinutes()
        const sec = kr_curr.getSeconds()/10 < 1 ? '0'+kr_curr.getSeconds() : kr_curr.getSeconds()
         
        const kr_curr_string = year +"-"+ month + '-' + day// +' '+hour+':'+min+':'+sec
        
        axios.post(`http://${dev_ver}:4000/api/auctiondata/submit`,{
            username:userdata.username,
            userid:userdata.id,
            art_id:data.art_id,
            userprice:price,
            updateDate: kr_curr_string
        })
        .then((result)=>{
            if(result.data.success)
            {
                alert('입찰 완료. 입찰 작품을 확인해주세요.');
                window.location.replace("/Myauction");
            }
            else if(result.data.err)
            {
                alert('현재 다른 사람이 더 높은 가격을 제시하였습니다.')
                
            }
            else{
                alert('이전 제시한 가격보다 낮은 가격을 제시할 수 없습니다.')
            }
            
        })
        .catch((err)=>{
            alert(err)
        })

       
    }

   

    function AuctionBid(){
        return(
                <div className="Bid_back_div">
                    <div className="Bid_title">
                        <span>경매응찰하기</span>
                        <span> | </span>
                        <span>{data.artname}</span>
                        <img className="Bid_btn" onClick={click_auction_btn2} src="/img/X_btn.png" alt="X" />
                    </div>
                    <div className="Bid_price">
                        <div className="Bid_price_title">
                            <p className="p1">응찰 금액</p>
                            <p className="p2">KRW</p>
                        </div>

                        <input ref={currentbid}  type="number"  defaultValue={currentprice} step={auctionUnit} maxLength="9" placeholder="응찰 금액 입력"  />
                       


                        {clickcheck ? <div className="Bid_price_btn_on" onClick={auct_sub}><p>즉시 응찰</p></div>
                        :  <div className="Bid_price_btn_off"><p>즉시 응찰</p></div> }
                        <p className="warning_text">※ 응찰 참여 후 취소가 불가능합니다.</p>
                    </div>






                    
                    <div className="Bid_check"> 
                        <div className="Bid_check_flex"> 
                            <input type="checkbox" checked={clickcheck ? true:false} onChange={click_check}/>
                            <p>※ 아래의 내용과 약관을 확인했으며, 동의합니다.</p>
                        </div>
                        <div className="Bid_check_textArea">
                                <p>※ 응찰전 유의사항</p>
                                <p>&nbsp;- 낙찰시 낙찰금의 15%(부가세별도)의 구매수수료가 발생합니다.</p>
                                <p>&nbsp;- 응찰 및 낙찰시에는 취소가 불가능하오니 신중히 응찰하여 주십시요.</p>
                                <p>&nbsp;- 마감시간 30초전 응찰이 있을 경우 자동으로 30초의 경매시간이 연장됩니다.</p> 
                                <p>&nbsp;- 경매종료시간은 아트데이터 서버시간을 기준으로 진행되오니 유의해 주십시요.</p>
                        </div>
                        <div className="Bid_check_btn"><p>경매 약관 바로가기</p></div>
                    </div>
                  
                    <div className="Bid_now">
                        <div className="Bid_now_Unit">
                            <span>응찰단위 : </span>
                            <span>{auctionUnit && auctionUnit.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} KRW</span>
                        </div>
                        <div className="Bid_now_price">
                            <span className="span1">현재가 : </span>
                            <span className="span2">{currentprice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} KRW</span>
                        </div>   
                    </div>
                 
                </div>
        )
    }
    function Popup(){
        return(
            <div>
            <div className="Popup_gray_div"></div>
            <p className="Popup_title">응찰 현황 리스트</p>
            <img className="Popup_btn" onClick={click_auction_btn1} src="/img/X_btn.png" alt="X" />
            <div className="Popup_black_div"></div>
                <div className="popup_box">
                <div className="Popup_header">
                    <div className="Popup_header_no">
                            <p>No.</p>
                        </div>
                        <div className="Popup_header_ID">
                            <p>아이디</p>
                        </div>
                        <div className="Popup_header_price">
                            <p>응찰금액</p>
                        </div>
                        <div className="Popup_header_time">
                            <p>응찰일시</p>
                        </div>
                    </div>
                    
                    {bidsearch.length>=1 && bidsearch.map((data,index)=>
                        <div className="Popup_content">
                            <div className="Popup_content_no">
                                <p>{index+1}</p>
                            </div>
                            <div className="Popup_content_ID">
                                <p>{data.username}</p>
                            </div>
                            <div className="Popup_content_price">
                                <p>{data.userprice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                            </div>
                            <div className="Popup_content_time">
                                <p>{data.updateDate.split('.')[0].replace('T',' ')}</p>
                            </div>
                        </div>


                    ) }

                   
                    </div>
                </div>
                    
                
           
        )
    }

    

        return(
            <>
            {(tminus!='' && tminus!=undefined)&&
            <div className="Auctiondata_Page">
                
                <div className="picture">
                    <img className="Main_Image" src={`/img/${data.imageurl}`} alt="그림" />
                    <img className="Sub_Image1" src="/img/picture.png" alt="그림" />
                    <img className="Sub_Image2" src="/img/picture.png" alt="그림" />
                    <img className="Sub_Image3" src="/img/picture.png" alt="그림" />
                </div>
                <div className="Auction_Info">
                    <div className="Artwork_Artist">
                        <span className="Auction_Info_Artist">{data.artist}</span>
                        <span className="Auction_Info_Artwork">{data.artname}</span>
                    </div>
                    <div className="Auction_Info_artistyear"><p>{artistdata && artistdata.life_term}</p></div>
                    <div className="Auction_Info_subdata">
                        <p className="Auction_Info_size">{data.imagesize}cm</p>
                        <p className="Auction_Info_type">{data.imagetype} </p>
                        <p className="Auction_Info_year">{data.artrelease_date}</p>
                    </div>
                    <hr className="Auction_Info_hr1"/>
                    <div className="Auction_Info_enddate_flex">
                        <div className="Auction_Info_enddate">
                            <span className="enddate_title">마감&nbsp; </span>
                            <span className="enddate_content">{ enddate[1]}/{enddate[2]} ({enddate2}) 00:00 AM</span>
                        </div>
                        <div className="Auction_Info_countdown">
                            <span className="countdown_title">남은 시간&nbsp; </span>
                            <span className="countdown_content">{tminus != undefined && tminus!='' && (timeout==false ? <Auctiontimer tminus={parseInt(tminus)}  gettime={gettime} /> : "만료") }</span>
                        </div>
                    </div>
                    <hr className="Auction_Info_hr2"/>
                    <div className="Auction_Info_price">
                        <div className="Auction_Info_nowprice">
                            <span className="nowprice_title">현재가 &nbsp;&nbsp;</span>
                            <span className="nowprice_content">{currentprice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span>
                        </div>
                        <div className="Auction_Info_pricedata">
                            <span className="price_title">추정가 &nbsp; &nbsp;</span>
                           {data != undefined && data.KRW_lower != undefined && data.KRW_upper != undefined &&
                               <span className="price_content">{data.KRW_lower.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} ~ {data.KRW_upper.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span>}
                        </div>
                    </div>
                    <div className="Auction_Info_btn">
                        <div className="Auction_Info_nowbtn" onClick={click_auction_btn1}><p>응찰현황</p></div>
                        <div className="Auction_Info_submit" onClick={click_auction_btn2}><p>응찰하기</p></div>
                    </div>
                </div>
                <hr className="Auction_Info_hr3"/>
                <hr className="Auction_Info_hr4"/>
                <div className="artwork_Info">
                    <div className="artwork_Info_title"><p>작품설명</p></div>
                    <div className="artwork_Info_content">
                    
                    {data && data.arttext.split('\n').map( (line) => {
                        return ( <p>{line}</p>)
                    } )} 
                </div>
                </div>
                <div className="artist_Info">
                    <div className="artist_Info_title"><p>작가설명</p></div>
                    <div className="artist_Info_content">{data!=undefined && data.artist_info!=undefined && data.artist_info.split('\n').map( (line) => {
                        return ( <p>{line}</p>)
                    } )} </div>
                    <div className="artist_Info_yearInfo">{data!=undefined && data.artistyearInfo!=undefined && data.artistyearInfo.split('\n').map( (line) => {
                        return ( <p>{line}</p>)
                    } )} </div>
                </div>
                { clickbtn2 && !timeout && <AuctionBid></AuctionBid>}
                { clickbtn1 && <Popup></Popup>}
                
                
            </div>
            }
            </>
        )



}