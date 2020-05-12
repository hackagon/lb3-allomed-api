'use strict';
const express = require('express');
const path = require('path');

module.exports = function (server) {
  var router = server.loopback.Router();

  const publicPath = path.join(__dirname + "/../../build");
  console.log("publicPath", publicPath)

  server.use(express.static(publicPath));
  console.log("run")

  router.get("/*", function (req, res, next) {
    const routerPath = req.path;
    if (routerPath.indexOf("api") === -1) {
      return res.sendFile(path.join(publicPath, "index.html"));
    }
    next()
  });

  server.use(router);
};
