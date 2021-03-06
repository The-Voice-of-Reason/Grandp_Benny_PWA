var about_btn       = document.querySelector('#info_icon');
var about_modal     = document.querySelector('#about_modal');
var close_modal_btn = document.querySelector('#close_modal_btn');
var home_btn        = document.querySelector('#home_icon');

var mySwiper         = null;
var storyObj         = null;
var language         = null;
var audioElement     = null;
var audio_is_playing = false;

//config.json holds the langunage
//selection parameter.
////////////////////////////
fetch("./json/config.json")
  .then(function(res){
    return (res.json());
  })
  .then(function(data) {
    language = data.language;
    get_story_json(language);  
  })

//Get the story_xx.json, load its 
//contents, modify the app's ltr-rtl
//settings.
//////////////////////////////////
function get_story_json(language){

  var json_name = null;
  
  if (language == "en"){
    json_name = "./json/story_en.json";
  } else if (language == "heb"){

    json_name = "./json/story_heb.json";
    
    document.querySelector('#html_tag').lang="heb";
    document.querySelector('#html_tag').dir ="rtl";
    document.querySelector('#swiper_container').dir ="rtl";    
  }

  //We init the swiper element only after changing the
  //index.html file to the required direction, else
  //the carousel won't work.
  mySwiper = new Swiper('.swiper-container'); 
  init_tap_action();
  
  fetch(json_name)
  .then(function(res){
    return (res.json());
  })
  .then(function(data) {
    storyObj = data;
    load_pages();        
  })  
}

//Insert the story data into the carousel items.
////////////////////////////////////////////////
function load_pages(){  

  document.querySelector('#title').innerHTML = storyObj.story.title;

  ///
  var num_of_pages = storyObj.story.pages.length;

  //check orientation.
  
  //load slides with proper images.


  for (var i=0;i<num_of_pages;i++){
    var img_src = storyObj.story.pages[i].image_url;
  }


  //

  var num_of_pages = storyObj.story.number_of_pages;

  for (var i=0;i<num_of_pages;i++){

    var img_src = storyObj.story.pages[i].image_url;
    var img_alt = storyObj.story.pages[i].image_alt;
    var text    = storyObj.story.pages[i].text;

    var str = '<div class="content_area">';
    str += '<img src="' + img_src + '" alt="' + img_alt + '">';    
    str += '<div class="content"><div class="story_text">' + text + '</div></div></div>';    
    
    mySwiper.appendSlide('<div class="swiper-slide">' + str + '</div>');
  }

  document.querySelector('#about_title').innerHTML         = storyObj.story.about.title;
  document.querySelector('#about_description').innerHTML   = storyObj.story.about.description;
  document.querySelector('#about_credits_title').innerHTML = storyObj.story.about.credits_title;
  document.querySelector('#about_credits_text').innerHTML  = storyObj.story.about.credits_text;

  //Init the audio element, and add a listener to detect
  //when the mp3 finished playing => move to next slide.
  audioElement = new Audio(storyObj.story.pages[0].audio);  
  audioElement.addEventListener('ended', function(){     
    mySwiper.slideNext();
  });

  //When the user changed the slide, we pause the audio
  //(if playing), than load the new audio file for the new 
  //slide. 
  mySwiper.on('slideChange', function(){
    //If audio of the previous page is still playing - pause it.
      if (!audioElement.paused) {
        audioElement.pause();
      }
    
      audioElement = new Audio(storyObj.story.pages[mySwiper.activeIndex].audio);
      //need to re-add the event listener, for some reason...
      audioElement.addEventListener('ended', function(){     
        mySwiper.slideNext();
      });
    
    //If the audio was playing in the previous page, we assume
    //the user wants to auto-play this page's audio as well.
      if (audio_is_playing) {
        audioElement.play();
      }
    });  
}

//Activate the modal message (the 'about' page)
////////////////////////////////////////////////
about_btn.addEventListener('click', function(){
  about_modal.classList.add('is-active');
})

//Close the modal message.
//////////////////////////////////////////////////////
close_modal_btn.addEventListener('click', function(){
  about_modal.classList.remove('is-active');
})

//Return to the first slide.
//////////////////////////////////////////////////////
home_btn.addEventListener('click', function(){
  mySwiper.slideTo(0);
  audioElement.pause();
})

//Handle tapping on the slides.
///////////////////////////
function init_tap_action(){ 
  mySwiper.on('tap', function (e) { 
    if (e.type!=='mouseup'){ //handle bug in chrmoe dev tools that creates an additional mouse event.

      if (audioElement.paused) {      
        audioElement.play();
        audio_is_playing = true;

      } else {
        audioElement.pause();
        audio_is_playing = false;
      }
    }    
  });
}



