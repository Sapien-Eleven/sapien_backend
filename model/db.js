const mongoose = require('mongoose');
const dbusername = encodeURIComponent('AdminSapienEleven')
const dbpassword = encodeURIComponent('SapienEleven@2024');
mongoose.connect(`mongodb://${dbusername}:${dbpassword}@162.247.131.12:27017/sapieneleven?authSource=admin`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(() => {
    console.log('mongodb connected')
});
const conn = mongoose.connection;
conn.on('connected', () => console.log('mongodb connected successfully'));
conn.on('disconnected', () => console.log('mongodb disconnected'));
conn.on('error', () => console.error.bind(console, 'connection error:'));
module.exports = conn;