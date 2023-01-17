/* API URL : 
 `https://en.wikipedia.org/w/api.php?action=query&
 list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`
*/
// selection des élément du DOM
const form = document.querySelector("form");
const input = document.querySelector("input");
const errorMsg = document.querySelector(".error-msg");
const resultsDisplay = document.querySelector(".results-display");
const loader = document.querySelector(".loader");

form.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();

  // on test què le cas d'une chaine de caractère vide
  if (input.value === "") {
    errorMsg.textContent = "Rentrez un mot-clé pour la recherche";
    errorMsg.style.color = "red";
    return;

  } else {
    errorMsg.textContent = "";

    // Afichage "loader" en attendant les resultats
    loader.style.display = "flex";

    // On va vider la <div> qui affiche les "cards" pour afficher 
    // une nouvelle recherche
    resultsDisplay.textContent = "";  

    // On apelle notre function qui va faire des recherche 
    // en fonction de la valeur saisit dans l'input
    wikiApiCall(input.value);  
  }
}

// Requête vers l'API
async function wikiApiCall(searchInput) {

  try {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?
      action=query&list=search&format=json&origin=*&
      srlimit=20&srsearch=${searchInput}`
    )

    // En cas d'erreur "fetch()", erreur 404
    if( !response.ok) {
      throw new Error(`${response.status}`);
    }

    const data = await response.json();

    // On va se creer des "cart" avec le resultat de la recherche
    createCards(data.query.search); 

  } catch(err) {
    errorMsg.textContent = `${err}`
    errorMsg.style.color = "red";
    loader.style.display = "none";
  }   
}

// function qui va réer des "cards" avec le resultat de la recherche
function createCards(data) {
  // On va gerer le faite si "aucun resultat" 
  if (!data.length) {
    errorMsg.textContent = "Wopsy, aucun résultat";
    errorMsg.style.color = "red";
    loader.style.display = "none";
    return;
  }

  // Pour chaque resultat trouvé, on va créer la "card"
  data.forEach(el => {
    const url = `https://en.wikipedia.org/?curid=${el.pageid}`;

    // Créatin d'un "card"=> un <div> avec des éléments enfents
    const card = document.createElement("div");
    card.className = "result-item";
    card.innerHTML = `
      <h3 class="result-title">
        <a href=${url} target="_blank">${el.title}</a>
      </h3>
      <a href=${url} class="result-link" target="_blank">${url}</a>
      <span class="result-snippet">${el.snippet}</span>
      <br>
    `;

    // L'affichage dans la <div class='result-display'>
    resultsDisplay.appendChild(card);
  });

  // Suppression du "loader" une fois les "cards" affichées
  loader.style.display = "none";
}
