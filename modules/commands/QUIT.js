import { config } from "../config.js";
let QUIT_C2S = ({socket, user, packet, network}) => {
    packet.data.source = user.getSource();
    network.broadcast(packet);
    if (socket != undefined){
        socket.destroy();
    }
    network.cullUser(user);
}

export {QUIT_C2S};