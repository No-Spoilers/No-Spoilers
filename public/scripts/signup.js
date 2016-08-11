(function(module) {
  const signup = {};

  signup.showForm = function() {
    $('#signup-link,#signup-button').on('click', function(event) {
      event.preventDefault();
      $('#signup-form').show();
      $('#login-form').hide();
      // $('#user-options').hide();
    });
  };

  signup.startSignup = function() {
    $('#signup-form button').on('click', event => {
      event.preventDefault();
      signup.userData();
    });
  };

  signup.userData = function() {
    const data = {};
    data.username = $('#signupUsername').val();
    data.password = $('#signupPassword').val();
    data.confirm = $('#confirm').val();
    signup.sendData(data);
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
        .then(result => {
          let token = JSON.parse(result.text);
          Cookies.set('token',token.token, { expires: 7 });
          Cookies.set('username',data.username, { expires: 7 });
          document.location.href = '/';
        });
    }
  };

  signup.showForm();
  signup.startSignup();

  module.signup = signup;

})(window);
