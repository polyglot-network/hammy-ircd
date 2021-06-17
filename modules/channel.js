export class Channel {
    data = {
        users: [],
        name: "",
        mode: ""
    };
    constructor(name){
        this.data.name = name;
    }
    addUser(user){
        this.data.users.push(user);
    }
    cullUser(user){
        this.data.users = this.data.users.filter(u => u.data.UUID != user.data.UUID);
    }
    broadcast(packet){
        let serialPacket = packet.serialize();
        for (let conn in this.data.users){
            this.data.users[conn].socket.write(serialPacket);
        }
    }
    echo(user, packet){
        let serialPacket = packet.serialize();
        for (let u of this.data.users){
            if (u.data.UUID == user.data.UUID){
                continue;
            }
            u.socket.write(serialPacket);
        }
    }
}