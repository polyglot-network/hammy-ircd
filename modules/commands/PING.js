import { config } from "../config.js";
let PING_C2S = ({socket, user, packet, network}) => {
    socket.sendPacketFromServer({command: "PONG", parameters:[user.data.USERNAME].concat(packet.data.parameters)});
}

export {PING_C2S};