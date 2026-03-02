const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customer');


const app = express();
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(bodyParser.json());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/customer', customerRoutes);


app.listen(5000, () => console.log('Server running on port 5000'));
