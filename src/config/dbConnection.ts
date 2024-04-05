import mongoose from "mongoose";

const connectionString: string | undefined = process.env.CONNECTION_STRING;

export const connectDB = async () => {
  if (connectionString != undefined) {
    try {
      const connect = await mongoose.connect(connectionString);
      console.log(
        "Database Connected",
        connect.connection.host,
        connect.connection.name
      );
    } catch (e) {
      console.log(e);
    }
  }
};
