
$(document).ready(() => {
  //function to push element to middle
  jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
    $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
    $(window).scrollLeft()) + "px");
    return this;
  }

  //!Body Style!//
  $('body').css('position', 'absolute');
  $('body').css('left', '37%');
  $('body').css('background-color', '#3d3d3d');
  $('body').css('color', 'white');
  $('body').css('text-shadow', `2px 2px black`);
  $('body').css('font-size', '20px');
  $('body').css('width', '30%');

  const $body = $('body');
  $body.html('');

  //Hold already displayed tweets
  const displayedTweets = {};
  $body.append('<div class="tweet-container"></div>')

  //Footer
  $body.after(`<footer class='footer'>`)
  $('.footer').css('background-color', 'black')
  $('.footer').css('height', '125px')


  //Function to add tweets
  function addNewTweets(){
    const $tweets = streams.home.filter(tweet => !displayedTweets[tweet.created_at])
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((tweet) => {
      const $tweet = $('<div class="tweet" style="border: 4px solid black; border-radius: 10px; margin-top: 10px; background-color: #292929"></div>');
      const $username = $(`<span class="username">@${tweet.user}</span>`);
      const messageWithHashtags = tweet.message.replace(/#(\w+)/g, '<span class="hashtag" data-tag="$1" style="color: #add8e6">#$1</span>');
      const $message = $(`<span class="message" >${messageWithHashtags}</span>`);
      const timestamp = new Date(tweet.created_at);
      const $timestamp = $(`<span class="timestamp" data-timestamp="${timestamp}" style="color: #d3d3d3">${moment(timestamp).fromNow()}</span>`);

      
      $tweet.append($username, ': ', $message, ' - ', $timestamp);
      displayedTweets[tweet.created_at] = true;
      return $tweet;
    });
    $('.tweet-container').prepend($tweets);
    return $tweets;
  }
  addNewTweets();

  //Fetch Tweets Button
  $($body).prepend('<div class="button"></div>');
  $('.button').prepend('<button id="get-more-tweets-button"> Get More Tweets!');
  $('#get-more-tweets-button').on('click', function(){
    $('.tweet-container').prepend(addNewTweets());
  });
  //!Button Style!//
  $('button').css('border-radius', '15px');

  //Get Tweet History
  $body.on('click', '.username', function(){
    const username = $(this).text().replace(/^@/, '');
    userTweets(username);
  })

  //Create Tweet Form
  $($body).prepend('<div class="form"></div>');
  $('.form').prepend('<form action="" method="get" class="tweet-form">');
  $('.tweet-form').append(`<div class='tweet-form-username'></div>`);
  $('.tweet-form-username').append(`<label for='username' class='username'><b>Username:</label>`);
  $('.tweet-form-username').append(`<input type='text' name='username' id='username' required />`);

  $('.tweet-form').append(`<div class='tweet-form-tweet'></div>`);
  $('.tweet-form-tweet').append(`<label for='tweet' class='tweet'><b>Speak Your Mind:</label>`);
  $('.tweet-form-tweet').append(`<input type='text' name='tweet' id='tweet' required />`);

  $('.tweet-form').append(`<div class='tweet-form-submit'></div>`);
  $('.tweet-form-submit').append(`<input type='submit' id='submit' />`);
  //!Form Style!//
  $('form').css('border', '5px outset black');
  $('form').css('border-radius', '15px');
  $('form').css('background-color', '#292929');
  $('#username').css('margin-left', '40px');
  $('#username').css('width', '450px');
  $('#tweet').css('width', '450px');
  $('#submit').css('margin-left', '320px');
  $('#submit').css('margin-top', '5px');
  $('label.username').css('margin-left', '25.5px');
  $('label').css('text-shadow', `2px 2px black`);
  $('label').css('color', 'white');

  //Twiddler Header
  $($body).prepend('<div class="header"></div>');
  $('.header').prepend('<header id="page-name">TWIDDLER</header>');
  $('#page-name').append('<img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Eastern_Bluebird.jpg" height ="100px" width="150px" style="margin-top: -17px" />');
  $('#page-name').css('color', '#1DA1F2');
  $('#page-name').css('font', '100px Helvetica');
  $('header').css('border', '5px solid #1DA1F2');

  //Listen for the submit
  $('.tweet-form').on('submit', function(event){
    event.preventDefault();
    const username = $('#username').val();
    const message = $('#tweet').val();
    visitor = username;

    if(!streams.users[username]){
      streams.users[username] = [];
    }
    writeTweet(message);
    addNewTweets();

    $('#username').val('');
    $('#tweet').val('');
  })

// Function to show tweets with the same hashtag
  function hashtags(tweets) {
    $('.tweet-container').empty();
    tweets.forEach(tweet => {
      const $tweet = $('<div class="tweet" style="border: 4px solid black; border-radius: 10px; margin-top: 10px; background-color: #292929"></div>');
      const $username = $(`<span class="username">@${tweet.user}</span>`);
      const messageWithHashtags = tweet.message.replace(/#(\w+)/g, '<span class="hashtag" data-tag="$1" style="color: #add8e6">#$1</span>');
      const $message = $(`<span class="message">${messageWithHashtags}</span>`);
      const timestamp = new Date(tweet.created_at);
      const $timestamp = $(`<span class="timestamp" data-timestamp="${timestamp}" style="color: #d3d3d3">${moment(timestamp).fromNow()}</span>`);
      $tweet.append($username, ': ', $message, ' - ', $timestamp);
      $('.tweet-container').prepend($tweet);
    });
  }

  //Listen for Hashtag Clicks
  $body.on('click', '.hashtag', function() {
    const hashtag = $(this).text().replace(/^#/, '');
    const tweetsWithHashtag = streams.home.filter(tweet => tweet.message.includes(`#${hashtag}`));
    $('.tweet-container').empty()

    // Render tweets with the same hashtag
    hashtags(tweetsWithHashtag);
  });

  //Function to see one users tweets
  function userTweets(username){
    const userTweets = streams.users[username];
    $('.tweet-container').empty();
    userTweets.forEach(tweet => {
      const $tweet = $('<div class="tweet" style="border: 4px solid black; border-radius: 10px; margin-top: 10px; background-color: #292929"></div>');
      const $username = $(`<span class="username">@${tweet.user}</span>`);
      const messageWithHashtags = tweet.message.replace(/#(\w+)/g, '<span class="hashtag" data-tag="$1" style="color: #add8e6">#$1</span>');
      const $message = $(`<span class="message">${messageWithHashtags}</span>`);
      const timestamp = new Date(tweet.created_at);
      const $timestamp = $(`<span class="timestamp" data-timestamp="${timestamp}" style="color: #d3d3d3">${moment(timestamp).fromNow()}</span>`);

      $tweet.append($username, ': ', $message, ' - ', $timestamp);
      $('.tweet-container').prepend($tweet);
    })
  }

  //Dynamically update timestamps
  function updateTimestamps() {
    $('.timestamp').each(function() {
      const $timestamp = $(this);
      const timestamp = new Date($timestamp.data('timestamp'));
      const relativeTime = moment(timestamp).fromNow();
      $timestamp.text(relativeTime);
    });
  }

  updateTimestamps();
  setInterval(updateTimestamps, 30000);

  //Mouse pointer
  $('span.username').hover(function() {
    $(this).css('cursor','pointer');
  });
  $('.hashtag').hover(function() {
    $(this).css('cursor','pointer');
  });
});
