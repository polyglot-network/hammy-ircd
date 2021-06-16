// Include Nodejs' net module.
import net from "net";
import { Packet } from "./modules/packet.js";
import { config } from "./modules/config.js";
import { User } from "./modules/user.js";
const server = new net.Server();
server.listen(config.port, function() {
    console.log(`Starting hammy-ircd ${config.version} on ${config.hostname}:${config.port}`);
});

server.on('connection', function(socket) {
    console.log('A new connection has been established.');
    let user = new User();

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
                        parameters:[user.data.USERNAME, `Welcome to irc.hammy.network ${packet.data.USERNAME}. We hope you enjoy your stay`]
                    });
                    socket.sendPacketFromServer({
                        command: "002", 
                        parameters:[user.data.USERNAME, `Your host is ${config.hostname}/6667, running version ${config.version}`]
                    });
                    socket.sendPacketFromServer({
                        command: "003", 
                        parameters:[user.data.USERNAME, `This server was created ${config.startTime}`]
                    });
                    socket.sendPacketFromServer({
                        command: "004",
                        parameters:[user.data.USERNAME, config.hostname, config.version, "o", ""]
                    })
                    break;
                case "PING":
                    socket.sendPacketFromServer({command: "PONG", parameters:[user.data.USERNAME].concat(packet.data.parameters)})
                default:
                    console.log(`UNKNOWN COMMAND ${packet.command}`);
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