const mongoose = require('mongoose');
const dbusername = encodeURIComponent('sapien_user')
const dbpassword = encodeURIComponent('sapieneleven@2024');
mongoose.connect(`mongodb://${dbusername}:${dbpassword}@127.0.0.1:27017/acr?authSource=admin`,
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