/*
 * Title: Environment variables
 * Description: Holds env variables
 * Author: Saud
 * Date: 08-30-2020
 */

// Dependencies

// Module scaffolding
const environments = {};

// Configuration
environments.config = {};

// Development env object
environments.development = {
  name: 'development',
  port: 3001,
  mysqlCredentials: {
    user: 'root',
    password: 'mysql',
    database: 'product',
  },
};

// Production env object
environments.production = {
  name: 'production',
  port: 5000,
  mysqlCredentials: {
    user: 'xxxx', // Real server's db user
    password: 'xxxx', // Real server's db password
    database: 'xxxx', // Real server's db name
  },
};

environments.executePortName =
  process.env.NODE_ENV === 'production' ? process.env.NODE_ENV : 'development';

environments.executePortNo =
  process.env.NODE_ENV === 'production'
    ? environments.production.port
    : environments.development.port;

// export module
module.exports = environments;
