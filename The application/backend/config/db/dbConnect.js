const mongoose = require('mongoose');
// to suppress a warning
mongoose.set('strictQuery', true);

const dbConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log('Db is connected successfully');
    } catch (error){
        console.log(`Error ${error.message}`);
    }
};

module.exports = dbConnect;