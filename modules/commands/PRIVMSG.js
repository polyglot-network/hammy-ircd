import { config } from "../config.js";
let PRIVMSG_C2S = ({socket, user, packet, network}) => {
    packet.data.source = user.getSource();
    let channel = packet.data.parameters[0] 
    network.echoChannel(channel, user, packet);
}

export {PRIVMSG_C2S};