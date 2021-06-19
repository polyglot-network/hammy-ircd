import { config } from "../config.js";
let NICK_C2S = ({socket, user, packet, network}) => {
    for (let uID in network.data.users){
        let u = network.data.users[uID];
        if (u.data.NICK == packet.data.parameters[0]){
            socket.sendPacketFromServer({command: "433", parameters:[`* ${packet.data.parameters[0]} :Nickname is already in use`]});
            return;
        }
    }
    if (user == undefined){
        socket.data.TEMPNICK = packet.data.parameters[0];
    } else {
        packet.data.source = user.data.NICK;
        network.broadcast(packet);
    }
}

export {NICK_C2S};