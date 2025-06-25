import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("connectDB entry");

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB connected");
    } catch (error) {
        console.error(`connectDB Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
