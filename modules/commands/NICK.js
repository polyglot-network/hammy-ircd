import { config } from "../config.js";
let NICK_C2S = ({socket, user, packet, network}) => {
    console.log(network.data.users)
    for (let u of network.data.users){
        console.log(u.data)
        if (u.data.NICK == packet.data.parameters[0]){
            socket.sendPacketFromServer({command: "433", parameters:[`* ${packet.data.parameters[0]} :Nickname is already in use`]});
            return;
        }
    }
    if (user.data.USERNAME){
        packet.data.source = user.data.NICK;
        network.broadcast(packet);
    }
    user.data.NICK = packet.data.parameters[0];
}

export {NICK_C2S};