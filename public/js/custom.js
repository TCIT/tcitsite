/* Add here all your JS customizations */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-45863581-1', 'auto');
ga('send', 'pageview');

// $( "#contactForm" ).submit(function( event ) {
//   // Stop form from submitting normally
//   event.preventDefault();
//
//   submitButton = $("#contact-form-submit");
//
//   // Get some values from elements on the page:
//   var $form = $( this ),
//     contactName = $form.find( "input[name='name']" ).val();
//     contactEmail = $form.find( "input[name='email']" ).val();
//     contactSubject = $form.find( "input[name='subject']" ).val();
//     contactMessage = $form.find( "input[name='message']" ).val();
//     url = $form.attr( "action" );
//
//   // Send the data using post
//   var posting = $.post( url, { name: contactName, email: contactEmail, subject: contactSubject, message: contactMessage } );
//
//   // Put the results in a div
//   posting.done(function( data ) {
//     submitButton.attr("value", "Send another message");
//   });
//
//   posting.fail(function() {
//     submitButton.attr("value", "Ups we had an problem... Try again!");
//   });
// });