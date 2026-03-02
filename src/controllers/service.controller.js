const Service = require('../models/service.model');
const s3Service = require('../services/s3.service');

// ✅ CREATE SERVICE
exports.createService = async (req, res) => {
  try {
    const { title, slug } = req.body;

    if (!title || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Title and slug are required'
      });
    }

    const exists = await Service.findOne({
      $or: [{ title }, { slug }]
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Service title or slug already exists'
      });
    }

    const serviceData = { ...req.body };
    const uploadPromises = [];
    const fileMap = {};

    // Create file map from uploaded files
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        fileMap[file.fieldname] = file;
      });
    }

    // Handle card icon upload
    if (fileMap.cardIcon) {
      serviceData.card = serviceData.card || {};
      uploadPromises.push(
        s3Service.uploadFile(fileMap.cardIcon, 'services/icons')
          .then(url => { serviceData.card.icon = url; })
      );
    }

    // Handle services overview icons in parallel
    if (serviceData.servicesOverview && serviceData.servicesOverview.services) {
      serviceData.servicesOverview.services.forEach((service, i) => {
        const iconField = `serviceIcon${i}`;
        if (fileMap[iconField]) {
          uploadPromises.push(
            s3Service.uploadFile(fileMap[iconField], 'services/icons')
              .then(url => { serviceData.servicesOverview.services[i].icon = url; })
          );
        }
      });
    }

    // Handle process step icons in parallel
    if (serviceData.processSection && serviceData.processSection.steps) {
      serviceData.processSection.steps.forEach((step, i) => {
        const iconField = `stepIcon${i}`;
        if (fileMap[iconField]) {
          uploadPromises.push(
            s3Service.uploadFile(fileMap[iconField], 'services/icons')
              .then(url => { serviceData.processSection.steps[i].icon = url; })
          );
        }
      });
    }

    await Promise.all(uploadPromises);

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET ALL SERVICES
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ status: 'active' });
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET SERVICE BY SLUG
exports.getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE SERVICE
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const updateData = { ...req.body };
    const uploadPromises = [];
    const deletePromises = [];
    const fileMap = {};

    // Create file map from uploaded files
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        fileMap[file.fieldname] = file;
      });
    }

    // Handle card icon upload
    if (fileMap.cardIcon) {
      if (service.card && service.card.icon) {
        deletePromises.push(s3Service.deleteFile(service.card.icon));
      }
      updateData.card = updateData.card || {};
      uploadPromises.push(
        s3Service.uploadFile(fileMap.cardIcon, 'services/icons')
          .then(url => { updateData.card.icon = url; })
      );
    }

    // Handle services overview icons in parallel
    if (updateData.servicesOverview && updateData.servicesOverview.services) {
      updateData.servicesOverview.services.forEach((svc, i) => {
        const iconField = `serviceIcon${i}`;
        if (fileMap[iconField]) {
          if (service.servicesOverview && service.servicesOverview.services[i] && service.servicesOverview.services[i].icon) {
            deletePromises.push(s3Service.deleteFile(service.servicesOverview.services[i].icon));
          }
          uploadPromises.push(
            s3Service.uploadFile(fileMap[iconField], 'services/icons')
              .then(url => { updateData.servicesOverview.services[i].icon = url; })
          );
        }
      });
    }

    // Handle process step icons in parallel
    if (updateData.processSection && updateData.processSection.steps) {
      updateData.processSection.steps.forEach((step, i) => {
        const iconField = `stepIcon${i}`;
        if (fileMap[iconField]) {
          if (service.processSection && service.processSection.steps[i] && service.processSection.steps[i].icon) {
            deletePromises.push(s3Service.deleteFile(service.processSection.steps[i].icon));
          }
          uploadPromises.push(
            s3Service.uploadFile(fileMap[iconField], 'services/icons')
              .then(url => { updateData.processSection.steps[i].icon = url; })
          );
        }
      });
    }

    await Promise.all([...deletePromises, ...uploadPromises]);

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE SERVICE
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const deletePromises = [];

    // Delete all associated icons from S3 in parallel
    if (service.card && service.card.icon) {
      deletePromises.push(s3Service.deleteFile(service.card.icon));
    }

    if (service.servicesOverview && service.servicesOverview.services) {
      service.servicesOverview.services.forEach(serviceItem => {
        if (serviceItem.icon) {
          deletePromises.push(s3Service.deleteFile(serviceItem.icon));
        }
      });
    }

    if (service.processSection && service.processSection.steps) {
      service.processSection.steps.forEach(step => {
        if (step.icon) {
          deletePromises.push(s3Service.deleteFile(step.icon));
        }
      });
    }

    await Promise.all([...deletePromises, Service.findByIdAndDelete(req.params.id)]);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
