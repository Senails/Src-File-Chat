import apiadress from "./apiadress";
import axios from 'axios';

export default async function tochat({ roomid, name }) {
    let res = await axios.post(apiadress + '/rooms', {
        roomid,
        name
    })
}