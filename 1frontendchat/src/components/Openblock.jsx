import { useState } from "react"
import tochat from "../api/tochat"

export default function OpenBlock({lodin}){
    let [name,setname] = useState('');
    let [loading,setloading]= useState(false);

    function onentry(){
      if (name){
        const obj ={
          roomid: '1',
          name
        }

        setloading(true);
        tochat(obj).then(()=>{
          lodin(obj);
          setloading(false);
        })
      }else{
        alert('Данные некорректны')
      }
    }

    function onChange(e){
      if (e.target.value.length<10){
        setname(e.target.value)
      }
    }


    return <div className='open'>
      {!loading?<>
        <h1>My Chat</h1>
        <input type="text" placeholder='your name' value={name} onChange={onChange}/>
        <button onClick={()=>onentry()}>Войти</button>
      </>:
        <div className="load">Loading...</div>
      }
  </div>
}