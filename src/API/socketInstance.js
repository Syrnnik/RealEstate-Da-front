import {io} from 'socket.io-client';

export let socketInstance

export const setSocketConnection = (userId) => {
    socketInstance = io(`${process.env.REACT_APP_BASE_URL}`, {query: {userId}})
}


