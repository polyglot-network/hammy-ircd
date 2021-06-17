// Include Nodejs' net module.
import net from "net";
import { Packet } from "./modules/packet.js";
import { config } from "./modules/config.js";
import { User } from "./modules/user.js";
import {uuid} from "./modules/uuid.js";
import {Network} from "./modules/network.js";
import { Channel } from "./modules/channel.js";
const tcpServer = new net.Server();
tcpServer.listen(config.port, function() {
    console.log(`Starting hammy-ircd ${config.version} on ${config.hostname}:${config.port}`);
});

let network = new Network();

tcpServer.on('connection', function(socket) {
    console.log('A new connection has been established.');
    let user = new User();
    socket.user = user;
    user.socket = socket;
    user.data.UUID = uuid();
    user.data.CONNECTEDSERVER = config.hostname;
    user.data.HOSTNAME = `${user.data.UUID}.hammy.network`;
    network.data.connections[user.data.UUID] = socket;

    socket.on('data', function(chunk) {
        let data = chunk.toString();
        data = data.split("\r\n");
        data.forEach((p)=>{
            if (p.trim() == ""){
                return;
            }
            let packet = Packet.parse(p);
            switch (packet.data.command){
                case "NICK":
                    if (user.data.USERNAME){
                        packet.data.source = user.data.NICK;
                        network.broadcast(packet);
                    }
                    user.data.NICK = packet.data.parameters[0];
                    break;
                case "USER":
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
                    break;
                case "PING":
                    socket.sendPacketFromServer({command: "PONG", parameters:[user.data.USERNAME].concat(packet.data.parameters)});
                    break;
                case "LUSERS":
                    socket.sendPacketFromServer({command: "251", parameters:[`There are ${Object.keys(network.data.connections).length} users and 0 invisible on 1 servers`]});
                    break;
                case "JOIN":
                    packet.data.source = user.getSource();
                    let channel = packet.data.parameters[0]
                    if (network.data.channels[channel] == undefined){
                        network.data.channels[channel] = new Channel(channel)
                    }
                    network.data.channels[channel].addUser(user);
                    network.data.channels[channel].broadcast(packet)
                    break;
                case "PRIVMSG":
                    packet.data.source = user.getSource();
                    network.echo(user, packet);
                    break;
                // case "WHO":
                //     if (packet.data.parameters[0]){
                //         let channel = packet.data.parameters[0];
                //         if (network.data.channels[channel] == undefined)
                //             return;
                //         for (let i in network.data.channels[channel].data.users){
                //             let u = network.data.channels[channel].data.users[i];
                //             socket.sendPacketFromServer({command: "352", parameters: [user.data.NICK, channel, "152", `~${u.data.USERNAME}`, u.data.HOSTNAME, u.data.CONNECTEDSERVER, u.data.NICK, ": :", u.data.USERNAME]})
                //         }
                //         socket.sendPacketFromServer({command: "315", parameters: [user.data.NICK, channel, ":End of /WHO list."]})
                //     }
                //     break;
                case "PART":
                    packet.data.source = user.getSource();
                    network.broadcast(packet);
                    break;
                case "QUIT":
                    packet.data.source = user.getSource();
                    network.broadcast(packet);
                    socket.destroy();
                    break;
                default:
                    console.log(`UNKNOWN COMMAND ${packet.data.command}`);
                    console.log(`unknown packet: ${p}`)
                    break;
            } 
        })
    });

    socket.on('end', function() {
        console.log('Closing connection with the client');
        network.cullUser(user);
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });

    socket.sendPacketFromServer = (packetData)=>{
        socket.sendPacket(new Packet(Object.assign({
            source: config.hostname,
        }, packetData)));
    }

    socket.sendPacket = (packet)=>{
        socket.write(packet.serialize());
    }
});
