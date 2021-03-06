(function(module) {
  const signup = {};

  // Event listener setup for using the sign up form. Called from toHtml in
  signup.startSignup = function() {
    $('#signup-form button').on('click', event => {
      event.preventDefault();
      const data = {};
      data.username = $('#signupUsername').val();
      data.password = $('#signupPassword').val();
      data.confirm = $('#confirm').val();
      signup.sendData(data);
    });
  };

  signup.sendData = function(data) {
    if(!data.username) {
      $('#notification-bar').text('Username Required');
    } else
    if (!data.password) {
      $('#notification-bar').text('Password Required');
    } else
    if (!data.confirm) {
      $('#notification-bar').text('Please confirm your password');
    } else
    if(data.password != data.confirm) {
      $('#notification-bar').text('Password and Confirmation must match');
    } else {
      superagent
      .post('/api/signup')
      .send(JSON.stringify(data))
      .then( result => {
        const data = JSON.parse(result.text);
        if(data.error) {
          $('#notification-bar').attr('class','alert');
          $('#notification-bar').text('Error: ' + data.error);
        }
        else {
          $('#notification-bar').removeClass('alert');
          $('#notification-bar').empty();

          Cookies.set('token',data.token, { expires: 7 });
          Cookies.set('id',data.payload.id, { expires: 7 });
          Cookies.set('username',data.payload.username, { expires: 7 });
          login.userOptions(data.token);
          series.renderLandingPage();
        }
      })
      .catch( err => {
        console.log('error in signup request',err);
      });
    }
  };

  module.signup = signup;
})(window);
