const ClickData = require('../models/clickDataModel');

exports.saveClickData = async (data, req) => {
  try {
    const headers = getAllHeaders(req);
    const clickData = new ClickData({
      tag: data.tag,
      text: data.text,
      id: data.id,
      ip: data.ipAddress,
      class: data.class,
      headers: headers,
      localStorageData: data.localStorageData,
      SessionStorage: data.sessionStorageData,
    });
    const savedData = await clickData.save();
    console.log('Data saved to MongoDB:', savedData);
  } catch (error) {
    console.error('Failed to insert data into MongoDB:', error);
  }
};

const getAllHeaders = (req) => {
  const headers = {};
  for (const header in req.headers) {
    headers[header] = req.headers[header];
  }
  return headers;
};