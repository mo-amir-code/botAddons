import mongoose from "mongoose";
import { DB_URI } from "./constants.js";

const connectToMongo = async () => {
    try {
        if(mongoose.connection.readyState !== 1){
            await mongoose.connect(DB_URI);
            console.log("Database connected...!");
        }else{
            console.log("Database already connected...!");
        }
    } catch (error) {
        console.error("Error While Database Connection: ", error);
    }
}