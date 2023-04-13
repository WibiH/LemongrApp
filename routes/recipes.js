'use strict';

const { Router } = require('express');
const Favorite = require('../models/favorite');

const Recipe = require('../models/recipe');

const router = new Router();

const routeGuard = require('./../middleware/route-guard');

router.get('/', routeGuard, (req, res, next) => {
  Recipe.find()
    .then((recipes) => {
      res.render('recipes/recipes', { recipes });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/category', routeGuard, (req, res, next) => {
  let recipesFromDb;
  const { category } = req.query;
  console.log('THIS IS THE CATEGORY: ', category);
  Recipe.find({ category })
    .then((recipes) => {
      recipesFromDb = recipes;
      return Favorite.find({ user: req.user._id });
    })
    .then((favorites) => {
      console.log('FAVORITES: ', favorites);
      const jointFavorites = favorites.join(''); // map method

      console.log('JOINT FAVORITES: ', jointFavorites);
      const recipesToRender = recipesFromDb.map((recipe) => {
        if (jointFavorites.includes(recipe._id)) {
          return {
            _id: recipe._id,
            category: recipe.category,
            title: recipe.title,
            picture: recipe.picture,
            ingredients: recipe.ingredients,
            instruction: recipe.instruction,
            alkalinefood: recipe.alkalinefood,
            favorited: true
          };
        } else {
          return {
            _id: recipe._id,
            category: recipe.category,
            title: recipe.title,
            picture: recipe.picture,
            ingredients: recipe.ingredients,
            instruction: recipe.instruction,
            alkalinefood: recipe.alkalinefood,
            favorited: false
          };
        }
      });
      res.render('recipes/category', {
        recipesToRender,
        categoryParent: category
      });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/category/:id', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const userId = req.user._id;
  let userFav;
  Favorite.find({ user: userId, recipe: id })
    .then((userFavorite) => {
      console.log(userFavorite);
      userFav = userFavorite;
      return Recipe.findById(id);
    })
    .then((recipe) => {
      console.log(recipe);
      console.log(userFav);
      if (userFav.length === 0) {
        recipe.favorited = false;
      } else {
        recipe.favorited = true;
      }
      res.render('recipes/single-recipe', recipe);
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/search', routeGuard, (req, res, next) => {
  const { alkalinefood } = req.query;
  Recipe.find({ alkalinefood })
    .then((recipes) => {
      if (!alkalinefood || recipes.length === 0) {
        res.render('recipes/recipes', {
          noRecipes: true,
          error: 'This might not be alkaline !'
        });
      } else {
        res.render('recipes/search', {
          recipes,
          alkalinefoodParent: alkalinefood
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/food-list', routeGuard, (req, res, next) => {
  res.render('recipes/food-list');
});

module.exports = router;
