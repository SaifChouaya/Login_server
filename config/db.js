const MONGODB_URL ="mongodb+srv://SaifChouaya:saifch123456@cluster0.ojftg2p.mongodb.net/";

const mongoose = require('mongoose');
mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB Connected");
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});