/*
 * Title: Product Data File Handler
 * Description: Take requests and response with data accordingly
 * Author: Saud
 * Date: 08-30-2020
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const { StringDecoder } = require('string_decoder');

// Module scaffolding
const data = {};

// Configuration
data.config = {
  dataPath: path.join(__dirname, '../.data/'),
};

// Read all product data
data.readAllProductData = (reqMethod, callback) => {
  if (reqMethod === 'GET') {
    const decoder = new StringDecoder('utf-8');

    fs.readFile(`${data.config.dataPath}data.json`, (err, productData) => {
      const decodedProductData = decoder.write(productData);
      const parsedProductData = JSON.parse(decodedProductData);

      if (!err) {
        if (parsedProductData.length > 0) {
          callback(200, {
            message: 'success',
            productData: parsedProductData,
          });
        } else {
          callback(404, {
            message: 'No data found.',
          });
        }
      } else {
        callback(500, {
          message: 'Internal server error.',
          err,
        });
      }
    });
  } else {
    callback(400, {
      message: 'Invalid user request (method).',
    });
  }
};

// Read a product data
data.readProductData = (reqMethod, reqQuery, callback) => {
  if (reqMethod === 'GET') {
    const decoder = new StringDecoder('utf-8');
    const itemId =
      typeof parseInt(reqQuery.itemId, 10) === 'number' && parseInt(reqQuery.itemId, 10) > 0
        ? parseInt(reqQuery.itemId, 10)
        : null;

    if (itemId) {
      // Read product data
      fs.readFile(`${data.config.dataPath}data.json`, (err, productData) => {
        if (!err) {
          const decodedProductData = decoder.write(productData);
          const parsedProductData = JSON.parse(decodedProductData);
          let flag = 0;

          parsedProductData.map((obj) => {
            if (obj.itemId === itemId) {
              flag = 1;

              callback(200, {
                message: 'success',
                productData: obj,
              });

              return false;
            }
          });

          if (flag === 0) {
            callback(404, {
              message: 'No data found.',
            });
          }
        } else {
          callback(500, {
            message: 'Internal server error.',
          });
        }
      });
    } else {
      callback(400, {
        message: 'Invalid user request.',
      });
    }
  } else {
    callback(400, {
      message: 'Invalid user request.',
    });
  }
};

// Write a product data
data.writeProductData = (reqMethod, resData, callback) => {
  if (reqMethod === 'POST') {
    const decoder = new StringDecoder();
    const parsedResData = JSON.parse(resData);

    const itemName =      typeof parsedResData.itemName === 'string' && parsedResData.itemName.trim().length > 0
        ? parsedResData.itemName
        : null;
    const itemNickName =      typeof parsedResData.itemNickName === 'string' && parsedResData.itemNickName.trim().length > 0
        ? parsedResData.itemNickName
        : null;
    const cat =
      typeof parsedResData.cat === 'number' && [1, 2].indexOf(parsedResData.cat) > -1
        ? parsedResData.cat
        : null;
    const subcat =      typeof parsedResData.subcat === 'number' && parsedResData.subcat >= 1
        ? parsedResData.subcat
        : null;
    const subcat2 =
      typeof parsedResData.subcat2 === 'number' && parsedResData.subcat2 >= 1
        ? parsedResData.subcat2
        : null;
    const type =
      typeof parsedResData.type === 'number' && [1, 2].indexOf(parsedResData.type) > -1
        ? parsedResData.type
        : null;
    const applyGroup =
      typeof parsedResData.applyGroup === 'number' && parsedResData.applyGroup >= 1
        ? parsedResData.applyGroup
        : null;
    const invType =      typeof parsedResData.invType === 'number' && parsedResData.invType >= 1
        ? parsedResData.invType
        : null;
    const unit =      typeof parsedResData.unit === 'number' && parsedResData.unit >= 1 ? parsedResData.unit : null;
    const alertQty =      typeof parsedResData.alertQty === 'number' && parsedResData.alertQty > 0
        ? parsedResData.alertQty
        : null;
    const itemImage =      typeof parsedResData.itemImage === 'string' && parsedResData.itemImage.trim().length > 0
        ? parsedResData.itemImage
        : null;
    const remarks =
      typeof parsedResData.remarks === 'string' && parsedResData.remarks.trim().length > 0
        ? parsedResData.remarks
        : null;
    parsedResData.itemCreated = Date.now();

    if (
      itemName
      && itemNickName
      && cat
      && subcat
      && subcat2
      && type
      && applyGroup
      && invType
      && unit
      && alertQty
    ) {
      // Read product data
      fs.readFile(`${data.config.dataPath}data.json`, (err, productData) => {
        if (!err && productData) {
          const decodedProductData = decoder.write(productData);
          const parsedProductData = JSON.parse(decodedProductData);
          let id = null;

          if (parsedProductData.length > 0) {
            // Get the last element id
            id = parsedProductData[parsedProductData.length - 1].id + 1;
          } else {
            id = 1;
          }

          // using spread operator to copy 'parsedResData' obj into new obj 'updParsedData'
          const updParsedData = { id, ...parsedResData };

          parsedProductData.push(updParsedData);

          const strParsedProductData = JSON.stringify(parsedProductData);

          // Write product data
          fs.writeFile(`${data.config.dataPath}data.json`, strParsedProductData, (err2) => {
            if (!err2) {
              callback(200, {
                message: 'Product data added successfully.',
              });
            } else {
              callback(400, {
                message: 'Internal server error.',
              });
            }
          });
        } else {
          callback(400, {
            message: 'Internal server error.',
          });
        }
      });
    } else {
      callback(400, {
        message: 'Invalid user request (payload).',
      });
    }
  } else {
    callback(400, {
      message: 'Invalid user request (method).',
    });
  }
};

// Delete a product data
data.deleteProductData = (reqMethod, reqQuery, callback) => {
  if (reqMethod === 'DELETE') {
    const decoder = new StringDecoder('utf-8');
    const itemId =
      typeof parseInt(reqQuery.itemId, 10) === 'number' && parseInt(reqQuery.itemId, 10) > 0
        ? parseInt(reqQuery.itemId, 10)
        : null;

    if (itemId) {
      // Read product data
      fs.readFile(`${data.config.dataPath}data.json`, (err, productData) => {
        if (!err) {
          const decodedProductData = decoder.write(productData);
          const parsedProductData = JSON.parse(decodedProductData);

          let flag = 0;

          parsedProductData.map((obj, indx) => {
            if (obj.itemId === itemId) {
              flag = 1;
              parsedProductData.splice(indx, 1);

              const strParsedProductData = JSON.stringify(parsedProductData);

              // Re-write update data
              fs.writeFile(`${data.config.dataPath}data.json`, strParsedProductData, (err2) => {
                if (!err2) {
                  callback(200, {
                    message: 'Product deleted successfully.',
                  });
                } else {
                  callback(500, {
                    message: 'Internal server error.',
                  });
                }
              });

              return false;
            }
          });

          if (flag === 0) {
            callback(404, {
              message: 'No data found.',
            });
          }
        } else {
          callback(500, {
            message: 'Internal server error.',
          });
        }
      });
    } else {
      callback(400, {
        message: 'Invalid user request.',
      });
    }
  } else {
    callback(404, {
      message: 'Invalid user request',
    });
  }
};

// Update a product data
data.updateProductData = (reqMethod, reqQuery, resData, callback) => {
  if (reqMethod === 'PUT') {
    const decoder = new StringDecoder('utf-8');
    const parsedResData = JSON.parse(resData);

    const itemId =
      typeof parseInt(reqQuery.itemId, 10) === 'number' && parseInt(reqQuery.itemId, 10) > 0
        ? parseInt(reqQuery.itemId, 10)
        : null;
    const itemName =      typeof parsedResData.itemName === 'string' && parsedResData.itemName.trim().length > 0
        ? parsedResData.itemName
        : null;
    const itemNickName =      typeof parsedResData.itemNickName === 'string' && parsedResData.itemNickName.trim().length > 0
        ? parsedResData.itemNickName
        : null;
    const cat =
      typeof parsedResData.cat === 'number' && [1, 2].indexOf(parsedResData.cat) > -1
        ? parsedResData.cat
        : null;
    const subcat =      typeof parsedResData.subcat === 'number' && parsedResData.subcat >= 1
        ? parsedResData.subcat
        : null;
    const subcat2 =
      typeof parsedResData.subcat2 === 'number' && parsedResData.subcat2 >= 1
        ? parsedResData.subcat2
        : null;
    const type =
      typeof parsedResData.type === 'number' && [1, 2].indexOf(parsedResData.type) > -1
        ? parsedResData.type
        : null;
    const applyGroup =
      typeof parsedResData.applyGroup === 'number' && parsedResData.applyGroup >= 1
        ? parsedResData.applyGroup
        : null;
    const invType =      typeof parsedResData.invType === 'number' && parsedResData.invType >= 1
        ? parsedResData.invType
        : null;
    const unit =      typeof parsedResData.unit === 'number' && parsedResData.unit >= 1 ? parsedResData.unit : null;
    const alertQty =      typeof parsedResData.alertQty === 'number' && parsedResData.alertQty > 0
        ? parsedResData.alertQty
        : null;
    const itemImage =      typeof parsedResData.itemImage === 'string' && parsedResData.itemImage.trim().length > 0
        ? parsedResData.itemImage
        : null;
    const remarks =
      typeof parsedResData.remarks === 'string' && parsedResData.remarks.trim().length > 0
        ? parsedResData.remarks
        : null;

    if (
      itemId
      && itemName
      && itemNickName
      && cat
      && subcat
      && subcat2
      && type
      && applyGroup
      && invType
      && unit
      && alertQty
    ) {
      // Read product data
      fs.readFile(`${data.config.dataPath}data.json`, (err, productData) => {
        if (!err) {
          const decodedProductData = decoder.write(productData);
          const parsedProductData = JSON.parse(decodedProductData);

          let flag = 0;

          parsedProductData.map((obj) => {
            const productObj = obj;

            if (productObj.itemId === itemId) {
              flag = 1;

              if (itemName) {
                productObj.itemName = itemName;
              }

              if (itemNickName) {
                productObj.itemNickName = itemNickName;
              }

              if (cat) {
                productObj.cat = cat;
              }

              if (subcat) {
                productObj.subcat = subcat;
              }

              if (subcat2) {
                productObj.subcat2 = subcat2;
              }

              if (type) {
                productObj.type = type;
              }

              if (applyGroup) {
                productObj.applyGroup = applyGroup;
              }

              if (invType) {
                productObj.invType = invType;
              }

              if (unit) {
                productObj.unit = unit;
              }

              if (alertQty) {
                productObj.alertQty = alertQty;
              }

              if (itemImage) {
                productObj.itemImage = itemImage;
              }

              if (remarks) {
                productObj.remarks = remarks;
              }

              return false;
            }
          });

          if (flag === 0) {
            callback(404, {
              message: 'No data found.',
            });
          } else {
            const strParsedProductData = JSON.stringify(parsedProductData);

            // Write updated product data
            fs.writeFile(`${data.config.dataPath}data.json`, strParsedProductData, (err2) => {
              if (!err2) {
                callback(200, {
                  message: 'User updated successfully.',
                });
              } else {
                callback(500, {
                  message: 'Internal server error.',
                });
              }
            });
          }
        }
      });
    } else {
      callback(400, {
        message: 'Invalid user request.',
      });
    }
  } else {
    callback(404, {
      message: 'Invalid user request',
    });
  }
};

// export module
module.exports = data;
