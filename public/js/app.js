$(document).ready(function () {
  $(".sidenav").sidenav();
  //   $(".materialboxed").materialbox();
  $(".slider").slider({
    fullWidth: true,
  });
  $(".scrollspy").scrollSpy();
  $(".parallax").parallax();
  $(".materialboxed").materialbox();
  $("textarea#message").characterCounter();
  $(".carousel").carousel({
    numVisible: 7,
    shift: 55,
    padding: 55,
  });
});

console.log("Mic check");
