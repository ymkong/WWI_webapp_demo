$(document).ready(function() {
    var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
    $('#myloginbtn').click(function(e) {
      	e.preventDefault();
      	// lock.showSignin({
      	//     callbackURL: AUTH0_CALLBACK_URL
      	// });
      	lock.show({
        	callbackURL: AUTH0_CALLBACK_URL,
      		responseType: 'code',
			    authParams: {
        		scope: 'openid profile'
      		}
    	   });

        // // trigger hide when esc key pressed
        // document.addEventListener('keypress', function(e) {
        // // hide if esc
        //   lock.hide();
        //   }, false);
    });

    // $('#mytellstories').click(function(e){
    //   if(global.userlogin == false){
    //   e.preventDefault();
    //     lock.show({
    //       callbackURL: AUTH0_CALLBACK_URL,
    //       responseType: 'code',
    //       authParams: {
    //         scope: 'openid profile'
    //       }
    //      });
    //   }
    // });
});