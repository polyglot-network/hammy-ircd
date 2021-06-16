export class Channel {
    data = {
        users: [],
        name: "",
        mode: ""
    };
    constructor(){}
    getSource(){
        return `${this.data.NICK}!~${this.data.USERNAME}@${this.data.HOSTNAME}`;
    }
}