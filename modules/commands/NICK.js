import { config } from "../config.js";
let NICK_C2S = ({socket, user, packet, network}) => {
    if (user.data.USERNAME){
        packet.data.source = user.data.NICK;
        network.broadcast(packet);
    }
    user.data.NICK = packet.data.parameters[0];
}

export {NICK_C2S};