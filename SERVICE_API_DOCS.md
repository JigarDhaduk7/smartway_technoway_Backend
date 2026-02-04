# Service API with File Upload

## File Upload Fields

The service API now supports uploading icons for different sections:

### Available Upload Fields:
- `cardIcon` - Icon for the service card
- `serviceIcon0`, `serviceIcon1`, `serviceIcon2`, etc. - Icons for services in servicesOverview
- `stepIcon0`, `stepIcon1`, `stepIcon2`, etc. - Icons for process steps

## API Endpoints

### 1. Create Service
**POST** `/api/services/create`

**Content-Type:** `multipart/form-data`

**Form Fields:**
```
title: "Web Development"
slug: "web-development"
card[shortDescription]: "Professional web development services"
heroSection[headline]: "Build Amazing Websites"
heroSection[subHeadline]: "Custom web solutions for your business"
servicesOverview[title]: "Our Services"
servicesOverview[description]: "We offer comprehensive web development services"
servicesOverview[services][0][id]: "1"
servicesOverview[services][0][title]: "Frontend Development"
servicesOverview[services][0][description]: "Modern responsive websites"
processSection[title]: "Our Process"
processSection[steps][0][step]: 1
processSection[steps][0][title]: "Planning"
```

**File Fields:**
```
cardIcon: [file]
serviceIcon0: [file] (for servicesOverview.services[0].icon)
stepIcon0: [file] (for processSection.steps[0].icon)
```

### 2. Update Service
**PUT** `/api/services/update/:id`

Same structure as create, but only include fields you want to update.

### 3. Get All Services
**GET** `/api/services/`

### 4. Get Service by Slug
**GET** `/api/services/:slug`

### 5. Delete Service
**DELETE** `/api/services/delete/:id`

## Example using Postman/Frontend

### JavaScript Fetch Example:
```javascript
const formData = new FormData();
formData.append('title', 'Web Development');
formData.append('slug', 'web-development');
formData.append('card[shortDescription]', 'Professional web development');
formData.append('cardIcon', fileInput.files[0]); // File input

// For nested arrays, use bracket notation
formData.append('servicesOverview[services][0][title]', 'Frontend Development');
formData.append('serviceIcon0', serviceIconFile); // File for first service

fetch('/api/services/create', {
  method: 'POST',
  body: formData
});
```

## Response Format

All endpoints return JSON in this format:
```json
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "_id": "...",
    "title": "Web Development",
    "slug": "web-development",
    "card": {
      "shortDescription": "Professional web development",
      "icon": "https://your-bucket.s3.amazonaws.com/services/icons/1234567890-icon.png"
    },
    "servicesOverview": {
      "services": [
        {
          "id": "1",
          "title": "Frontend Development",
          "description": "Modern responsive websites",
          "icon": "https://your-bucket.s3.amazonaws.com/services/icons/1234567891-icon.png"
        }
      ]
    },
    "processSection": {
      "steps": [
        {
          "step": 1,
          "title": "Planning",
          "icon": "https://your-bucket.s3.amazonaws.com/services/icons/1234567892-icon.png"
        }
      ]
    }
  }
}
```

## Notes:
- All icons are stored in S3 under `services/icons/` folder
- Icons are automatically deleted from S3 when service is deleted or updated
- Maximum 5 service icons and 5 step icons supported (can be increased if needed)
- Supported file types: PNG, JPEG, JPG, SVG