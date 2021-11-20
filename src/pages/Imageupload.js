import react,{useState} from "react";
import axios from 'axios';

import {dev_ver} from './global_const';


function Imageupload()
{
    const [file, setFile] =useState('');
    const [artist, setArtist] = useState('');
    const [artname, setArtname] = useState('');
    const [exhibition, setExhibition] = useState('');
    const [arttext, setArttext] = useState('');
    const [remaintime, setRemaintime] = useState('');
    const [audiencenum, setAudiencenum] = useState('');

    function upload()
    {
        const formData = new FormData();
        formData.append('file',file)

        console.log(artist);
        console.log(artname);

        axios.post(`http://${dev_ver}:4000/api/fileupload`, formData,{headers:{"Content-Type":"multipart/form-data"}})
        .then((result) => {
            if(result.data.success)
            { 
                alert("파일업로드 성공")
                axios.post(`http://${dev_ver}:4000/api/imgupload`, {
                    artist: artist,
                    artname: artname,
                    arttext: arttext,
                    exhibition: exhibition,
                    remaintime: remaintime,
                    audiencenum: audiencenum,
                    imageurl: file.name,
                

                })
                .then((result) => {
                    if(result.data.success)
                        alert("DB업로드 성공")
                    else
                        alert('DB업로드 실패')
                })
                .catch((err) => {
                    alert("DB업로드 실패 \n"+err)
                })
            }
            else
                alert('파일업로드 실패')
        })
        .catch((err) => {
            alert("파일업로드 실패 \n"+err)
        })

        

        
    }

    return (
      <div>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <div>
            <input onChange={(e) => {setArtist(e.target.value)}} placeholder="아티스트 번호" />
          </div>
          <div>
            <input onChange={(e)=>{setArtname(e.target.value)}} placeholder="작품명" />
          </div>
          <div>
            <input onChange={(e)=>{setExhibition(e.target.value)}} placeholder="전시관 번호" />
          </div>
          <div>
            <input onChange={(e)=>{setArttext(e.target.value)}} placeholder="작품 설명" />
          </div>
          <div>
            <input onChange={(e)=>{setRemaintime(e.target.value)}} placeholder="전시 관람 체류시간" />
          </div>
          <div>
            <input onChange={(e)=>{setAudiencenum(e.target.value)}} placeholder="전시관람객"  />
          </div>
          <div>
             <input onChange={(e) => {setFile(e.target.files[0])}} type="file" />
          </div>


          <button onClick={upload}>작품 업로드</button>
      </div>  
    );
}

export default Imageupload