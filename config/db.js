import mongoose  from "mongoose";

const db = async () => {
    mongoose.connection.on('connected', () => 
    console.log("Connected to MongoDB"));
    mongoose.connection.on('error', (err) =>
    console.log("Error connecting to MongoDB", err));
    await mongoose.connect(`${process.env.MONGO_URI}/subscription`);
};

export default db;

