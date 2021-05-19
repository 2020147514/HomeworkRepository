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

    firstUpdate();
    document.getElementById('searchedItems').addEventListener("scroll", loadMore);

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
                if(searchTerm.value.trim() === '') {
                    firstUpdate();
                    document.getElementById('searchedItems').addEventListener("scroll", loadMore);
                } else {
                    selectAlbums();
                }
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

    function firstUpdate() {
        while (searchedResult.firstChild) {
            searchedResult.removeChild(searchedResult.firstChild);
        }
        finalGroup = albums.slice(0,8);
        for(var i = 0; i < finalGroup.length; i++) {
            fetchBlob(finalGroup[i]);
        }
    }

    function loadMore() {
        var displayGroup = albums.slice(8);
        var container = document.getElementById('searchedItems');
        var scrollHeight = container.offsetHeight;
        var scrollTop = container.scrollTop;
        var clientHeight = window.innerHeight;
        if(scrollTop + clientHeight > scrollHeight-5) {
            for(var i = 0; i < displayGroup.length; i++) {
                fetchBlob(displayGroup[i]);
            }
            document.getElementById('searchedItems').removeEventListener("scroll",loadMore);
        }
    }

    function updateDisplay() {
        // delete previous data
        while (searchedResult.firstChild) {
            searchedResult.removeChild(searchedResult.firstChild);
        }
        if(finalGroup.length === 0) {
            var par = document.createElement('h4');
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
}