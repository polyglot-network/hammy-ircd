import {config} from "./config.js";

export class Packet {
    data = {
        tags: {},
        source: "",
        command: "",
        parameters: []
    }
    constructor(data){
        for (let i in data){
            this.data[i] = data[i]; 
        }
    }
    serialize(){
        let text = "";
        let tags = Object.entries(this.data.tags);
        if (tags.length != 0){
            text += `@${tags.map((tag)=>`${tag[0]}=${tag[1]}`).join(";")} `;
        }

        if (this.data.source != ""){
            text += `:${this.data.source} `;
        } 

        text += `${this.data.command}`;
        if (this.data.parameters.length > 0){
            text += ` ${this.data.parameters.join(" ")}`
        }

        text += "\r\n";
        return text;
    }
    static parse(packet){
        console.log(packet);
        let split = packet.split(" ");
        let data = {};
        for (let i in split){
            let bit = split[i];
            if (bit.startsWith("@") && data.tags == undefined){
                let tags = {};
                let tagsplits = bit.split(";");
                for (let j in tagsplits){
                    let tag = tagsplits[j].split("=");
                    tags[tag[0].replace("@", "")] = tag[1];
                }
                data.tags = tags;
            } else if (bit.startsWith(":") && data.source == undefined){
                data.source = bit.replace(":", "");
            } else if (data.command == undefined){
                data.command = bit.toUpperCase();
                i++;
                data.parameters = split.slice(i);
                break;
            }
        }

        return new Packet(data);
    }
}