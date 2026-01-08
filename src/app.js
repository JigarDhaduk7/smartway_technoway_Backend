const express = require('express');
const cors = require('cors');
const testimonialRoutes = require('./routes/testimonial.routes');
const jobRoutes = require('./routes/job.routes');
const contactRoutes = require('./routes/contact.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/testimonials', testimonialRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/contacts', contactRoutes);



app.get('/', (req, res) => {
  res.send('Backend is running successfully 🚀');
});

module.exports = app;
