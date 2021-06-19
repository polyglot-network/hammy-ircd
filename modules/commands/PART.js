import { config } from "../config.js";
let PART_C2S = ({socket, user, packet, network}) => {
    packet.data.source = user.getSource();
    let channel = packet.data.parameters[0]
    if (network.data.channels[channel] != undefined){
        network.broadcastChannel(channel, packet);
        network.data.channels[channel].cullUser(user);
    }
}

export {PART_C2S};