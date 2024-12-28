const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// get meal list that matches with the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    let ingredients = searchInputTxt.split(' ');

    let fetchPromises = ingredients.map(ingredient => {
        return fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
            .then(response => response.json());
    });

    Promise.all(fetchPromises)
        .then(results => {
            let html = "";
            if (results.every(result => result.meals)) {
                let mealArrays = results.map(result => result.meals);
                let commonMeals = mealArrays.shift().filter(meal => {
                    return mealArrays.every(mealArray => mealArray.some(m => m.idMeal === meal.idMeal));
                });

                if (commonMeals.length) {
                    commonMeals.forEach(meal => {
                        html += `
                            <div class = "meal-item" data-id = "${meal.idMeal}">
                                <div class = "meal-img">
                                    <img src = "${meal.strMealThumb}" alt = "food">
                                </div>
                                <div class = "meal-name">
                                    <h3>${meal.strMeal}</h3>
                                    <a href = "#" class = "recipe-btn">Get Recipe</a>
                                </div>
                            </div>
                        `;
                    });
                    mealList.classList.remove('notFound');
                } else {
                    html = "Sorry, we didn't find any meal!";
                    mealList.classList.add('notFound');
                }
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }

            mealList.innerHTML = html;
        });
}

// get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

// create a modal
function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];

    // Extract ingredients and measurements
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
        }
    }

    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-ingredients">
            <h3>Ingredients:</h3>
            <ul>${ingredients}</ul>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}
