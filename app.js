

const pokemonNumber = 151;
const pokeList = document.querySelector(".list")
const modalContainer = document.querySelector(".modal-container")

const searchInput = document.querySelector("#search-input")
const numberFilter = document.querySelector("#number")
const nameFilter = document.querySelector("#name")
const errorMsg = document.querySelector("#error-message")

let pokemons = []

const pokedex = document.querySelector('#pokedex');  //pokemon list

//pokemon types
const bugbtn = document.querySelector("#bug")
const bug = "bug"
const dragonbtn = document.querySelector("#dragon")
const dragon = "dragon"
const electricbtn = document.querySelector("#electric")
const electric = "electric"
const fightbtn = document.querySelector("#fighting")
const fighting = "fighting"
const firebtn = document.querySelector("#fire")
const fire = "fire"
const flyingbtn = document.querySelector("#flying")
const flying = "flying"
const ghostbtn = document.querySelector("#ghost")
const ghost= "ghost"
const grassbtn = document.querySelector("#grass")
const grass = "grass"
const groundbtn = document.querySelector("#ground")
const ground = "ground"
const icebtn = document.querySelector("#ice")
const ice = "ice"
const normalbtn = document.querySelector("#normal")
const normal = "normal"
const poisonbtn = document.querySelector("#poison")
const poison = "poison"
const psychicbtn = document.querySelector("#psychic")
const psychic = "psychic"
const rockbtn = document.querySelector("#rock")
const rock = "rock"
const waterbtn = document.querySelector("#water")
const water = "water"


//fetching pokemons from the pokeAPI
const fetchPokemon = () => {
  const promises = [];
  for (let i = 1; i <= 151; i++) {
      const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
      promises.push(fetch(url).then((res) => res.json()));
  }
  Promise.all(promises).then((results) => {
      pokemons = results.map((result) => ({
          name: result.name,
          image: result.sprites.other['dream_world']['front_default'],
          type: result.types.map((type) => type.type.name).join(', '),
          id: result.id,
          height: result.height,
          weight: result.weight,
          attack: result.stats.find(stat => stat.stat.name ==='attack')?.base_stat,
          defense: result.stats.find(stat => stat.stat.name === 'defense')?.base_stat
      }));
      displayPokemon(pokemons);     //invoke funct to display all pokemons in array
  });
};

//layout for each pokemon displayed-the front

const displayPokemon = (pokemon) => {
    

    // Remove existing pokemon cards
    while (pokedex.firstChild) {
      pokedex.removeChild(pokedex.firstChild)
    }
  
    pokemon.forEach((poke) => {
      const card = document.createElement('li')
      card.className = "card"
      card.addEventListener("click", () => {
        selectPokemon(poke.id)
      })
  
      const image = document.createElement('img')
      image.className = "card-image"
      image.src = poke.image
  
      const title = document.createElement('h2')
      title.className = "card-title"
      title.textContent = `${poke.id}. ${poke.name}`
  
      card.appendChild(image)
      card.appendChild(title)
      
      

     pokedex.appendChild(card) 
    });
    
};


const selectPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const resp = await fetch(url)
    const poke = await resp.json()

    displayPokemonPopUp(poke)
}


//popup poke details

const displayPokemonPopUp = poke => {
    console.log(poke)
    const type = poke.types.map(type => type.type.name).join(", ")

    const popup = document.createElement("div")
    const closeBtn = document.createElement("button")
    const card = document.createElement("div")
    const image = document.createElement("img")
    const title = document.createElement("h2")
    const details = document.createElement("p")

    popup.className = "popup"
    closeBtn.id = "closeBtn"
    closeBtn.textContent = "close"
    closeBtn.addEventListener("click", closePopup)
    card.className = "card"
    image.className = "card-image"
    image.src = poke.sprites.other['dream_world']['front_default']
    title.className = "card-title"
    title.textContent = poke.name
    details.innerHTML = `<p>Type: ${type} </p>
                        <small>| Height: ${(poke.height)/10} m
                        | Weight: ${(poke.weight)/10}kg
                        | Attack: ${poke.stats[1].base_stat}
                        | Defense: ${poke.stats[2].base_stat}</small>`

    

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(details);
    popup.appendChild(closeBtn);
    popup.appendChild(card);
    pokedex.insertBefore(popup, pokedex.firstChild)
}

const closePopup = () => {
    const popup = document.querySelector(".popup")
    popup.parentElement.removeChild(popup)
}

    






fetchPokemon();



//search/filter pokemon 



function handleSearch() {
    const searchKey = searchInput.value.toLowerCase()
    let filteredPoke;

    if(numberFilter.checked) {
        filteredPoke = pokemons.filter((poke) => {
            const pokemonID = getPokemonID(poke)  //calling getPokemonID to retrieve the ID
            return pokemonID.startsWith(searchKey)
        })
    } else if (nameFilter.checked) {
        filteredPoke = pokemons.filter((poke) => {
            return poke.name.toLowerCase().startsWith(searchKey)
        })
    } else {
        filteredPoke = pokemons
    }

    displayPokemon(filteredPoke);

    //updates filtered keywords

    if (filteredPoke.length === 0) {
        errorMsg.style.display = "block"
    } else {
        errorMsg.style.display = "none"
    }

    //function used to get the ID of the pokemon
    function getPokemonID(pokemon) {
        if (pokemon.id) {
            return String(pokemon.id);
        } else {
            const urlID = pokemon.url.split("/");
            return urlID[urlID.length - 2];
        }
    }

    const searchButton = document.querySelector(".search-icon")
    searchButton.addEventListener("click", handleSearch)
}
    
//event listener for search input
    searchInput.addEventListener("keyup", handleSearch)

//event listener for clearing filter
    const closeButton = document.querySelector(".search-close-icon")
    closeButton.addEventListener("click", clearSearch)


    function clearSearch() {
        searchInput.value =""
        displayPokemon(pokemons)
        errorMsg.style.display = "none"
    }



//types button event listeners

bugbtn.addEventListener("click", () => typesPokemonFilter(bug))
dragonbtn.addEventListener("click", () => typesPokemonFilter(dragon))
electricbtn.addEventListener("click", () => typesPokemonFilter(electric))
fightbtn.addEventListener("click", () => typesPokemonFilter(fighting))
firebtn.addEventListener("click", () => typesPokemonFilter(fire))
flyingbtn.addEventListener("click", () => typesPokemonFilter(flying))
ghostbtn.addEventListener("click", () => typesPokemonFilter(ghost))
grassbtn.addEventListener("click", () => typesPokemonFilter(grass))
groundbtn.addEventListener("click", () => typesPokemonFilter(ground))
icebtn.addEventListener("click", () => typesPokemonFilter(ice))
normalbtn.addEventListener("click", () => typesPokemonFilter(normal))
poisonbtn.addEventListener("click", () => typesPokemonFilter(poison))
psychicbtn.addEventListener("click", () => typesPokemonFilter(psychic))
rockbtn.addEventListener("click", () => typesPokemonFilter(rock))
waterbtn.addEventListener("click", () => typesPokemonFilter(water))

//pokemon types filter

function typesPokemonFilter(types) {
    const filteredPokemon = pokemons.filter((poke) => {
        return poke.type.toLowerCase().includes(types)
    })
    displayPokemon(filteredPokemon)
}



// let pokemonsArray = []

// fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonNumber}`)
//     .then(resp => resp.json())
//     .then(data => {
//         pokemonsArray = data.results 
//         showPokemons(pokemonsArray)
//     })


    // async function fetchPokemonBefore(id) {
    //     try {
    //         const [pokemon, pokemonType] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    //         .then(resp => resp.json()),
    //         fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    //         .then(resp => resp.json()),
    //     ])
    //     return true
    //     } 
    //     catch (err) {
    //         console.error("Failed to fetch Pokemon data")
    //     }
    // }


    // function showPokemons(pokemon) {
    //     pokeList.innerHTML = ""

        
    //         pokemon.forEach((pokemon) => {
    //             const pokeID = pokemon.url.split("/")[6];
    //             const li_item = document.createElement("div");
    //             li_item.className = "list-item";
            
    //             const numberWrap = document.createElement("div");
    //             const numberCaption = document.createTextNode(`#${pokeID}`);
    //             numberWrap.className = "number-wrap";
    //             numberWrap.appendChild(numberCaption);
    //             li_item.appendChild(numberWrap);
            
    //             const imgWrap = document.createElement("div");
    //             const img = document.createElement("img");
    //             img.src = `https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokeID}.svg`;
    //             img.alt = pokemon.name;
    //             imgWrap.className = "img-wrap";
    //             imgWrap.appendChild(img);
    //             li_item.appendChild(imgWrap);
            
    //             const nameWrap = document.createElement("div");
    //             const nameCaption = document.createTextNode(`${pokemon.name}`);
    //             nameWrap.className = "name-wrap";
    //             nameWrap.appendChild(nameCaption);
    //             li_item.appendChild(nameWrap);
            
    //             pokeList.appendChild(li_item);


              
                
    //     })
    // }



    
    // searchInput.addEventListener("keyup", handleSearch);

    // function handleSearch() {
    //   const searchKey = searchInput.value.toLowerCase();
    //   let filteredPoke;
    
    //   if (numberFilter.checked) {
    //     filteredPoke = pokemonsArray.filter((pokemon) => {
    //       const pokeID = pokemon.url.split("/")[6];
    //       return pokeID.startsWith(searchKey);
    //     });
    //   } else if (nameFilter.checked) {
    //     filteredPoke = pokemonsArray.filter((pokemon) => {
    //       return pokemon.name.toLowerCase().startsWith(searchKey);
    //     });
    //   } else {
    //     filteredPoke = pokemonsArray;
    //   }
    
    //   showPokemons(filteredPoke);
    
    //   if (filteredPoke.length === 0) {
    //     errorMsg.style.display = "block";
    //   } else {
    //     errorMsg.style.display = "none";
    //   }

    //   const searchButton = document.querySelector(".search-icon")
    //   searchButton.addEventListener("click", handleSearch)
    // }


    // const closeButton = document.querySelector(".search-close-icon")
    // closeButton.addEventListener("click", clearSearch)

    // function clearSearch() {
    //     searchInput.value =""
    //     showPokemons(pokemonsArray)
    //     errorMsg.style.display = "none"
    // }