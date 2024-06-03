// is used for async functions
import { async } from 'regenerator-runtime/runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  // let recipe = data.data.recipe;
  // let {recipe} = data.data;
  const { recipe } = data.data;

  // creating a object
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image_url,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // key: recipe.key, but key may not exist in every case
    // Below line says that if key exists than only create a new field with key value. '&&' is used for short circuiting meaning that if recipe.key exists then proceed further otherwise don't do anything
    ...(recipe.key && { key: recipe.key }),
  };
};

// Making an async function and doing a API call
export const loadRecipe = async function (id) {
  // will get this id from 'controller.js'
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    // Array.some tests whether at least one element in the array passes the test implemented by the provided function. Returns true and false and doesn't modify the orignal array.
    // The below line states that if (bookmark.id === id) is true. It will do the thing given in the 'if' block.
    // The below line will make sure that if we go to another recipe and come back to it again, it will stay bookmarked.
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    console.log(state.recipe);
  } catch (err) {
    console.error(`${err}⚡⚡⚡`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // The below line will make sure that every time a query is searched it will display page 1.
    state.search.page = 1;
  } catch (err) {
    console.error(`${err}⚡⚡⚡`);
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // newQt = oldQt + newServings / oldServings
    ing.quantity = (ing.quantity + newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  // Convert object into string
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  // Convert string back into object
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  // [] -> converts to array
  // {} -> converts to object

  // Object.entries() -> Convert to array

  try {
    // Firstly we take the array of newRecipe than filter out for only ingredients by using 'filter' method. Then we use 'map' method to trim the white space and destructure around ','
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        // console.log(ingArr);

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use correct format.',
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
