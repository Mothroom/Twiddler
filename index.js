
$(document).ready(() => {
  const $body = $('body');
  $body.html('');

  //Hold already displayed tweets
  const displayedTweets = {};

  //Function to add tweets
  function addNewTweets(){
    const $tweets = streams.home.filter(tweet => !displayedTweets[tweet.created_at])
    .map((tweet) => {
      const $tweet = $('<div></div>');
      const $username = $(`<span class="username">@${tweet.user}</span>`);
      const text = `: ${tweet.message} ${tweet.relative}`;

      $tweet.append($username, text);

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
    const userTweets = streams.users[username];
    $body.empty();

    userTweets.forEach(tweet => {
      const $tweet = $('<div></div>');
      const text = `@${tweet.user}: ${tweet.message} ${tweet.relative}`;
      $tweet.text(text);
      $body.append($tweet);
    });
  })

  //Create User Tweet Form
  $('button').before('<form action="" method="get" class="tweet-form">')

});
