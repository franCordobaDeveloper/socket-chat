const mongoose = require('mongoose');

const dbConnection = async () => {

    const optionsMongoose = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    try {

        await mongoose.connect( process.env.MONGODB_CNN, optionsMongoose );

        console.log("Base de datos online");

    } catch ( error ) {

        console.log( error );
        throw new Error("Falló conección en la base de datos", error );

    }

}


module.exports = {
    dbConnection,
}