const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const User = require('./models/userModel');

dotenv.config({ path: './config.env' });

const app = require('./app');
const https = require('https');

const privateKey = fs.readFileSync('./keys/server.key', 'utf-8');
const certificate = fs.readFileSync('./keys/server.cert', 'utf-8');

const credentials = {
  key: privateKey,
  cert: certificate,
};

const httpsServer = https.createServer(credentials, app);

mongoose
  .connect(process.env.DATABASE)
  .then(async () => {
    console.log(`MongoDB Connection Successful to ${process.env.DATABASE}`);

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No Users Found, creating default admin...');

      await User.create({
        username: 'admin',
        password: 'adminpassword',
        role: 3,
        firstName: 'System',
        lastName: 'Admin',
      });
      console.log('Default Admin user created!');
    }
  })
  .catch((err) => {
    console.log(`Mongoose connection error ${err}`);
  });

const port = process.env.PORT || 3000;

httpsServer.listen(port, () => {
  console.log(`Server running in HTTPS on ${port}`);
});
