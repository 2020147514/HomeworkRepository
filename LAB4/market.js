var albums;

fetch('product.json')
.then(response => {
    return response.json();})
.then(json => {
    albums = json;
    initialize();})
.catch(error => {
    console.log('Fetch problem: ' + error.message);});

function initialize() {
    var category = document.querySelector('#category');
    var searchTerm = document.querySelector('#searchTerm');
    var searchBtn = document.querySelector('#searchBtn');
    var searchedResult = document.querySelector('#searchedItems');
    var lastCategory = category.value;
    var lastSearch = '';
    var selectedGenreGroup;
    var finalGroup = albums;
    // var finalGroup = albums.slice(0,10);

    updateDisplay();

    selectedGenreGroup = [];
    finalGroup = [];
    searchBtn.onclick = selectCategory;

    function selectCategory(e) {
        e.preventDefault();
        selectedGenreGroup = [];
        finalGroup = [];

        if(category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
            return;
        } else {
            lastCategory = category.value;
            lastSearch = searchTerm.value.trim();
            if(category.value === 'All') {
                selectedGenreGroup = albums;
                selectAlbums();
            } else {
                var lowerCaseGenre = category.value.toLowerCase();
                for(var i = 0; i < albums.length ; i++) {
                    if(albums[i].genre === lowerCaseGenre) {
                        selectedGenreGroup.push(albums[i]);
                    }
                }
                selectAlbums();
            }
        }
    }

    function selectAlbums() {
        if(searchTerm.value.trim() === '') {
            finalGroup = selectedGenreGroup;
            updateDisplay();
        } else {
            var lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
            for(var i = 0; i < selectedGenreGroup.length ; i++) {
                var term = selectedGenreGroup[i].albumName.toLowerCase();
                if(term.indexOf(lowerCaseSearchTerm) !== -1) {
                    finalGroup.push(selectedGenreGroup[i]);
                }
            }
            updateDisplay();
        }
    }

    function updateDisplay() {
        // delete previous data
        while (searchedResult.firstChild) {
            searchedResult.removeChild(searchedResult.firstChild);
        }
        if(finalGroup.length === 0) {
            var par = document.createElement('p');
            par.setAttribute('id', 'message');
            par.textContent = 'No results';
            searchedResult.appendChild(par);
        } else {
            for(var i = 0; i < finalGroup.length; i++) {
                fetchBlob(finalGroup[i]);
            }
        }
    }
      
    function fetchBlob(album) {
        var url = '/img/' + album.coverImg;
        fetch(url).then(function(response) {
        if(response.ok) {
            response.blob().then(function(blob) {
            var objectURL = URL.createObjectURL(blob);
            showProduct(objectURL, album);
            });
        } else {
            console.log('Network request for "' + album.albumName + '" image failed with response ' + response.status + ': ' + response.statusText);
        }
        });
    }
        
    function showProduct(objectURL, album) {
        var section = document.createElement('section');
        var name = document.createElement('h2');
        var par = document.createElement('p');
        var image = document.createElement('img');
        var plusBtn = document.createElement('button');
        
        section.setAttribute('class', 'itemContainer');
        par.setAttribute('class', album.albumName);
        name.setAttribute('class', album.albumName);
        plusBtn.setAttribute('id', album.albumName);
        plusBtn.setAttribute('class', 'plusBtn');

        name.textContent = album.albumName.replace(album.albumName.charAt(0), album.albumName.charAt(0).toUpperCase());
        par.textContent = '$' + album.price.toFixed(2);
        image.src = objectURL;
        image.alt = album.albumName;
        plusBtn.textContent = "+";
    
        searchedResult.appendChild(section);
        section.appendChild(image);
        section.appendChild(name);
        section.appendChild(par);
        section.appendChild(plusBtn);
    }
    // const container = document.querySelector('#searchedItems');
    // window.addEventListener('scroll', ()=> {
    //     const {scrollHeight, scrollTop, clientHeight} = container.documentElement;
    //     if(scrollTop + clientHeight > scrollHeight-100) {
    //         setTimeout(createPost,1000);
    //     }
    // });
    // function createPost() {
    //     finalGroup = albums;
    //     updateDisplay();
    //     var section = document.createElement('section');
    //     var name = document.createElement('h2');
    //     var par = document.createElement('p');
    //     var image = document.createElement('img');
    //     var plusBtn = document.createElement('button');
        
    //     section.setAttribute('class', 'itemContainer');
    //     par.setAttribute('class', album.albumName);
    //     name.setAttribute('class', album.albumName);
    //     plusBtn.setAttribute('id', album.albumName);
    //     plusBtn.setAttribute('class', 'plusBtn');

    //     name.textContent = album.albumName.replace(album.albumName.charAt(0), album.albumName.charAt(0).toUpperCase());
    //     par.textContent = '$' + album.price.toFixed(2);
    //     image.src = objectURL;
    //     image.alt = album.albumName;
    //     plusBtn.textContent = "+";

    //     searchedResult.appendChild(section);
    //     section.appendChild(image);
    //     section.appendChild(name);
    //     section.appendChild(par);
    //     section.appendChild(plusBtn);
    // }
}

// let counter = 1;
// document.addEventListener('DOMContentLoaded', load);
// window.onscroll = () => {
//     if (window.innerHeight + window,scrollY >= document.body.offsetHeight) {
//         load();
//     }
// };

// function load() {
//     const start = counter;
//     const end = start + 1;
//     counter = end + 1;
//     fetch('product.json')
//     .then(response => response.json())
//     .then(posts => {
//         posts.forEach(add_post);
//     })
// };

// function add_post(comments) {
//     const post = document.createElement('div');
//     post.className = 'post';
//     post.innerHTML = comments.body;
//     document.querySelector('#posts').append(post);
// }
// function showDiv() {
//     var 
// }