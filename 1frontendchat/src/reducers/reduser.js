export default function reducer(state, action) {
    switch (action.type) {
        case 'IS_AUTH':
            return {
                ...state,
                isAuth: true,
                name: action.payload.name,
                roomid: action.payload.roomid,
            };
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload
            };
        case 'SET_MESSAGES':
            return {
                ...state,
                messages: action.payload
            };
        default:
            return state;
    }

}