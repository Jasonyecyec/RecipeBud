import { API_URL, API_KEY, ING_COUNT } from "./config.js";
import { getJSON, sendJSON } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
  },
  bookmarks: [],
  shoppingList: [],
  ingredientsCount: ING_COUNT,
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (recipeId) {
  try {
    const data = await getJSON(`${API_URL}/${recipeId}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    //if the current recipe object is in 'BOOKMARK ARRAY' set 'BOOKMARKED' to TRUE else FALSE
    if (state.bookmarks.some((bookmark) => bookmark.id === recipeId)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    //if the current recipe object is in 'SHOPPINGLIST ARRAY' set 'addedToList' to TRUE else FALSE
    state.recipe.addedToList = false;

    if (state.shoppingList.length > 0) {
      state.shoppingList.forEach((list) => {
        if (list.id === recipeId) {
          state.recipe.addedToList = true;
          return;
        }
      });
    }
  } catch (error) {
    throw error;
  }
};

export const controlIngredientCount = function (control) {
  if (control === "add") {
    state.ingredientsCount++;
  }

  if (control === "delete" && state.ingredientsCount > 6) {
    state.ingredientsCount--;
  }
};

export const loadSearchResults = async function (recipeName) {
  try {
    state.search.query = recipeName;

    const { data } = await getJSON(
      `${API_URL}?search=${recipeName}&key=${API_KEY}`
    );

    if (data.recipes.length === 0) throw new Error("data is empty");

    state.search.results = data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
      };
    });
  } catch (error) {
    throw error;
  }
};

export const updateServings = function (newServings) {
  //udpate the ingredients quantity
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  //udpate the servings
  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  //seting a key value pair to LOCAL STORAGE, key is 'bookmarks'; value is 'state.bookmarks' array
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

const persistShoppingList = function () {
  //seting a key value pair to LOCAL STORAGE, key is 'shoppingList'; value is 'state.shoppingList' array
  localStorage.setItem("shoppingList", JSON.stringify(state.shoppingList));
};

export const addShoppingList = function (recipe) {
  //Add shopping list

  state.shoppingList.push(recipe);

  //Mark current recipe as addedToList
  if (recipe.id === state.recipe.id) {
    state.recipe.addedToList = true;
  }

  persistShoppingList();
};

export const deleteShoppingList = function (id) {
  //delete shopping list
  const index = state.shoppingList.findIndex((el) => el.id === id);
  state.shoppingList.splice(index, 1);

  //Mark current recipe as NOT on added to list
  if (id === state.recipe.id) {
    state.recipe.addedToList = false;
  }

  persistShoppingList();
};

export const addBookmark = function (recipe) {
  //Add Bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  persistBookmark();
};

export const deleteBookmark = function (id) {
  //delete bookmark
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  persistBookmark();
};

const clearLocalStorage = function () {
  localStorage.clear("bookmarks");
  localStorage.clear("shoppingList");
};

const init = function () {
  //fetching item from localstorage on initialization
  const storage = localStorage.getItem("bookmarks");
  const storage2 = localStorage.getItem("shoppingList");

  //if has data, parse into array of objects then set to 'state.bookmarks'
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }

  if (storage2) {
    state.shoppingList = JSON.parse(storage2);
  }
};

const checkURL = function (url) {
  regexp =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (!regexp.test(url[1])) {
    return url;
  }
};

export const validateURL = function (data) {
  const invalidURL = Object.entries(data).slice(1, 3).filter(checkURL);

  return invalidURL;
};

export const validateUploadData = function (data) {
  //return empty input data
  const uploadData = Object.entries(data)
    .slice(0, 6)
    .filter((entry) => entry[1] === "")
    .map((entry) => entry[0]);

  return uploadData;
};

export const validateUploadIngredients = function (data) {
  //return wrong format ingredients
  const uploadIngredients = Object.entries(data)
    .filter((entry) => {
      return entry[0].startsWith("ing") && entry[1] !== "";
    })
    .filter((ing) => {
      const ingArr = ing[1].replaceAll(" ", "").split(",");

      if (ingArr.length !== 3) {
        return ing[0];
      }
    })
    .map((entry) => entry[0]);

  return uploadIngredients;
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => {
        return entry[0].startsWith("ing") && entry[1] !== "";
      })
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());

        if (ingArr.length !== 3) {
          throw "Wrong ingredient format!, Please use the correct format.";
        }

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

    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

init();
