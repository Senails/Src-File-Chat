import express from "express";
import __dirname from "./__dirname.js";
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/build/'));
const server = http.Server(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});


const rooms = new Map();

let num = 0;




app.get('/rooms/:id', (req, res) => {
    const roomid = req.params.id;

    let obj = rooms.get(roomid) ? {
        users: [...rooms.get(roomid).get('users').values()],
        messages: [...rooms.get(roomid).get('messages')]
    } : { users: [], messages: [] }
    res.json(obj);
})

app.get('*', () => {
    res.sendFile(__dirname + '/build/page.html');
})

app.post('/rooms', (req, res) => {
    let { roomid, name } = req.body;

    if (!rooms.has(roomid)) {
        rooms.set(roomid, new Map([
            ['users', new Map()],
            ['messages', []]
        ]))
    }
    res.send();
})

io.on('connection', (socket) => {
    socket.on('ROOM_AUTH', async({ roomid, name }) => {
        socket.join(roomid);
        rooms.get(roomid).get('users').set(socket.id, name);

        let users = [...rooms.get(roomid).get('users').values()];
        socket.to(roomid).emit("ROOM_SET_USERS", users);
    })

    socket.on('ROOM_PUSH_MESSAGE', async({ roomid, name, text }) => {
        let messages = [{ authtor: name, text: text }, ...rooms.get(roomid).get('messages')].slice(0, 300);
        rooms.get(roomid).set('messages', messages);


        socket.to(roomid).emit("ROOM_GET_MESSAGE", messages);
        socket.emit("ROOM_GET_MESSAGE", messages);
    })

    socket.on('disconnect', () => {
        rooms.forEach((room, roomid) => {
            if (room.get('users').delete(socket.id)) {
                let users = [...rooms.get(roomid).get('users').values()];
                socket.to(roomid).emit("ROOM_SET_USERS", users);
            }
        })
    })
})







const port = process.env.PORT || 8080
server.listen(port, (err) => {
    if (err) { console.log('Error'); return }
    console.log('Server started');
})

//