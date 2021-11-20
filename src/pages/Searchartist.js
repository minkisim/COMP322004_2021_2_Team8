import React, {useState,useEffect} from 'react'
import axios from 'axios'
import './search.css'
import AdminBar from './AdminBar'
import { dev_ver } from './global_const'

export default function SearchArtist(){
    
    const [CheckList, setCheckList] = useState([])
    const [CheckList2, setCheckList2] = useState([])
    const [IdList, setIdList] = useState([])


    const [input,setInput] = useState('')
    const [inputdata, setInputdata] = useState([])
    const [inputlength, setInputlength] =useState('')

    function findartist()
    {
        axios.post(`http://${dev_ver}:4000/api/searchArtist/search`,{input:input})
        .then((result) => {

            console.log(result.data)
            setInputdata(result.data);
            setInputlength(result.data.length)


           



        })
        .catch((err)=>{
            alert(err);
        })
    }



    const showall = () => {
        console.log( CheckList.includes('2') );
    }


    const onChangeAll = (e) => {
        // 체크할 시 CheckList에 id 값 전체 넣기, 체크 해제할 시 CheckList에 빈 배열 넣기

        let temp=[];
          for(let i=0;i<inputdata.length;i++)
          {
            temp.push(i.toString());
          }

          let temp2=[];
          for(let i=0;i<inputdata.length;i++)
          {
            temp2.push(inputdata[i].id);
          }

        setCheckList(e.target.checked ? temp : [])
        setCheckList2(e.target.checked ? temp2 : [])
    }



    const onChangeEach = (e,id) => {
        // 체크할 시 CheckList에 id값 넣기
        if (e.target.checked) {
            setCheckList([...CheckList, e.target.name]);
            setCheckList2([...CheckList2, id]);
        // 체크 해제할 시 CheckList에서 해당 id값이 `아닌` 값만 배열에 넣기
        } else {
            setCheckList(CheckList.filter((checkedId) => checkedId !== e.target.name));
            setCheckList2(CheckList2.filter((checkedId) => checkedId !== id));
        }
    }


    function Search_artist_list({data,id})
    {
        return(
            <div className="search_artist_list_contents">
                        <input onChange={(e) => onChangeEach(e,data.id)} checked={CheckList.includes(`${id}`) ? true:false} className="contents_check" type="checkbox" name={id} />
                        <p className="contents_name">{data.artist}</p>
                        <p className="contents_year">{data.life_term}</p>
            </div>
        )
    }

    function deleteArtist()
    {
        if(CheckList2.length<1)
        {
            alert("삭제할 작품을 선택하십시오")
            return false
        }
    
        axios.post(`http://${dev_ver}:4000/api/searchArtist/delete`,{
            checkBoxId: CheckList2,
    
        })
        .then((result)=>{
            if(result.data.success)
            {
                alert("삭제하였습니다.")
                document.location.href='/searchartist'
            }
           else{
            alert("해당 작가는 삭제할 수 없습니다.")
           }
            
            
        })
        .catch((err)=>{
            alert(err)
        })
    }

    function updateArtist()
    {
        if(CheckList2.length != 1)
      {
          alert('수정할 작품은 하나만 선택해주십시오')
          return false
      }
      //console.log(CheckList2[0])

      document.location.href=`/uploadartist?id=${CheckList2[0]}`
    }


    return(

        <div>
            <AdminBar></AdminBar>
            <div className="search_artist_page">
                <p className="search_artist_title" >작가 조회</p>
                <div className="search_artist_bar">
                    <input onChange={(e)=>{setInput(e.target.value)}} className="search_artist_input" type="text" maxLength="20" />
                    <img onClick={findartist} src="/img/search_btn.png" alt="검색" />
                </div>
                <div className="search_artist_list">
                    <div className="search_artist_list_header">
                        <input onChange={(e) => onChangeAll(e)} checked={CheckList.length === inputlength} className="header_check" type="checkbox" />
                        <p className="header_name">작가명</p>
                        <p className="header_year">작가생애</p>
                    </div>

                    {inputdata != '' && inputdata.map( (part,index) => <Search_artist_list data={part} id={index} />)}

                    <div className="search_artist_btn_flex">
                        <div onClick={updateArtist}className="search_artist_btn"><p>수정</p></div>
                        <div onClick={deleteArtist}className="search_artist_btn"><p>삭제</p></div>
                    </div>
                </div>
            </div>
        </div>
    )





}