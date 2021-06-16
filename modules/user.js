export class User {
    data = {};
    constructor(){}
    getSource(){
        return `${this.data.NICK}!~${this.data.USERNAME}@${this.data.HOSTNAME}`;
    }
}