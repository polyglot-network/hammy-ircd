export class Channel {
    data = {
        users: {},
        name: "",
        mode: ""
    };
    constructor(name){
        this.data.name = name;
    }
    addUser(user){
        this.data.users[user.data.UUID] = user;
    }
    cullUser(user){
        delete this.data.users[user.data.UUID];
    }
    broadcast(packet){
        let serialPacket = packet.serialize();
        for (let conn in this.data.users){
            this.data.users[conn].socket.write(serialPacket);
        }
    }
    echo(user, packet){
        let serialPacket = packet.serialize();
        for (let uID in this.data.users){
            let u = this.data.users[uID];
            if (u.data.UUID == user.data.UUID){
                continue;
            }
            u.socket.write(serialPacket);
        }
    }
}