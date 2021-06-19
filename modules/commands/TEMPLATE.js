import { config } from "../config.js";
let TEMPLATE_C2S = ({socket, user, packet, network}) => {
    socket.sendPacketFromServer({command: "PONG", parameters:[user.data.USERNAME].concat(packet.data.parameters)});
}

export {TEMPLATE_C2S};