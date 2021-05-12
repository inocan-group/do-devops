/* eslint-disable unicorn/prefer-module */

// Jest is able to run fully automatically but sometimes having a file
// is helpful for more advanced scenarios. This file basically acts the
// same as the auto-configuration and you can refer to the docs if you
// need some advanced magic: https://wallabyjs.com/docs/intro/config.html#configuration-file
module.exports = () => ({
  wallaby: {
    autoDetect: true,
  },
});
