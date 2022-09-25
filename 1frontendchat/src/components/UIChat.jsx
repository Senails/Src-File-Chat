import { useRef } from 'react';
import { useState, useEffect } from 'react';
import socket from '../api/socket';
import './stylechat.scss';

export default function UIChat({state , dispatch}){
    let {users , name , messages , roomid }=state;
    let [show,setshow]=useState(false);
    let [mes,setmes]=useState('');
    let textarea = useRef(null);

    function pushmessage(){
        if (mes!==''){
        socket.emit('ROOM_PUSH_MESSAGE',{
            name,
            roomid,
            text:mes
        })
        setmes('');
    }
    }
    function pushenter(e){
        if (!e.shiftKey && e.code==='Enter'){
        e.preventDefault();
        pushmessage()
        textarea.current.blur();
        }
    }

    useEffect(() => {
        socket.on('ROOM_GET_MESSAGE',setmessages);
        socket.on('spam',spam);

        function setmessages(messages){
            dispatch({
                type:'SET_MESSAGES',
                payload: messages
            })
        }

        function spam(spam){
            console.log(spam)
        }



        return () => {
            socket.off('ROOM_GET_MESSAGE',setmessages);
            socket.off('spam',spam)
        };
    }, []);


    function onChange(e){
        if (e.target.value.length<500){
        setmes(e.target.value)
        }
      }


    return <div className='chat'>
        <div className={'room '+(show && 'show')}>
            <div className='Roomid'>
                <span>Online: {users.length}</span>
                <div onClick={()=>setshow(false)}  className='showhide'>{"<-"}</div>
            </div>
            <div className='users'>
                {users.map((elem,index)=>{
                    return <span className={'user '+(elem===name?'amI':'')} key={index}>
                        {elem}
                    </span>
                })}
                <div className="space"></div>
            </div>
        </div>
        <div className='messages'>
            <div className='messes'>
                {messages.map((elem,i)=>{
                    return <span key={i} className={`mesblock ${name===elem.authtor? 'right' : ''}`}>
                        {elem.text.toString()}
                        <span className='authtor'>{elem.authtor}</span>
                    </span>
                })
                }
            </div>
            <div className='addmess'>
                <div className='line'></div>
                <textarea ref={textarea} onKeyDown={pushenter} value={mes} onChange={onChange}/>
                <button onClick={pushmessage}>{"->"}</button>
            </div>
        </div>
        <div onClick={()=>setshow(true)} className='showhide'>{"->"}</div>
    </div>
}