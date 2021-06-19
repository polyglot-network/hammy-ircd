// Include Nodejs' net module.
import net from "net";
import { Packet } from "./modules/packet.js";
import { config } from "./modules/config.js";
import { User } from "./modules/user.js";
import {uuid} from "./modules/uuid.js";
import {Network} from "./modules/network.js";
import { Channel } from "./modules/channel.js";
import { commandHandler } from "./modules/command.js";
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
    network.data.users[user.data.UUID] = user;

    socket.on('data', function(chunk) {
        let data = chunk.toString();
        data = data.split("\r\n");
        data.forEach((p)=>{
            if (p.trim() == ""){
                return;
            }
            let packet = Packet.parse(p);
            commandHandler({socket, user, packet, network});
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
