const express = require('express');
const cors = require('cors');
const testimonialRoutes = require('./routes/testimonial.routes');
const jobRoutes = require('./routes/job.routes');
const contactRoutes = require('./routes/contact.routes');
const blogRoutes = require('./routes/blog.routes');
const serviceRoutes = require('./routes/service.routes');
const jobApplyRoutes = require('./routes/jobApply.routes');
const skillRoutes = require('./routes/skill.routes');
const visionaryLeadershipRoutes = require('./routes/visionaryLeadership.routes');
const projectRoutes = require('./routes/project.routes');



const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/testimonials', testimonialRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/job', jobApplyRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/leaders', visionaryLeadershipRoutes);
app.use('/api/projects', projectRoutes);
app.use("/api/auth", require("./routes/auth.routes"));






app.get('/', (req, res) => {
  res.send('Backend is running successfully 🚀');
});

module.exports = app;
