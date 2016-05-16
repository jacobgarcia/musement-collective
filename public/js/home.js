// Momentlist data array for filling in info box
var momentListData = [];
var user_id, user_username, user_image;

//================================== DOM READY ===============================
$(document).ready(function() {
  // Populate the moments wall on initial page load

  var momentList = window.location.pathname + '/momentList'

  populateWall(momentList);
});

//================================== FUNCTIONS ===============================

// Fill wall with data
function populateWall(momentlist) {
  // Empty content string
  var wallContent = '';
  /* Ipsos Counter */
  var ipsos = 0;

  /* Temporal computation for speed purposes */
  var timelapse = 0;

  $.getJSON("/api/user_data", function(user) {
      // Make sure the data contains the username as expected before using it
      user_id = user.user_id;
      user_image = user.user_image;
      user_username = user.user_username;

      // jQuery AJAX call for JSON
      $.getJSON(momentlist, function(data) {
        // For each item in our JSON, add an 'article.moment'
        $.each(data, function() {
          /* Replace undefined hearts with zeroes */
          if(this.heart == null)
            this.heart = 0;

          var usersHeart = this.usersHeart;
          var specifiedClass = "icon-heart_white";

          /* Class depending if it was clickable or not */
         for(var i in usersHeart){
              var id = usersHeart[i];
              if(id == user_id)
                specifiedClass = "icon-heart_red";
          }

          wallContent += '<article class="moment">';
          wallContent += '<div class="has">';
          wallContent += '<div class="heart" onClick="addHref(\''+ this._id +'\')">';


          wallContent += '<div id=' + this._id + "c" + ' class=' + specifiedClass + '></div>';

          wallContent += '<div id=' + this._id + ' class="heart-number">' + this.heart + '</div></div>';
          wallContent += '<img src="/' + this.user.image + '" alt=""/>';
          wallContent += '<div class="text_has">';
          wallContent += '<a href="/profile/' + this.user._id + '">' + this.user.username+ '</a>';
          wallContent += ' <span class="transparent"> tuvo un </span>';
          wallContent += ' momento <span class="transparent"> de </span>' ;

          timelapse = Math.floor(this.timelapse/30);
          ipsos += timelapse;
          wallContent += timelapse;
          wallContent += ' ipsos</div></div>'
          wallContent += '<div class="right_moment">';

          if(this.attachement != ''){
            wallContent += '<div class="tipe_moment image">';
            wallContent += '<img src="/' + this.attachement[0] + '".jpg alt=""/>';
          }

          wallContent += '<div class="tipe_moment text"><span class="icon-Comillas-10"></span>' + this.description + '</div>';

          /* Comment Section */
          if (this.feedback != '') {
            for(var feed in this.feedback){
              wallContent += '<div class="area_comment"><div class="comment"><div class="who_title"><img src="'+ this.feedback[feed].user.image+'">';
              wallContent += this.feedback[feed].user.username;
              wallContent += '</div><div class="comment_text">' + this.feedback[feed].comment +'</div></div></div>';
            }
          }
          wallContent += '<div id=' + this._id + 'DIV></div>'
          wallContent += '<input id=' + this._id + 'F class="easy" type="text" name="comment_post" value="" placeholder="Escribe un comentario"></div></article>';

          wallContent += '<button type="button" onClick=postComment(\''+ this._id +'\')>Aportar</button>';
          // Inject the whole content string into our existing HTML section
          $('#wall').html(wallContent);

          var path = momentlist.split("/");

          // If we are in profile
          if(path[1] === 'profile'){
            if(Object.keys(data).length === 0)
                $('#momentsQuantity').html("Es hora de idear. ¡Inicia un nuevo momento!");
            else{
              $('#momentsQuantity').html(Object.keys(data).length + " momentos logrados");
              $('#ipsos').html(ipsos + ' ipsos');
            }
          }

          //================================== CHANGE COLOR HEART ===============================
          $(".icon-heart_white").click(function(){
          /*  $(this).removeClass("icon-heart_white");
            $(this).addClass("icon-heart_red");*/
          });
        });
      });
  });
};

/* POST COMMENT CLICK */
function postComment(momentId){
  var comment = $("#" + momentId + "F").val();
  $.post('home/feed/' + momentId, {comment: comment});

  /* Add a fake POST (for ajax refresh)*/
  $("#" + momentId + "DIV").append(
  '<div class="area_comment"><div class="comment"><div class="who_title"><img src="'
  +  user_image +'">'
  + user_username
  + '</div><div class="comment_text">'
  + comment
  + '</div></div></div>');

  /* Clean Input Field */
  $("#" + momentId + "F").val('');
}

/* HEART CLICK */
function addHref(clickedID){
  if($("#" + clickedID + "c").prop('className') == "icon-heart_white"){
    $.post('home/vote/' + clickedID, function(){

    });
    $("#" + clickedID).html(parseInt($("#" + clickedID).html()) + 1);

    $("#" + clickedID + "c").removeClass("icon-heart_white");
    $("#" + clickedID + "c").addClass("icon-heart_red");
  }
}
