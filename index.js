
$(document).ready(() => {
  const $body = $('body');
  $body.html('');

  //Hold already displayed tweets
  const displayedTweets = {};

  //Function to add tweets
  function addNewTweets(){
    const $tweets = streams.home.filter(tweet => !displayedTweets[tweet.created_at])
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((tweet) => {
      const $tweet = $('<div></div>');
      const $username = $(`<span class="username">@${tweet.user}</span>`);
      const $message = $(`<span class="message">${tweet.message}</span>`);
      const timestamp = new Date(tweet.created_at);
      const $timestamp = $(`<span class="timestamp" data-timestamp="${timestamp}">${moment(timestamp).fromNow()}</span>`);

      $tweet.append($username, ': ', $message, ' - ', $timestamp);


      displayedTweets[tweet.created_at] = true;

      return $tweet;
    });
    $body.prepend($tweets);
    return $tweets
  }
  addNewTweets()

  //Fetch Tweets Button
  $($body).before('<button id="get-more-tweets-button"> Get More Tweets!')
  $('#get-more-tweets-button').on('click', function(){
    $body.prepend(addNewTweets())
  })

  //Get Tweet History
  $body.on('click', '.username', function(){
    const username = $(this).text().replace(/^@/, '');
    userTweets(username)
  })

  //Create User Tweet Form
  $('button').before('<form action="" method="get" class="tweet-form">')
  $('.tweet-form').append(`<div class='tweet-form-username'></div>`)
  $('.tweet-form-username').append(`<label for='username'>Username:</label>`)
  $('.tweet-form-username').append(`<input type='text' name='username' id='username' required />`)

  $('.tweet-form').append(`<div class='tweet-form-tweet'></div>`)
  $('.tweet-form-tweet').append(`<label for='tweet'>Speak Your Mind:</label>`)
  $('.tweet-form-tweet').append(`<input type='text' name='tweet' id='tweet' required />`)

  $('.tweet-form').append(`<div class='tweet-form-submit'></div>`)
  $('.tweet-form-submit').append(`<input type='submit' />`)

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

  function updateRelativeTimestamps() {
    $('.timestamp').each(function() {
      const $timestamp = $(this);
      const timestamp = new Date($timestamp.data('timestamp'));
      const relativeTime = moment(timestamp).fromNow();
      $timestamp.text(relativeTime);
    });
  }
  
  // Call the function initially to update existing timestamps
  updateRelativeTimestamps();
  
  // Set interval to update timestamps every minute (or as frequently as desired)
  setInterval(updateRelativeTimestamps, 30000);
});
