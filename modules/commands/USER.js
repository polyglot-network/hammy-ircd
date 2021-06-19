import { config } from "../config.js";
import { MOTD_C2S } from "./MOTD.js";
import { User } from "../user.js";
let USER_C2S = ({socket, packet, network}) => {
    let user = new User();
    socket.user = user;
    user.socket = socket;
    user.data.UUID = socket.data.UUID;
    user.data.CONNECTEDSERVER = config.hostname;
    user.data.HOSTNAME = `${user.data.UUID}.hammy.network`;
    user.data.NICK = socket.data.TEMPNICK;
    network.data.users[user.data.UUID] = user;

    user.data.USERNAME = packet.data.parameters[0];
    socket.sendPacketFromServer({
        command: "001", 
        parameters:[user.data.NICK, `Welcome to irc.hammy.network ${packet.data.NICK}. We hope you enjoy your stay`]
    });
    socket.sendPacketFromServer({
        command: "002", 
        parameters:[user.data.NICK, `Your host is ${config.hostname}/6667, running version ${config.version}`]
    });
    socket.sendPacketFromServer({
        command: "003", 
        parameters:[user.data.NICK, `This server was created ${config.startTime}`]
    });
    socket.sendPacketFromServer({
        command: "004",
        parameters:[user.data.NICK, config.hostname, config.version, "o", ""]
    });

    MOTD_C2S({socket, user, packet, network});

}

export {USER_C2S};