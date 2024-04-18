
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
  $('body').center()
  $('body').css('margin-top', '-390px');
  $('body').css('background-color', '#3d3d3d');
  $('body').css('color', 'white');
  $('body').css('text-shadow', `2px 2px black`);
  $('body').css('font-size', '20px');

  const $body = $('body');
  $body.html('');

  //Hold already displayed tweets
  const displayedTweets = {};

  //Function to add tweets
  function addNewTweets(){
    const $tweets = streams.home.filter(tweet => !displayedTweets[tweet.created_at])
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((tweet) => {
      const $tweet = $('<div class="tweet" style="border: 3px solid black;"></div>');
      const $username = $(`<span class="username">@${tweet.user}</span>`);
      const messageWithHashtags = tweet.message.replace(/#(\w+)/g, '<span class="hashtag" data-tag="$1">#$1</span>');
      const $message = $(`<span class="message">${messageWithHashtags}</span>`);
      const timestamp = new Date(tweet.created_at);
      const $timestamp = $(`<span class="timestamp" data-timestamp="${timestamp}">${moment(timestamp).fromNow()}</span>`);

      $tweet.append($username, ': ', $message, ' - ', $timestamp);


      displayedTweets[tweet.created_at] = true;
      $tweet.find('.hashtag').css('color', '#add8e6');
      $tweet.find('.timestamp').css('color', '#d3d3d3');

      return $tweet;
    });
    $body.prepend($tweets);
    return $tweets
  }
  addNewTweets()
  $('div').css('margin-top', '10px')
  //Fetch Tweets Button
  $($body).before('<button id="get-more-tweets-button"> Get More Tweets!')
  $('#get-more-tweets-button').on('click', function(){
    $body.prepend(addNewTweets())
  })
  //!Button Style!//
  $('button').center()
  $('button').css('margin-left', '66px')
  $('button').css('margin-top', '-407px')

  //Get Tweet History
  $body.on('click', '.username', function(){
    const username = $(this).text().replace(/^@/, '');
    userTweets(username)
  })

  //Create Tweet Form
  $('button').before('<form action="" method="get" class="tweet-form">')
  $('.tweet-form').append(`<div class='tweet-form-username'></div>`)
  $('.tweet-form-username').append(`<label for='username' class='username'><b>Username:</label>`)
  $('.tweet-form-username').append(`<input type='text' name='username' id='username' required />`)

  $('.tweet-form').append(`<div class='tweet-form-tweet'></div>`)
  $('.tweet-form-tweet').append(`<label for='tweet' class='tweet'><b>Speak Your Mind:</label>`)
  $('.tweet-form-tweet').append(`<input type='text' name='tweet' id='tweet' required />`)

  $('.tweet-form').append(`<div class='tweet-form-submit'></div>`)
  $('.tweet-form-submit').append(`<input type='submit' id='submit' />`)
  //!Form Style!//
  $('form').center()
  $('form').css('margin-left', '300px')
  $('form').css('margin-top', '-443px')
  $('form').css('border', '5px outset black')
  $('#username').css('margin-left', '25.5px')
  $('#submit').css('margin-left', '110px')
  $('#submit').css('margin-top', '5px')
  $('label.username').css('margin-left', '25.5px')
  $('label').css('text-shadow', `2px 2px black`)
  $('label').css('color', 'white');

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
    $body.empty();
    tweets.forEach(tweet => {
      const $tweet = $('<div class="tweet"></div>');
      const $username = $(`<span class="username">@${tweet.user}</span>`);
      const messageWithHashtags = tweet.message.replace(/#(\w+)/g, '<span class="hashtag" data-tag="$1">#$1</span>');
      const $message = $(`<span class="message">${messageWithHashtags}</span>`);
      const timestamp = new Date(tweet.created_at);
      const $timestamp = $(`<span class="timestamp" data-timestamp="${timestamp}">${moment(timestamp).fromNow()}</span>`);
      $tweet.append($username, ': ', $message, ' - ', $timestamp);
      $body.append($tweet);
    });
  }

  //Listen for Hashtag Clicks
  $body.on('click', '.hashtag', function() {
    const hashtag = $(this).text().replace(/^#/, '');
    const tweetsWithHashtag = streams.home.filter(tweet => tweet.message.includes(`#${hashtag}`));
    $body.empty()
  
    // Render tweets with the same hashtag
    hashtags(tweetsWithHashtag);
  });

  function userTweets(username){
    const userTweets = streams.users[username];
    $body.empty();

    userTweets.forEach(tweet => {
      const $tweet = $('<div></div>');
      const text = `@${tweet.user}: ${tweet.message} ${moment().startOf('second').fromNow()}`;
      $tweet.text(text);
      $body.append($tweet);
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
});
