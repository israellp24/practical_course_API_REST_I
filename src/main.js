const getTrendingMoviesPreview = async () => {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);

    const data = await res.json();

    const movies = data.results;

    movies.forEach(movie => {
        const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList')

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300${movie.poster_path}`);
        
        movieContainer.appendChild(movieImg);
        trendingPreviewMoviesContainer.appendChild(movieContainer);
    });

}

const getCategoriesPreview = async () => {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);

    const data = await res.json();

    const categories = data.genres;

    categories.forEach(category => {
        const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list')

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categorTitle = document.createElement('h3');
        categorTitle.classList.add('category-title');
        categorTitle.setAttribute('id', `id${category.id}`);

        const categoryTitleText = document.createTextNode(category.name);

        categorTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categorTitle);
        previewCategoriesContainer.appendChild(categoryContainer);
    });

}

getTrendingMoviesPreview();
getCategoriesPreview();