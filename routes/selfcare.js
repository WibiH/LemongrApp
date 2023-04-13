'use strict';

const { Router } = require('express');

const Selfcare = require('../models/selfcare');

const router = new Router();

const routeGuard = require('./../middleware/route-guard');

router.get('/', routeGuard, (req, res, next) => {
  Selfcare.find()
    .then((selfcare) => {
      res.render('selfcare/selfcare', { selfcare });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/category', routeGuard, (req, res, next) => {
  const { category } = req.query;
  Selfcare.find({ category })
    .then((selfcare) => {
      res.render('selfcare/category', { selfcare, categoryParent: category });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
