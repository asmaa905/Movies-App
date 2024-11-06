$(document).ready(function(){
  /* start global variables */
  const api_key = 'a295c2fda0d44898d34830970fce7edc';
  const base_link ='https://api.themoviedb.org/3/movie';
  const search_link = 'https://api.themoviedb.org/3/search/movie';
  let trendingApi ='https://api.themoviedb.org/3/trending/movie';
  let rowData = $('#mainRow');
  let searchInput = $('#searchName');
  let searchCloseIcon = $('#searchIcon')
  const submitBtn =$("#submitBtn");
  const upBtn = $('#upBtn');
  const Loading = $(".loading");
  // alerts
  const nameAlert = $("#nameAlert");
  const emailAlert = $("#emailAlert");
  const ageAlert = $("#ageAlert");
  const phoneAlert = $("#phoneAlert");
  const passwordAlert = $("#passwordAlert");
  const repasswordAlert = $("#repasswordAlert");
  // inputs
  const nameInput = $("#nameInput");
  const ageInput = $("#ageInput");
  const emailInput = $("#emailInput");
  const phoneInput = $("#phoneInput");
  const passwordInput = $("#passwordInput");
  const repasswordInput = $("#repasswordInput");
  const passIcon = $("#showPass");
  let movieImg,
  movieDes,
  movieRealase,
  movieName,
  movieRate;
  /* end global variables */

  /* start handle design */
  // start loading
  $('.loading').fadeOut(2000,function(){
    $('body').css({'overflow':'auto'})
  })
  //end loading
  /* start events in sidebar */
  $('#barsBtn').click(function(){
    if($('#barsBtn i').hasClass('fa-align-justify')){
      $('#barsBtn i').removeClass('fa-align-justify');
      $('#barsBtn i').addClass('fa-close');
      $('.side-menu').animate({left: 0}, 500)
      for (let i = 0; i < 6; i++) {
        $(".side-menu .nav .nav-item").eq(i).animate({
            top: 0
        }, (i + 6) * 100)
    }
    } else {
      $('#barsBtn i').addClass('fa-align-justify');
      $('#barsBtn i').removeClass('fa-close');
      let navWidth = $('.side-menu .nav').innerWidth()
      $('.side-menu').animate({left: `-${navWidth}`}, 500);
      $('.side-menu .nav .nav-item').animate({top: '200px'}, 500)
    }
  })
  /* end events in sidebar */
  /* start events on up button*/
  $(window).scroll(function(){
    let scroll = $(window).scrollTop()
    if(scroll > 100) {
      upBtn.css({"visibility": "visible", "opacity": "1"});
    } else {
      upBtn.css({"visibility": "hidden", "opacity": "0"});
    }
  })
  upBtn.click(function(){
    $('body , html').animate({scrollTop: 0}, 1000);
  })
  /* end events on up button */
  /* end handle design */
  /* start handle show movies  */
  /* start get data  */
  $('.side-menu li a[href^="#"').click(async function(){
    let sec_name = $(this).attr('to');
    if(sec_name == 'contactUs') {
      let setOffset =$(`#${sec_name}`).offset().top;
      $('body , html').animate({scrollTop: setOffset}, 1000);
      closeSideNav();
    } else  if(sec_name) {
      // show filtered movies data
      Loading.fadeIn(2000)

     await getMovies(sec_name, false, null);
      closeSideNav();
    } 
  });
  /* get data api */
   function excuteGetApiData( api = base_link, filterBy ){
    let link = `${api}/${filterBy}?api_key=${api_key}&language=en-US&include_adult=false`
    const options = {
      method: 'GET',
    };
    return new Promise(async(resolve, reject) => {
        try {
            const response = await fetch(link, options);
            const data = await response.json();
            resolve(data);
            //show games
        }catch (error) {
            reject(errors);
            console.error(error);
        }
      });
  }
  async function getMovies(filterBy, search=false,search_word = null) {
    rowData.html("")
    searchInput.html("");
    // Loading.fadeIn(2000)

    try{
      if(search) {
      excutSearchApiData(search_link, search_word).then((data) => {
        displayData(data.results)
        Loading.fadeOut(300)
      })
    } else {
      if(filterBy =='trending') {
        excuteGetApiData(trendingApi,'day').then((data) => {
          displayData(data.results)
          Loading.fadeOut(300)
        })
      } else {
        excuteGetApiData(base_link,filterBy).then((data) => {
          displayData(data.results)
          Loading.fadeOut(300)
        })
      }
    }
    }catch {

    }
  }
  async function  displayData(data) {
      let container = '';
      let imgPath = 'https://image.tmdb.org/t/p/w500';
      for (let i = 0; i < data.length; i++) {
        getsingleMovieData(data[i],imgPath);
          container += `<div class="col-12 col-md-6 col-12 col-md-6 col-lg-4 pl-1 term animate__animated">
                  <div class="movie position-relative overflow-hidden rounded-2 cursor-pointer">
                    <div class="image" style="width:100%;height:100%">
                      <img class="w-100 h-100" src="${imgPath}/${movieImg}" alt="">
                    </div>
                    <div class="overlay overflow-hidden  text-white">
                      <h1 class="title text-center animate__animated">${data[i][movieName]}</h1>
                      <p class="desc animate__animated">${movieDes}</p>
                      <p class="date animate__animated"><span class="fst-normal">Release Date<span>
                            : ${movieRealase}</span></span></p>
                      <h3 class="rate animate__animated">${movieRate}
                          </h3>
                      <h3 class="rate-num animate__animated">${data[i].vote_average.toFixed(1)}</h3>
                    </div>
                  </div>

                </div>`;
      }
      rowData.html(container);
      // $('#mainRow div').addClass("animate__fadeIn");
      $('#mainRow .term').mouseenter(CardImageOnHoverIn);
      $('#mainRow .term').mouseleave(CardImageOnHoverOut);
  }
  /** start get search data */
  async  function excutSearchApiData( api = search_link, search_word){
    let link = `${api}?query=${search_word}&api_key=${api_key}&language=en-US&include_adult=false`
    const options = {
      method: 'GET',
    };
    return new Promise(async(resolve, reject) => {
        try {
            const response = await fetch(link, options);
            const data = await response.json();
            resolve(data);
            //show games
        }catch (error) {
            reject(errors);
            console.error(error);
        }
      });
  }
  /** end get search data */
  /* end get data  */
  /** end handle show movies  */
  /* start handle close button */
  function closeSideNav () {
    if($('#barsBtn i').hasClass('fa-close')){
      $('#barsBtn i').addClass('fa-align-justify');
      $('#barsBtn i').removeClass('fa-close');
      let navWidth = $('.side-menu .nav').innerWidth()
      $('.side-menu').animate({left: `-${navWidth}`}, 500);
      $('.side-menu .nav .nav-item').animate({top: '200px'}, 500)
    }
  }
  /* end handle close button */
  /** start handle single movie data */
  function getsingleMovieData(movie,imgPath)
{
    checkmovieImg(movie,imgPath);
    checkMovieName(movie);
    checkMovieDesc(movie);
    checkMovieDate(movie);
    checkMovieVote(movie);
  }
  function checkmovieImg(movie,imgPath)
  {
      if(movie.poster_path == null && movie.backdrop_path == null)
      {
          movieImg = `images/default-movie.jpg`;
      }
      else if(movie.poster_path == null)
      {
          movieImg = `${imgPath+movie.backdrop_path}`;
      }
      else if(movie.hasOwnProperty('poster_path'))
      {
          movieImg = `${imgPath+movie.poster_path}`;
      }
  }
  function checkMovieName(movie)
  {
      if(movie.hasOwnProperty('title')) {
          movieName = `title`;
      }
      else if(movie.hasOwnProperty('name')) {
              movieTitle = `name`;
      }
  } 
  function checkMovieDesc(movie)
  {
      if(movie.overview.length > 300)
      {
          movieDes = `${movie.overview.slice(0,300)}...`;
      }
      else
      {
          movieDes = `${movie.overview}`;
      }
  }
  function checkMovieDate(movie)
  {
      if(movie.hasOwnProperty('release_date'))
      {
          movieRealase = `${movie.release_date}`;
      }
      else if(movie.hasOwnProperty('first_air_date'))
      {
        movieRealase = `${movie.first_air_date}`;
      }
      else
      {
        movieRealase = "Release Date UnKnown";
      }
  }
  function checkMovieVote(movie)
  {
      if(movie.vote_average < 1)
      {
          movieRate = `<i class="fa-solid fa-star text-muted fs-6"></i>`;
      }
      else if(movie.vote_average < 2)
      {
          let term = '';
          movieRate = term + `<i class="fa-regular fa-star-half-stroke text-warning fs-6"></i>`;
      }
      else if(movie.vote_average < 3)
      {
        movieRate =  `<i class="fa-solid fa-star text-warning fs-6"></i>`;
      }
      else if(movie.vote_average <4)
      {
          let term = '';
          for (let i = 0; i < 1; i++) {
          term += `<i class="fa-solid fa-star text-warning fs-6"></i>`;
          }
          movieRate = term + `<i class="fa-regular fa-star-half-stroke text-warning fs-6"></i>`;
      }
      else if(movie.vote_average <5)
      {
          let term = '';
          for (let i = 0; i < 2; i++) {
          term += `<i class="fa-solid fa-star text-warning fs-6"></i>`;
          }
          movieRate = term;
      }
      else if(movie.vote_average <6)
      {
          let term = '';
          for (let i = 0; i < 2; i++) {
          term += `<i class="fa-solid fa-star text-warning fs-6"></i>`;
          }
          movieRate = term + `<i class="fa-regular fa-star-half-stroke text-warning fs-6"></i>`;
      }
      else if(movie.vote_average < 7)
      {
          let term = '';
          for (let i = 0; i < 3; i++) {
          term += `<i class="fa-solid fa-star text-warning fs-6"></i>`;
          }
          movieRate = term;
      }
      else if(movie.vote_average < 8)
      {
          let term = '';
          for (let i = 0; i < 3; i++) {
          term += `<i class="fa-solid fa-star text-warning fs-6"></i>`;
          }
          movieRate = term + `<i class="fa-regular fa-star-half-stroke text-warning fs-6"></i>`;
      }
      else if(movie.vote_average < 9)
      {
          let term = '';
          for (let i = 0; i < 4; i++) {
          term += `<i class="fa-solid fa-star text-warning fs-6"></i>`;
          }
          movieRate = term;
      }
      else if(movie.vote_average < 10)
      {
          let term = '';
          for (let i = 0; i < 4; i++) {
          term += `<i class="fa-solid fa-star text-warning fs-6"></i>`;
          }
          movieRate = term + `<i class="fa-regular fa-star-half-stroke text-warning fs-6"></i>`;
      }
      else
      {
          let term = '';
          for (let i = 0; i < 5; i++) {
              term += `<i class="fa-solid fa-star text-warning fs-6"></i>`;
          }
          movieRate = term;
      }
  }
  /** end handle single movie data */
  /** start event lisener */
  searchInput.on("input", e => {
    getMovies(null,true,e.target.value);
    if(e.target.value == "")
    {
      getMovies('now_playing', false, null)
        searchCloseIcon.removeClass('d-block');
        searchCloseIcon.addClass('d-none');
    } else {
      searchCloseIcon.addClass('d-block');
      searchCloseIcon.removeClass('d-none');

    }
  });
  searchCloseIcon.click(function(){
    searchInput.val('');
    getMovies('now_playing', false, null);
    searchCloseIcon.addClass('d-none');
    searchCloseIcon.removeClass('d-block');
  })
  /** start cardimage animate on hover */
   function CardImageOnHoverIn()
    {
      $(this).find($('.overlay')).css({"opacity":"1","visibility":"visible"});;
        $(this).find($('.image img')).addClass("animate")
  }
  function CardImageOnHoverOut()
  {
    $(this).find($('.overlay')).css({"opacity":"0","visibility":"hidden"});
    $(this).find($('.image img')).removeClass("animate");
}
  /** end cardimage animate on hover */
  /** show and hide password */
 // Show the eye icon if there's any input in the password field
   if (passwordInput.val() !== '') {
      passIcon.removeClass('d-none').addClass('d-block');
    }

    // Toggle show/hide password on icon click
    passIcon.click(function() {
      if (passwordInput.attr('type') === 'password') {
        // Change input type to text and icon to eye
        passwordInput.attr('type', 'text');
        passIcon.removeClass('fa-eye-slash').addClass('fa-eye');
      } else {
        // Change input type back to password and icon to eye-slash
        passwordInput.attr('type', 'password');
        passIcon.removeClass('fa-eye').addClass('fa-eye-slash');
      }
    });
  /** end event listener */
  /** start validations */
let insideNameInput = false;
let insideEmailInput = false;
let insidePhoneInput = false;
let insideAgeInput = false;
let insidePasswordInput = false;
let insideRepasswordInput = false;
function inputsValidation() {
 if (insideNameInput) {
     if (nameValidation()) {
         nameAlert.removeClass("d-block")
         nameAlert.addClass("d-none")
     } else {
       nameAlert.addClass("d-block")
       nameAlert.removeClass("d-none")

     }
 }
 if (insideEmailInput) {
     if (emailValidation()) {
       emailAlert.removeClass("d-block")
       emailAlert.addClass("d-none")

     } else {
       emailAlert.addClass("d-block")
       emailAlert.removeClass("d-none")
     }
 }
 if (insidePhoneInput) {
     if (phoneValidation()) {
      phoneAlert.removeClass("d-block")
      phoneAlert.addClass("d-none")

     } else {
      phoneAlert.addClass("d-block")
      phoneAlert.removeClass("d-none")
     }
 }
 if (insideAgeInput) {
     if (ageValidation()) {
       ageAlert.removeClass("d-block")
       ageAlert.addClass("d-none")

     } else {
       ageAlert.addClass("d-block")
       ageAlert.removeClass("d-none")
     }
 }
 if (insidePasswordInput) {
     if (passwordValidation()) {
       passwordAlert.removeClass("d-block")
       passwordAlert.addClass("d-none")

     } else {
       passwordAlert.addClass("d-block")
       passwordAlert.removeClass("d-none")
     }
 }
 if (insideRepasswordInput) {
     if (repasswordValidation()) {
       repasswordAlert.removeClass("d-block")
       repasswordAlert.addClass("d-none")

     } else {
       repasswordAlert.addClass("d-block")
       repasswordAlert.removeClass("d-none")
     }
 }


 if (nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()) {
      submitBtn.css({"color": "#fff",  "background-color":"black"});
      submitBtn.removeAttribute("disabled");
    } else {
      submitBtn.css({"color": "#000",  "background-color":"rgb(220, 53, 69)"});
      let moveRight = true;
      submitBtn.on("mouseover", function () {
      if (moveRight) {
        submitBtn.css({"transform":"translateX(300px)"});
      } else {
        submitBtn.css({"transform":"translateX(0)"});
      }
      moveRight = !moveRight;
    });
  }
}

    /**start validate event listener */
    nameInput.on("keyup",  inputsValidation);
    ageInput.on("keyup", inputsValidation);
    emailInput.on("keyup",inputsValidation);
    phoneInput.on("keyup", inputsValidation);
    passwordInput.on("keyup", inputsValidation);
    repasswordInput.on("keyup", inputsValidation);

      /**end validate event listener */
    nameInput.on("focus", () => {
        insideNameInput = true
    })

    emailInput.on("focus", () => {
        insideEmailInput = true
    })

    phoneInput.on("focus", () => {
        insidePhoneInput = true
    })

    ageInput.on("focus", () => {
        insideAgeInput = true
    })

    passwordInput.on("focus", () => {
        insidePasswordInput = true
    })

     repasswordInput.on("focus", () => {
        insideRepasswordInput = true
    })

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(nameInput.val()))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInput.val()))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phoneInput.val()))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(ageInput.val()))
}

function passwordValidation() {
    return (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(passwordInput.val()))
}

function repasswordValidation() {
    return repasswordInput.val() == passwordInput.val()
}
  /** end validations */
  /* excute self invoking functions */
  getMovies('now_playing', false, null);
  
  })
  



