import { config } from "../config.js";
import fs from "fs";

let MOTD = fs.readFileSync("./config/MOTD.txt", {encoding:'utf8', flag:'r'}).split("\n");
 
let MOTD_C2S = ({socket, user, packet, network}) => {
    socket.sendPacketFromServer({command: "375", parameters:[user.data.USERNAME, `:- ${config.hostname} Message of the Day -`]});
    for (let line of MOTD){
    socket.sendPacketFromServer({command: "372", parameters:[user.data.USERNAME, `:- ${line}`]});
    }
    socket.sendPacketFromServer({command: "376", parameters:[user.data.USERNAME, `:- :End of /MOTD command.`]});
}

export {MOTD_C2S};