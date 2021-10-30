/*
 * Title: Product Database Handler
 * Description: Take requests and response with data accordingly
 * Author: Saud
 * Date: 09-05-2020
 */

// Dependencies
const mysql = require('mysql');
const environments = require('../helpers/environments');

// Module scaffolding
const data = {};

// Configuration
data.config = {
  mysqlConn: mysql.createConnection({
    host: 'localhost',
    user: environments[environments.executePortName].mysqlCredentials.user,
    password: environments[environments.executePortName].mysqlCredentials.password,
    database: environments[environments.executePortName].mysqlCredentials.database,
  }),
};

// Connect MySQL database
let connFlag = false;

data.config.mysqlConn.connect((err) => {
  if (!err) {
    connFlag = true;
  }
});

// Get all product data
data.getAllProductData = (reqMethod, callback) => {
  if (reqMethod === 'GET') {
    if (connFlag) {
      // Get all product data
      const sql = 'SELECT * FROM items';

      data.config.mysqlConn.query(sql, (err2, result) => {
        if (!err2) {
          if (result.length === 0) {
            callback(404, {
              message: 'No data found.',
            });
          } else {
            callback(200, {
              message: 'success',
              productData: result,
            });
          }
        } else {
          callback(500, {
            message: err2,
          });
        }
      });
    } else {
      callback(500, {
        message: 'Internal server error.',
      });
    }
  } else {
    callback(400, {
      message: 'Invalid user request (method).',
    });
  }
};

// Get a product data
data.getProductData = (reqMethod, reqQuery, callback) => {
  if (reqMethod === 'GET') {
    const itemId =      typeof parseInt(reqQuery.itemId) === 'number' && parseInt(reqQuery.itemId) > 0
        ? parseInt(reqQuery.itemId)
        : null;

    if (itemId) {
      if (connFlag) {
        // Get all product data
        const sql = `SELECT * FROM items WHERE item_id = ${itemId}`;

        data.config.mysqlConn.query(sql, (err2, result) => {
          if (!err2) {
            if (result.length === 0) {
              callback(404, {
                message: 'No data found.',
              });
            } else {
              callback(200, {
                message: 'success',
                productData: result,
              });
            }
          } else {
            callback(500, {
              message: err2,
            });
          }
        });
      } else {
        callback(500, {
          message: 'Internal server error.',
        });
      }
    } else {
      callback(400, {
        message: 'Invalid user request.',
      });
    }
  } else {
    callback(400, {
      message: 'Invalid user request (method).',
    });
  }
};

// Insert a product data
data.insertProductData = (reqMethod, resData, callback) => {
  if (reqMethod === 'POST') {
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
    const itemCreated = Date.now();

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
      if (connFlag) {
        // Get all product data
        const sql = `INSERT INTO items (item_name, item_nickname, category, subcategory, subcategory_2, type, apply_group, inv_type, unit, alert_qty, item_image, remarks, item_created) VALUES('${itemName}', '${itemNickName}', ${cat}, ${subcat}, ${subcat2}, ${type}, ${applyGroup}, ${invType}, ${unit}, ${alertQty}, ${itemImage}, ${remarks}, ${itemCreated})`;

        data.config.mysqlConn.query(sql, (err2, result) => {
          if (!err2) {
            callback(200, {
              message: 'Product data added successfully.',
            });
          } else {
            callback(500, {
              message: err2,
            });
          }
        });
      } else {
        callback(500, {
          message: 'Internal server error.',
        });
      }
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
    const itemId =      typeof parseInt(reqQuery.itemId) === 'number' && parseInt(reqQuery.id) > 0
        ? parseInt(reqQuery.itemId)
        : null;

    if (itemId) {
      if (connFlag) {
        // Get all product data
        const sql = `DELETE FROM items WHERE item_id = ${itemId}`;

        data.config.mysqlConn.query(sql, (err2, result) => {
          if (!err2) {
            if (result.length === 0) {
              callback(404, {
                message: 'No data found.',
              });
            } else {
              callback(200, {
                message: 'Product data deleted successfully.',
              });
            }
          } else {
            callback(500, {
              message: err2,
            });
          }
        });
      } else {
        callback(500, {
          message: 'Internal server error.',
        });
      }
    } else {
      callback(400, {
        message: 'Invalid user request.',
      });
    }
  } else {
    callback(400, {
      message: 'Invalid user request (method).',
    });
  }
};

// Update a product data
data.updateProductData = (reqMethod, reqQuery, resData, callback) => {
  if (reqMethod === 'PUT') {
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
      if (connFlag) {
        // Get all product data
        let setClause = '';

        if (itemName) {
          setClause += `item_name = '${itemName}', `;
        }

        if (itemNickName) {
          setClause += `item_nickname = ${itemNickName}, `;
        }

        if (cat) {
          setClause += `category = ${cat}, `;
        }

        if (subcat) {
          setClause += `subcategory = '${subcat}'`;
        }

        if (subcat2) {
          setClause += `subcategory_2 = '${subcat2}'`;
        }

        if (type) {
          setClause += `type = '${type}'`;
        }

        if (applyGroup) {
          setClause += `apply_group = '${applyGroup}'`;
        }

        if (invType) {
          setClause += `inv_type = '${invType}'`;
        }

        if (unit) {
          setClause += `unit = '${unit}'`;
        }

        if (alertQty) {
          setClause += `alert_qty = '${alertQty}'`;
        }

        if (itemImage) {
          setClause += `item_image = '${itemImage}'`;
        }

        if (remarks) {
          setClause += `remarks = '${remarks}'`;
        }

        // Remobe last comma character from 'setClause' string
        const updSetClause = setClause.replace(/,\s*$/, '');

        const sql = `UPDATE items SET ${updSetClause} WHERE item_id = ${itemId}`;

        data.config.mysqlConn.query(sql, (err2, result) => {
          if (!err2) {
            if (result.length === 0) {
              callback(404, {
                message: 'No data found.',
              });
            } else {
              callback(200, {
                message: 'Product data updated successfully.',
              });
            }
          } else {
            callback(500, {
              message: err2,
            });
          }
        });
      } else {
        callback(500, {
          message: 'Internal server error.',
        });
      }
    } else {
      callback(400, {
        message: 'Invalid user request.',
      });
    }
  } else {
    callback(400, {
      message: 'Invalid user request (method).',
    });
  }
};

// export module
module.exports = data;
