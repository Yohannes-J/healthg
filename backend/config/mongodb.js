import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () =>
    console.log("Database connected successfully at this time")
  );
  await mongoose.connect(`${process.env.MONGODB_URI}/guide`);
};

export default connectDB;
