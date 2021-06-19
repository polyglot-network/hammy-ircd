import { config } from "../config.js";
let LUSERS_C2S = ({socket, user, packet, network}) => {
    socket.sendPacketFromServer({command: "251", parameters:[`There are ${Object.keys(network.data.connections).length} users and 0 invisible on 1 servers`]});
}

export {LUSERS_C2S};