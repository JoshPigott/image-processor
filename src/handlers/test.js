import { json } from "../utils/json.js";

export function sayHi(ctx){
    console.log("output:", ctx.p);
    const response = json("sucessful", {status: 200});
    return response;
}