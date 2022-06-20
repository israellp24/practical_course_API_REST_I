
//Data

const api = axios.create({
    baseURL: `https://api.themoviedb.org/3/`,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params:{
        'api_key': API_KEY,
    },
});

function likedMoviesList(){

    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if(item){
        movies = item;
    }else{
        movies = {};
    }

    return movies;
}

function likeMovie(movie){
    // movie.id
    const likedMovies = likedMoviesList();

    console.log(likedMovies)

    if(likedMovies[movie.id]){
        likedMovies[movie.id] = undefined;
        //removerla de localstorage
    }else{
        likedMovies[movie.id] = movie;
        //agregar la peli a ls
    }

    localStorage.setItem('liked_movies',JSON.stringify(likedMovies));

    getLikedMovies();
}

//Utils
const callback = (entries)=> {
    entries.forEach((entry) => {
        //console.log({entry})
        if (entry.isIntersecting){
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src',url)
        }
        
    });
}

const lazyLoader = new IntersectionObserver(callback);

const createMovies = (
    movies,
    container,
    {
        lazyLoad = false,
        clean = true,
    } = {}
    )=>{

    if(clean){
        container.innerHTML= '';
    }

    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute(
            lazyLoad? 'data-img':'src',
            `https://image.tmdb.org/t/p/w300${movie.poster_path}`);
        
        movieImg.addEventListener('click',()=>{
            location.hash = `#movie=${movie.id}`
        });

        movieImg.addEventListener('error',()=>{
            movieImg.classList.add('inactive');
            movieContainer.classList.remove('movie-container');
            movieContainer.classList.add('movie-container--error');
            const textImgError = document.createElement('p');
            textImgError.innerHTML = movieImg.getAttribute('alt');
            movieContainer.appendChild(textImgError);
        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.toggle('movie-btn--liked');
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
        });
    
        if(lazyLoad){
            lazyLoader.observe(movieImg);
        }
        
        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
        container.appendChild(movieContainer);
    });

}

const createCategories = (categories,container)=>{

    container.innerHTML="";
    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categorTitle = document.createElement('h3');
        categorTitle.classList.add('category-title');
        categorTitle.setAttribute('id', `id${category.id}`);
        categorTitle.addEventListener('click', ()=>{
            location.hash=`category=${category.id}-${category.name}`
        });
        const categoryTitleText = document.createTextNode(category.name);

        categorTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categorTitle);
        container.appendChild(categoryContainer);
    });
}

//Llamados a la API

const getTrendingMoviesPreview = async () => {
    const {data} = await api(`trending/movie/day`);

    const movies = data.results;

    createMovies(movies,trendingMoviesPreviewList,true);

}

const getMoviesByCategory = async (id) => {
    const {data} = await api(`discover/movie`,{
        params: {
            with_genres:id,
        }
    });

    const movies = data.results;
    maxPage  = data.total_pages;

    console.log(maxPage)

    createMovies(movies,genericSection,{ lazyLoad:true });

}

const getPaginatedMoviesByCategory = (id)=> {
    return async function(){
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
    
       const scrollIsBottom =  (scrollTop + clientHeight) >= (scrollHeight-15);
    
       const pageIsNotMax = page<=maxPage;
    
        if(scrollIsBottom && pageIsNotMax){
            page++;
            const {data} = await api(`discover/movie`,{
                params: {
                    with_genres:id,
                    page
                }
            });
        
            const movies = data.results;
            
            createMovies(
                movies,
                genericSection,
                { lazyLoad:true, clean:false }
            );
        }
    }
}

const getMoviesBySearch= async (query) => {
    const {data} = await api(`search/movie`,{
        params: {
            query,
        }
    });

    const movies = data.results;
    maxPage  = data.total_pages;

    console.log(maxPage)

    createMovies(movies,genericSection);

}

const getPaginatedMoviesBySearch = (query)=> {
    return async function(){
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
    
       const scrollIsBottom =  (scrollTop + clientHeight) >= (scrollHeight-15);
    
       const pageIsNotMax = page<=maxPage;
    
        if(scrollIsBottom && pageIsNotMax){
            page++;
            const {data} = await api(`search/movie`,{
                params: {
                    query,
                    page
                }
            });
        
            const movies = data.results;
            
            createMovies(
                movies,
                genericSection,
                { lazyLoad:true, clean:false }
            );
        }
    }
}

const getCategoriesPreview = async () => {
    const {data} = await api(`genre/movie/list`);

    const categories = data.genres;

    createCategories(categories,categoriesPreviewList);

}

const getPaginatedTrendingMovies = async ()=> {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

   const scrollIsBottom =  (scrollTop + clientHeight) >= (scrollHeight-15);

   const pageIsNotMax = page<=maxPage

    if(scrollIsBottom && pageIsNotMax){
        page++;
        const {data} = await api(`trending/movie/day`, {
            params: {
                page,
            },
        });
    
        const movies = data.results;

        createMovies(
            movies,
            genericSection,
            { lazyLoad:true, clean:false }
        );
    }

    /*
    const btnLoadMore = document.createElement('button');
    btnLoadMore.innerHTML = 'Cargar mas';
    btnLoadMore.addEventListener('click',getPaginatedTrendingMovies)
    genericSection.appendChild(btnLoadMore);
    */
}



const getTrendingMovies = async () => {
    const {data} = await api(`trending/movie/day`);

    const movies = data.results;
    maxPage  = data.total_pages;

    createMovies(
        movies,
        genericSection,
        { lazyLoad:true, clean:true }
    );

    /*
    const btnLoadMore = document.createElement('button');
    btnLoadMore.innerHTML = 'Cargar mas';
    btnLoadMore.addEventListener('click',getPaginatedTrendingMovies)
    genericSection.appendChild(btnLoadMore);
    */
}


const getMovieById = async (id) => {
    const {data:movie} = await api(`movie/${id}`);

    const movieImgUrl =  `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    headerSection.style.background = `
        linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.35) 19.27%,
            rgba(0, 0, 0, 0) 29.17%
        ),
        url(${movieImgUrl})
    `;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres,movieDetailCategoriesList);

    getRelatedMoviesId(id);
}

const getRelatedMoviesId = async (id)=>{
    const {data} = await api (`movie/${id}/recommendations`);

    const relatedMovies = data.results;

    createMovies(relatedMovies,relatedMoviesContainer);
}

const getLikedMovies = () => {
    const likedMovies = likedMoviesList();
    
    const moviesArray = Object.values(likedMovies);

    createMovies(moviesArray,likedMoviesListArticle,{lazyLoad: true,clean: true,});

    console.log(moviesArray);

}