document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "65718d4b6aa04f2e939b1b45d7cdbe2b";
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const recipeContainer = document.getElementById("recipeContainer");

    searchButton.addEventListener("click", function () {
        const query = searchInput.value.trim();
        if (query) {
            fetchRecipes(query);
        } else {
            alert("Please enter a recipe query");
        }
    });

    function fetchRecipes(query) {
        const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                displayRecipes(data.results);
            })
            .catch(error => {
                console.error("Error fetching recipes:", error);
            });
    }

    async function displayRecipes(recipes) {
        // Clear previous search results
        recipeContainer.innerHTML = "";

        for (const recipe of recipes) {
            try {
                const recipeInfo = await fetchRecipeInformation(recipe.id);
                if (recipeInfo) {
                    const recipeCard = document.createElement("div");
                    recipeCard.classList.add("recipe-card");

                    const recipeTitle = document.createElement("h2");
                    recipeTitle.textContent = recipe.title;
                    recipeTitle.style.fontWeight = "bold"; // Make the title bold

                    const recipeImage = document.createElement("img");
                    recipeImage.src = recipe.image;
                    recipeImage.alt = recipe.title;

                    const recipeDetails = document.createElement("div");
                    recipeDetails.classList.add("recipe-details");

                    // Display ingredients
                    const ingredientsTitle = document.createElement("h4");
                    ingredientsTitle.textContent = "Ingredients:";
                    recipeDetails.appendChild(ingredientsTitle);

                    const ingredientsList = document.createElement("ul");
                    for (const ingredient of recipeInfo.extendedIngredients) {
                        const ingredientItem = document.createElement("li");
                        ingredientItem.textContent = ingredient.original;
                        ingredientsList.appendChild(ingredientItem);
                    }
                    recipeDetails.appendChild(ingredientsList);

                    // Display cooking instructions
                    const instructionsTitle = document.createElement("h4");
                    instructionsTitle.textContent = "Instructions:";
                    recipeDetails.appendChild(instructionsTitle);

                    const instructionsText = document.createElement("p");
                    instructionsText.textContent = recipeInfo.instructions || "No instructions available";
                    recipeDetails.appendChild(instructionsText);

                    recipeCard.appendChild(recipeTitle);
                    recipeCard.appendChild(recipeImage);
                    recipeCard.appendChild(recipeDetails);

                    recipeContainer.appendChild(recipeCard);

                    // Add some spacing between recipe cards
                    recipeContainer.appendChild(document.createElement("hr"));
                    recipeContainer.appendChild(document.createElement("br"));

                    break; 
                }
            } catch (error) {
                console.error("Error fetching recipe information:", error);
            }
        }
    }

    async function fetchRecipeInformation(recipeId) {
        const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching recipe information:", error);
            return null;
        }
    }
});
