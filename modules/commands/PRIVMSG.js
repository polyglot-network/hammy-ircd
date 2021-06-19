import { config } from "../config.js";
let PRIVMSG_C2S = ({socket, user, packet, network}) => {
    packet.data.source = user.getSource();
    let channel = packet.data.parameters[0] 
    if (channel.startsWith("#")){
        network.echoChannel(channel, user, packet);
    } else {
        for (let uID in network.data.users){
            let u = network.data.users[uID];
            if (u.data.NICK == channel){
                u.socket.sendPacket(packet);
            }
        }
    }
}

export {PRIVMSG_C2S};