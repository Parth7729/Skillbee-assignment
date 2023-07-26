import { Eta } from "eta";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eta = new Eta({ views: path.join(__dirname, "eta-template") });


async function get_data() {
    try {
        const res = await fetch("https://www.boredapi.com/api/activity");
        const data = await res.json();
        return data;
    }
    catch(e) {
        console.log(e);
        return 'error';
    }
}

async function main() {
    for(let i = 1; i<=10; i++) {
        const data = await get_data();
        const res = eta.render("./sample", data);
        try {
            fs.writeFileSync(`./templates/index${i}.html`, res);
            console.log("written successfully");
        }
        catch (err) {
            console.log(err);
        }
    }
}

main();
