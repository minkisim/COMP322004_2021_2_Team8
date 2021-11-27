import React, {useState,useEffect} from 'react'
import axios from 'axios'
import './auction.css'
import SearchSlider from './SearchSlider'
import AuctionShowWindow from './AuctionShowWindow'

import {dev_ver} from '../../pages/global_const';
export default function AuctionMain(){

    const [artname,setArtname] = useState('')
    const [artist,setArtist] = useState('')
    const [value,setValue] = useState([0,100000])
    const [num,setNum] = useState('')

    const [picturedata, setpicturedata] = useState(
        [
            {
                artist:'',
                artwork:'',
                size:'',
                year:"",
                type:'',
                KRWpriceStart:'',
                KRWpriceEnd:'',
                USDpriceStart:'',
                USDpriceEnd:'',
                id:'',
                isauctioned:''
            }
        ]
    ) 

    
    useEffect( () => {axios.get(`http://${dev_ver}:4000/api/AuctionMain/picturedata`)
    .then((res) => {
            setpicturedata(res.data);
            //console.log(picturedata)
        })
    .catch( (err)=>{
        alert(err);
        });
    },[]);


    function submit()
    {
        console.log(num)

        let jsondata = {}
        let splitvalue = []
        if(artist!=null)
        {
            jsondata.artist = artist
        }
        if(artname!=null)
        {
            jsondata.artname = artname
        }

        splitvalue = value.toString().split(',')
        console.log("검사 범위 : "+splitvalue[0]+"   "+splitvalue[1])
        jsondata.value = parseInt(splitvalue[0])
        jsondata.value2 = parseInt(splitvalue[1])
        
        if(num!=null)
        {
            jsondata.num = num
        }

        console.log("보낼 artist정보 : "+jsondata.artist)

        axios.post(`http://${dev_ver}:4000/api/search_auction`,jsondata)
        .then((result)=>{
            setpicturedata(result.data);
        })
        .catch((err) =>{
            alert(err)
        })
    }

    const getValue = (newValue) => {
        setValue(newValue);
    }

    function reset()
    {
        axios.get(`http://${dev_ver}:4000/api/AuctionMain/picturedata`)
        .then((res) => {
                setpicturedata(res.data);
                //console.log(picturedata)
            })
        .catch( (err)=>{
            alert(err);
            });
    }

    return(
        <div className="auction_Main_Page">
            <div className="auction_search_bar">
                <div className="search_bar_artwork">
                    <p>작품명</p>
                    <div className="search_input1"><input onChange={(e)=>{setArtname(e.target.value)}}  type="text" maxLength='20'  placeholder="작품명" /></div> 
                </div>
                <div className="search_artist">
                    <p>작가명</p>
                    <div className="search_input2"><input onChange={(e)=>{setArtist(e.target.value)}} type="text" maxLength='20'  placeholder="작가명" /></div>
                </div> 
                <div className="search_price">
                    <p>추정가</p>
                    <div className="price_btn"><SearchSlider getValue={getValue}></SearchSlider></div>
                </div>             
                <div className="search_num">
                    <p>작품번호</p>
                    <div className="num_input"><input onChange={(e)=>{setNum(e.target.value)}} type="text" maxLength='3' /></div>
                </div>
                <div className="search_btn" onClick={submit}><p>검색</p></div>
                <div className="reset_btn" onClick={reset}><p>검색 초기화</p></div>

            </div>
            <div className="auction_list">
               {picturedata.map( (part, index) => <AuctionShowWindow index={index} data={part}/>)}
            </div>
            </div>
    )


}