/*
 * Title: Landing file
 * Description: The app lands here
 * Author: Saud
 * Date: 08-30-2020
 */

// Dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const environments = require('./helpers/environments');
const productDataFileHandler = require('./handlers/productDataFileHandler');
const productDatabaseHandler = require('./handlers/productDatabaseHandler');

// Module scaffolding
const app = {};

// Configuration
app.config = {};

app.createServer = () => {
  http
    .createServer((req, res) => {
      const decoder = new StringDecoder('utf-8');
      const parsedUrl = url.parse(req.url, true);

      let resData = '';

      req.on('data', (data) => {
        resData += decoder.write(data);
      });

      req.on('end', () => {
        resData += decoder.end();

        if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/all-products') {
          if (req.headers.source && req.headers.source === 'file') {
            // Read file data
            productDataFileHandler.readAllProductData(
              req.method.toUpperCase(),
              (statusCode, payload) => {
                res.writeHead(statusCode, { 'content-type': 'application/json' });

                const strPayload = JSON.stringify(payload);

                res.write(strPayload);
                res.end();
              },
            );
          } else if (req.headers.source && req.headers.source === 'db') {
            // Get database data
            productDatabaseHandler.getAllProductData(
              req.method.toUpperCase(),
              (statusCode, payload) => {
                res.writeHead(statusCode, { 'content-type': 'application/json' });

                const strPayload = JSON.stringify(payload);

                res.write(strPayload);
                res.end();
              },
            );
          } else {
            res.writeHead(400, { 'content-type': 'application/json' });

            const payload = {
              message: 'Invalid user request (headers).',
            };

            const strPayload = JSON.stringify(payload);

            res.write(strPayload);
            res.end();
          }
        } else if (parsedUrl.pathname === '/insert-product') {
          if (req.headers.source && req.headers.source === 'file') {
            // Write data into file
            productDataFileHandler.writeProductData(
              req.method.toUpperCase(),
              resData,
              (statusCode, payload) => {
                res.writeHead(statusCode, { 'content-type': 'Application/json' });

                const strPayload = JSON.stringify(payload);

                res.write(strPayload);
                res.end();
              },
            );
          } else if (req.headers.source && req.headers.source === 'db') {
            // Insert data into database
            productDatabaseHandler.insertProductData(
              req.method.toUpperCase(),
              resData,
              (statusCode, payload) => {
                res.writeHead(statusCode, { 'content-type': 'Application/json' });

                const strPayload = JSON.stringify(payload);

                res.write(strPayload);
                res.end();
              },
            );
          } else {
            res.writeHead(400, { 'content-type': 'application/json' });

            const payload = {
              message: 'Invalid user request (headers).',
            };

            const strPayload = JSON.stringify(payload);

            res.write(strPayload);
            res.end();
          }
        } else if (parsedUrl.pathname === '/view-product') {
          if (req.headers.source && req.headers.source === 'file') {
            // Read file data
            productDataFileHandler.readProductData(
              req.method.toUpperCase(),
              parsedUrl.query,
              (statusCode, payload) => {
                res.writeHead(statusCode, { 'content-type': 'Application/json' });

                const strPayload = JSON.stringify(payload);

                res.write(strPayload);
                res.end();
              }
            );
          } else if (req.headers.source && req.headers.source === 'db') {
            // Get database data
            productDatabaseHandler.getProductData(
              req.method.toUpperCase(),
              parsedUrl.query,
              (statusCode, payload) => {
                res.writeHead(statusCode, { 'content-type': 'Application/json' });

                const strPayload = JSON.stringify(payload);

                res.write(strPayload);
                res.end();
              }
            );
          } else {
            res.writeHead(400, { 'content-type': 'application/json' });

            const payload = {
              message: 'Invalid user request (headers).',
            };

            const strPayload = JSON.stringify(payload);

            res.write(strPayload);
            res.end();
          }
        } else if (parsedUrl.pathname === '/delete-product') {
          if (req.headers.source && req.headers.source === 'file') {
            // Delete file data
            productDataFileHandler.deleteProductData(
              req.method.toUpperCase(),
              parsedUrl.query,
              (statusCode, payload) => {
                res.writeHead(statusCode, { 'content-type': 'Application/json' });

                const strPayload = JSON.stringify(payload);

                res.write(strPayload);
                res.end();
              }
            );
          } else if (req.headers.source && req.headers.source === 'db') {
            // Delete database data
            productDatabaseHandler.deleteProductData(
              req.method.toUpperCase(),
              parsedUrl.query,
              (statusCode, payload) => {
                res.writeHead(statusCode, { 'content-type': 'Application/json' });

                const strPayload = JSON.stringify(payload);

                res.write(strPayload);
                res.end();
              }
            );
          } else {
            res.writeHead(400, { 'content-type': 'application/json' });

            const payload = {
              message: 'Invalid user request (headers).',
            };

            const strPayload = JSON.stringify(payload);

            res.write(strPayload);
            res.end();
          }
        } else if (parsedUrl.pathname === '/update-product') {
          if (req.headers.source && req.headers.source === 'file') {
            // Update file data
            productDataFileHandler.updateProductData(
              req.method.toUpperCase(),
              parsedUrl.query,
              resData,
              (statusCode, payload) => {
                res.writeHead(statusCode, { 'content-type': 'Application/json' });

                const strPayload = JSON.stringify(payload);

                res.write(strPayload);
                res.end();
              }
            );
          } else if (req.headers.source && req.headers.source === 'db') {
            // Update database data
            productDatabaseHandler.updateProductData(
              req.method.toUpperCase(),
              parsedUrl.query,
              resData,
              (statusCode, payload) => {
                res.writeHead(statusCode, { 'content-type': 'Application/json' });

                const strPayload = JSON.stringify(payload);

                res.write(strPayload);
                res.end();
              }
            );
          } else {
            res.writeHead(400, { 'content-type': 'application/json' });

            const payload = {
              message: 'Invalid user request (headers).',
            };

            const strPayload = JSON.stringify(payload);

            res.write(strPayload);
            res.end();
          }
        }
      });
    })
    .listen(environments.executePortNo, () => {
      console.log(
        `Server started at port ${environments.executePortNo} (${environments.executePortName})`,
      );
    });
};

app.createServer();

// export module
module.exports = app;
