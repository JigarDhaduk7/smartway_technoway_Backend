const axios = require('axios');

/**
 * Upload file buffer to OneDrive
 */
exports.uploadToOneDrive = async (fileBuffer, fileName, mimeType) => {
  const accessToken = process.env.ONEDRIVE_ACCESS_TOKEN;

  const uploadUrl =
    `https://graph.microsoft.com/v1.0/me/drive/root:/Resumes/${fileName}:/content`;

  const response = await axios.put(uploadUrl, fileBuffer, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': mimeType
    }
  });

  return {
    id: response.data.id,
    webUrl: response.data.webUrl,
    name: response.data.name
  };
};
