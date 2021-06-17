export class Network {
    data = {
        connections: [],
        channels: {},
        self: null,
        users: []
    };
    constructor(){}
    broadcast(packet){
        let serialPacket = packet.serialize();
        for (let conn in this.data.connections){
            this.data.connections[conn].write(serialPacket);
        }
    }
    echo(user, packet){
        let serialPacket = packet.serialize();
        for (let conn in this.data.connections){
            if (user.data.UUID == conn){
                continue;
            }
            this.data.connections[conn].write(serialPacket);
        }
    }
    broadcastChannel(channel, packet){
        if (this.data.channels[channel] != undefined){
            this.data.channels[channel].broadcast(packet);
        }
    }
    echoChannel(channel, user, packet){
        if (this.data.channels[channel] != undefined){
            this.data.channels[channel].echo(user, packet);
        }
    }
    cullUser(user){
        delete this.data.connections[user.data.UUID];
        for (let i in this.data.channels){
            this.data.channels[i].cullUser(user);
        }
        delete this.data.users[user.data.UUID];
    }
}