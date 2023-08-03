import { Eta } from "eta";
import path from "path";
import fs from "fs";


const eta = new Eta({ views: path.join(__dirname, "./../eta-template") });

const staticFileLimit: number = 13, bundleSize: number = 5;

type Data = {
    activity: string,
    type: string,
    participants: number,
    price: number,
    link: string,
    key: string,
    accessibility: number
}

const getData = async (): Promise<Data | null> => {
    try {
        // const res = await fetch("https://codehashira.in/api/index");     //wrong endpoint for testing
        const res = await fetch("https://www.boredapi.com/api/activity");
        const data: Data = await res.json();
        return data;
    }
    catch(err) {
        console.log("Invalid response");
        return null;
    }
    
}

const main = async (): Promise<void> => {
    let currCount: number = 0, fileCount: number = 0;

    while(currCount < staticFileLimit) {
        const resList: Promise<Data | null>[] = [];

        for(let i = currCount; i<Math.min(staticFileLimit, currCount+bundleSize); i++) {
            const promiseRes = getData();
            resList.push(promiseRes);
        }

        currCount += bundleSize;

        Promise.all(resList).then((responses: (Data | null)[]) => {
            responses.map((data) => {
                if(data !== null) {
                    const res: string = eta.render("./sample", data);

                    fs.writeFile(`./templates/index${fileCount++}.html`, res, (err) => {
                        if(err) console.log(err.message);
                        else console.log("written successfully");
                    });
                }

            })
        })
    
    }
}

main();
