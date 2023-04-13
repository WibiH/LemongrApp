'use strict';

const express = require('express');
const Favorite = require('./../models/favorite');
const routeGuardMiddleware = require('./../middleware/route-guard');
const Recipe = require('./../models/recipe');
const User = require('./../models/user');

const favoriteRouter = express.Router();

favoriteRouter.get('/', routeGuardMiddleware, (req, res, next) => {
  Favorite.find({ user: req.user._id })
    .populate('recipe')
    .then((favorites) => {
      console.log('favorites', { favorites });
      const newFavorite = favorites.map((element) => {
        element.recipe.favorited = true;
        return element;
      });
      res.render('favorites/favorite', { favorites });
    })
    .catch((error) => {
      console.log(error);
      res.redirect('/recipes');
    });
});

favoriteRouter.post(
  '/:recipeId/unfavorite',
  routeGuardMiddleware,
  (req, res, next) => {
    const { recipeId } = req.params;
    const { category } = req.query;
    Favorite.findOneAndDelete({
      user: req.user._id,
      recipe: recipeId
    })
      .then(() => {
        res.redirect(`/recipes/category?category=${category}`); // maybe change redirection
      })
      .catch((error) => {
        next(error);
      });
  }
);

favoriteRouter.post('/:recipeId/', routeGuardMiddleware, (req, res, next) => {
  const { recipeId } = req.params;
  const { category } = req.query;
  console.log(category, recipeId);
  Favorite.findOne({
    user: req.user._id,
    recipe: recipeId
  })
    .then((favorite) => {
      console.log('FAVORITE: ', favorite);
      if (favorite) {
        const error = new Error(
          "You've already added a Favorite to this recipe!"
        );
        throw error;
      } else {
        return Favorite.create({
          user: req.user._id,
          recipe: recipeId
        });
      }
    })
    .then(() => {
      res.redirect(`/recipes/category?category=${category}`);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = favoriteRouter;
