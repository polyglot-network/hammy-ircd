// Include Nodejs' net module.
import net from "net";
import { Packet } from "./modules/packet.js";
import { config } from "./modules/config.js";
import { User } from "./modules/user.js";
import {uuid} from "./modules/uuid.js";
const tcpServer = new net.Server();
tcpServer.listen(config.port, function() {
    console.log(`Starting hammy-ircd ${config.version} on ${config.hostname}:${config.port}`);
});

let server = {
    connections: {}
}

tcpServer.on('connection', function(socket) {
    console.log('A new connection has been established.');
    let user = new User();
    socket.user = user;
    user.data.HOSTNAME = "fedora.hammy.network";
    user.data.UUID = uuid();
    server.connections[user.data.UUID] = socket;

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
                    socket.sendPacketFromServer({command: "251", parameters:[`There are ${Object.keys(server.connections).length} users and 0 invisible on 1 servers`]});
                    break;
                case "JOIN":
                    packet.data.source = `${user.data.NICK}!~${user.data.USERNAME}@${user.data.HOSTNAME}`;
                    socket.sendPacket(packet);
                    break;
                case "PART":
                    packet.data.source = `${user.data.NICK}!~${user.data.USERNAME}@${user.data.HOSTNAME}`;
                    socket.sendPacket(packet);
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
