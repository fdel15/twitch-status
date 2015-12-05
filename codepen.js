/*
****************
variables
****************
*/

var users = ["brunofin","freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff"]
var default_img = "https://cdn0.vox-cdn.com/images/verge/default-avatar.v9899025.gif"
var search_box;
var User = function(name) {
  this.name = name;
}


/*
****************
document ready
****************
*/

$(document).ready(function(){
  getUsers(users)

  $("#search").on("keyup", function(){
    search_box = $(this).val();
    search(search_box);
  });

  $("#all").on("click", function(){
    $(".btn.btn-default.active").removeClass('active');
    $(event.target).addClass('active')
    $('.user').show();
  });

  $("#online").on("click", function(){
    filterUsers("online")
  });

  $("#offline").on("click", function(){
    filterUsers("offline")
  });

  $("#find").on("click", function(){
    findUser();
  })
})


/*
****************
api functions
****************
*/

function getUsers(users) {
  users.forEach(function(user){
    user = new User(user)
    $.when(getUserStream(user)).done(function(status){
      getUserChannel(user)
      })
  });
}

function getUserStream(user) {
    var d1 = $.Deferred();
   $.getJSON("https://api.twitch.tv/kraken/streams/" + user.name, function(data) {
      user.stream = data.stream;
      user.channel = data._links.channel;
      d1.resolve()
    }).fail(function() {
      closedAccount(user);
  });
  return d1.promise();
}

function getUserChannel(user) {
  $.getJSON(user.channel, function(data) {
      user.icon = data.logo || default_img;
      user.url = data.url;
      displayUser(user);
  });
}

/*
****************
displaying users
****************
*/
function displayUser(user) {
  if(user.stream){
    user.desc = user.stream.channel.status
    onlineUser(user);
  } else {
    offlineUser(user);
  }
}

function onlineUser(user) {
  $(".list").append(
    "<div class='user'>" +
      "<img class='icon' src='" + user.icon + "'/>" +
      "<p class='name'>" + user.name + "</p>" +
      "<a href='" + user.url + "' target='_blank'><p class='status glyphicon glyphicon-ok'></p></a>" +
      "<p class='description'>" + user.desc + "</p>" +
    "</div>"
  )
}

function offlineUser(user) {
  $(".list").append(
    "<div class='user'>" +
      "<img class='icon' src='" + user.icon + "'/>" +
      "<p class='name'>" + user.name + "</p>" +
      "<a href='" + user.url + "' target='_blank'><p class='status glyphicon glyphicon-off'></p></a>" +
    "</div>"
  )
}

function closedAccount(user) {
  $(".list").append(
    "<div class='user'>" +
      "<img class='icon' src='https://pbs.twimg.com/profile_images/2346983495/image.jpg'/>" +
      "<p class='name'>" + user.name + "</p>" +
      "<p class='status glyphicon glyphicon-remove'></p>" +
      "<p class='description'>Account has been closed</p>" +
    "</div>");
}

/*
****************
button functionality
****************
*/

function search(search_box) {
  var length = search_box.length
  if(length === 0){$ (".user").show(); return; }
  $(".user").hide();
  $(".user").each(function(){
    var name = $(this).text().toLowerCase();
    search_box = search_box.toLowerCase();
    if (name.match(search_box)) { $(this).show() }
  })
}

function filterUsers(filter) {
  var status, icon;

  $(".btn.btn-default.active").removeClass('active');
  $(event.target).addClass('active');
  $('.user').hide();

  if (filter === "online") {
    status = "glyphicon-ok"
  } else {
    status = "glyphicon-off"
  }

  $('.user a p').each(function(){
      if( $(this).hasClass(status)) {
        $(this).closest('.user').show();
      }
    })
  }

function findUser() {
    var name;
    var user = $("#search").val().toLowerCase();

    $('.user .name').each(function(){
      name = $(this).text().toLowerCase()
      if(name === user ) { return false; }
      name = null;
    })
    if (name) { return; }
    getUsers([user]);
}

/*
original working solution. Wanted to try to refactor the second $get into a method

function getUserStream(user) {
    user = new User(user)
   $.getJSON("https://api.twitch.tv/krakn/streams/" + user.name, function(data) {
      user.stream = data.stream;
      user.channel = data._links.channel;
    }).done(function(data){
      $.getJSON(user.channel, function(data) {
      user.icon = data.logo || default_img;
      user.url = data.url;
      }).done(function(data){
        displayUser(user)
      });
   });
}
*/
