import { config } from "../config.js";
import { Channel } from "../channel.js";
let JOIN_C2S = ({socket, user, packet, network}) => {
    packet.data.source = user.getSource();
    let channel = packet.data.parameters[0]
    if (network.data.channels[channel] == undefined){
        network.data.channels[channel] = new Channel(channel)
    }
    let channelObj = network.data.channels[channel];
    channelObj.addUser(user);
    channelObj.broadcast(packet)
    for (let uID in channelObj.data.users){
        let u = channelObj.data.users[uID];
        socket.sendPacketFromServer({command: "353", parameters: [`${user.getSource()}`, "=", channel, u.data.NICK]})

    }
    socket.sendPacketFromServer({command: "366", parameters: [ channel, ":End of /NAMES list."]})
}

export {JOIN_C2S};