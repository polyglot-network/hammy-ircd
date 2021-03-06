import { JOIN_C2S } from "./commands/JOIN.js"
import { LUSERS_C2S } from "./commands/LUSERS.js"
import { MOTD_C2S } from "./commands/MOTD.js"
import { NICK_C2S } from "./commands/NICK.js"
import { PART_C2S } from "./commands/PART.js"
import { PING_C2S } from "./commands/PING.js"
import { PRIVMSG_C2S } from "./commands/PRIVMSG.js"
import { QUIT_C2S } from "./commands/QUIT.js"
import { USER_C2S } from "./commands/USER.js"
import { config } from "./config.js"
import { Packet } from "./packet.js"

const COMMAND_TREE_C2S = {
    "JOIN": JOIN_C2S,
    "LUSERS": LUSERS_C2S,
    "NICK": NICK_C2S,
    "PART": PART_C2S,
    "PING": PING_C2S,
    "PRIVMSG": PRIVMSG_C2S,
    "QUIT": QUIT_C2S,
    "USER": USER_C2S,
    "MOTD": MOTD_C2S
}

const NO_AUTH_COMMANDS = ["NICK", "USER"];

let commandHandler = ({socket, packet, network}) => {
    if (packet.data.source != ""){
        packet.data.source == "";
    }
    if (Object.keys(packet.data.tags).length != 0){
        packet.data.tags = {};
    }
    console.log(packet.data.original);
    if (socket.user == undefined && !NO_AUTH_COMMANDS.includes(packet.data.command)){
        socket.sendPacketFromServer({
            command: "451", 
            parameters:[`You have not registered`]
        });
        return;
    } 
    if (COMMAND_TREE_C2S.hasOwnProperty(packet.data.command)){
        COMMAND_TREE_C2S[packet.data.command]({socket, user: socket.user?socket.user:undefined, packet, network});
    } 
}

export {commandHandler};