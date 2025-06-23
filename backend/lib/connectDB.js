import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("connectDB entry");
        console.log(process.env.MONGO);

        await mongoose.connect(process.env.MONGO);
        console.log("Mongo DB connected");
    } catch (error) {
        console.error(`connectDB Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
