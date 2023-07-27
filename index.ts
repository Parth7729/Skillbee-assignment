import { Eta } from "eta";
import path from "path";
import fs from "fs";


const eta = new Eta({ views: path.join(__dirname, "./../eta-template") });

const staticFileLimit: number = 10;

type Data = {
    activity?: string,
    type?: string,
    participants?: number,
    price?: number,
    link?: string,
    key?: string,
    accessibility?: number
}

const getData = async () => {
    try {
        const res = await fetch("https://www.boredapi.com/api/activity");
        const data: Data = await res.json();
        return data;
    }
    catch(err) {
        console.log((err as Error).message);
        return {};
    }
    
}

const main = async () => {
    for(let i = 1; i<=staticFileLimit; i++) {
        const data: Data = await getData();

        if(Object.keys(data).length === 0) continue;

        const res: string = eta.render("./sample", data);
        try {
            fs.writeFileSync(`./templates/index${i}.html`, res);
            console.log("written successfully");
        }
        catch (err) {
            console.log((err as Error).message);
        }
    }
}

main();
