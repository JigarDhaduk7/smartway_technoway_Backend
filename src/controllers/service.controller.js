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

    // Handle card icon upload
    if (req.files && req.files.cardIcon) {
      serviceData.card = serviceData.card || {};
      serviceData.card.icon = await s3Service.uploadFile(req.files.cardIcon[0], 'services/icons');
    }

    // Handle services overview icons
    if (req.files && serviceData.servicesOverview && serviceData.servicesOverview.services) {
      for (let i = 0; i < serviceData.servicesOverview.services.length; i++) {
        const iconField = `serviceIcon${i}`;
        if (req.files[iconField]) {
          serviceData.servicesOverview.services[i].icon = await s3Service.uploadFile(req.files[iconField][0], 'services/icons');
        }
      }
    }

    // Handle process step icons
    if (req.files && serviceData.processSection && serviceData.processSection.steps) {
      for (let i = 0; i < serviceData.processSection.steps.length; i++) {
        const iconField = `stepIcon${i}`;
        if (req.files[iconField]) {
          serviceData.processSection.steps[i].icon = await s3Service.uploadFile(req.files[iconField][0], 'services/icons');
        }
      }
    }

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

    // Handle card icon upload
    if (req.files && req.files.cardIcon) {
      if (service.card && service.card.icon) {
        await s3Service.deleteFile(service.card.icon);
      }
      updateData.card = updateData.card || {};
      updateData.card.icon = await s3Service.uploadFile(req.files.cardIcon[0], 'services/icons');
    }

    // Handle services overview icons
    if (req.files && updateData.servicesOverview && updateData.servicesOverview.services) {
      for (let i = 0; i < updateData.servicesOverview.services.length; i++) {
        const iconField = `serviceIcon${i}`;
        if (req.files[iconField]) {
          // Delete old icon if exists
          if (service.servicesOverview && service.servicesOverview.services[i] && service.servicesOverview.services[i].icon) {
            await s3Service.deleteFile(service.servicesOverview.services[i].icon);
          }
          updateData.servicesOverview.services[i].icon = await s3Service.uploadFile(req.files[iconField][0], 'services/icons');
        }
      }
    }

    // Handle process step icons
    if (req.files && updateData.processSection && updateData.processSection.steps) {
      for (let i = 0; i < updateData.processSection.steps.length; i++) {
        const iconField = `stepIcon${i}`;
        if (req.files[iconField]) {
          // Delete old icon if exists
          if (service.processSection && service.processSection.steps[i] && service.processSection.steps[i].icon) {
            await s3Service.deleteFile(service.processSection.steps[i].icon);
          }
          updateData.processSection.steps[i].icon = await s3Service.uploadFile(req.files[iconField][0], 'services/icons');
        }
      }
    }

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

    // Delete all associated icons from S3
    if (service.card && service.card.icon) {
      await s3Service.deleteFile(service.card.icon);
    }

    if (service.servicesOverview && service.servicesOverview.services) {
      for (const serviceItem of service.servicesOverview.services) {
        if (serviceItem.icon) {
          await s3Service.deleteFile(serviceItem.icon);
        }
      }
    }

    if (service.processSection && service.processSection.steps) {
      for (const step of service.processSection.steps) {
        if (step.icon) {
          await s3Service.deleteFile(step.icon);
        }
      }
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
