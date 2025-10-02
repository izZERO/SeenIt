const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to ${mongoose.connection.name} DB`);
});

module.exports =  mongoose;
