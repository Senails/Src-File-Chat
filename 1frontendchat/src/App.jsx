import './style.scss';
import Openblock from './components/Openblock';
import reducer from './reducers/reduser';
import socket from './api/socket';
import { useReducer , useEffect} from 'react';
import UIChat from './components/UIChat';
import axios from 'axios';
import apiadress from './api/apiadress';

import AboutMe from './components/AboutMe';





function App() {
  let [state,dispatch] = useReducer(reducer,{
    isAuth:false,
    roomid:null,
    name:null,
    users:[],
    messages:[],
    roomid:'1'
  })

  useEffect(() => {
    socket.on('ROOM_SET_USERS',serusers);
    function serusers(users){
      console.log(users)

      dispatch({
        type:'SET_USERS',
        payload: users,
    })
    }

    return ()=>{
      socket.off('ROOM_SET_USERS',serusers);
    }
  }, []);

  async function onLodin(obj){
    dispatch({
      type: "IS_AUTH",
      payload: obj
    });
    socket.emit('ROOM_AUTH',obj)

    let {data} = await axios.get(apiadress+`/rooms/${obj.roomid}`);

    dispatch({
        type: 'SET_USERS',
        payload: data.users
    });
    dispatch({
      type: 'SET_MESSAGES',
      payload: data.messages
  });
  }

  return (
    <div className="wrapper">
      {!state.isAuth?
      <Openblock lodin={onLodin}/>:
      <UIChat state={state} dispatch={dispatch}/>
      }
      <AboutMe/>
    </div>
  );
}

export default App;






//