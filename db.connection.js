const mongoose= require("mongoose")
require("dotenv").config()


const {DB_Test_NAME,DB_HOST}=process.env
const URL=`${DB_HOST}/${DB_Test_NAME}`


/**
 * Connect to the mongo database.
 */
const connectToDatabase = async () => {
    try {        
        await mongoose.connect("mongodb://127.0.0.1:27017/test");
    } catch (error) {
        throw error
    }
}

/**
 * Drop database, close the connection and stop mongod.
 */
const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
}

/**
 * Remove all the data for all db collections.
 */
const clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}

module.exports= {clearDatabase,closeDatabase,connectToDatabase}