const express = require('express');
const env = require('dotenv')
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
env.config();

//routes
const adminRoutes = require('./routes/admin/auth');
const initialDataRoutes = require('./routes/admin/initialData');
const adminOrderRoutes = require('./routes/admin/orderAdmin');
const userRoutes = require('./routes/admin/user');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const addressRoutes = require('./routes/address');
const wishListRoutes = require('./routes/wishlist');

// connect moongodb
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lw60v.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
).then(() => {
  console.log('Database connected');
});

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'uploads')));
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', initialDataRoutes);
app.use('/api', orderRoutes);
app.use('/api', adminOrderRoutes);
app.use('/api', addressRoutes);
app.use('/api', wishListRoutes);
app.use('/api', userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`)
})