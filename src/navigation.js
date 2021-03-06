
//utils
function smoothscroll(){
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
         window.requestAnimationFrame(smoothscroll);
         window.scrollTo (0,currentScroll - (currentScroll/5));
    }
};

//functionPage

const trendsPage = ()=>{
    console.log('Trends!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML="Tendencias";
    getTrendingMovies();
    page = 1
    //console.log(`inicio de pagina en trendsPage ${page}`)
    infiniteScroll = getPaginatedTrendingMovies;
}

const searchPage = ()=>{
    console.log('Search!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_,query] = location.hash.split('=');

    getMoviesBySearch(query);
    page = 1
    //console.log(`inicio de pagina en SearchPage ${page}`)
    infiniteScroll = getPaginatedMoviesBySearch(query);
}

const movieDetailsPage = ()=>{
    console.log('Movie!!');

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_,movieId] = location.hash.split('=');

    getMovieById(movieId);

}

const categoryPage = ()=>{
    console.log('Category!!');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_,categoryData] = location.hash.split('=');
    const [categoryId,categoryName]=categoryData.split('-');
    headerCategoryTitle.innerHTML=categoryName;
    getMoviesByCategory(categoryId);

    page = 1
    //console.log(`inicio de pagina en category ${page}`)
    infiniteScroll = getPaginatedMoviesByCategory(categoryId);

}

const homePage = ()=>{
    console.log('Home!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}

const  navigator = () =>{
    //console.log({location});

    if(infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll,{passive:false});
        infiniteScroll= undefined;
    }

    if (location.hash.startsWith('#trends')){
       trendsPage();
    }else if(location.hash.startsWith('#search=')){
        searchPage();
    }else if(location.hash.startsWith('#movie=')){
        movieDetailsPage();
    }else if(location.hash.startsWith('#category=')){
        categoryPage();
    }else{
        homePage();
    }

    //document.documentElement.scrollTop=0;
    smoothscroll();

    if(infiniteScroll){
        window.addEventListener('scroll', infiniteScroll,{passive:false});
    }
}

searchFormBtn.addEventListener('click',(e)=>{
    
    searchFormInput.value !== "" 
    ? 
        location.hash = `#search=${searchFormInput.value}`
    :
        e.preventDefault();
});

trendingBtn.addEventListener('click',()=>{
    location.hash = '#trends';
});

arrowBtn.addEventListener('click',()=>{
    history.back();
    //location.hash = '#home';
});


let maxPage;
let page = 1;
let infiniteScroll;
window.addEventListener('DOMContentLoaded',navigator,false);
window.addEventListener('hashchange',navigator,false);
window.addEventListener('scroll', infiniteScroll, false);