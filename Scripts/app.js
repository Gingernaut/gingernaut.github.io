/*****************       Navbar animation    ***************/
var site_top = $("#site_wrapper").offset().top;
$(document).scroll(function() {
    if ($(this).scrollTop() > site_top) {
        $('#navbar').css({
            "background-color": "rgba(0,0,0,.85)",
            "height": "55px"
        });
        $('#navcontent').css({
            "margin-top": "5px"
        });
    } else {
        $('#navbar').css({
            "background": "transparent",
            "height": "70px"
        });
        $('#navcontent').css({
            "margin-top": "10px"
        });
    }
});
/*****************      Smooth Scroll    *******************/
$(document).ready(function() {
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = this.hash;
        var $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 900, 'swing', function() {
            window.location.hash = target;
        });
    });
});
/*****************       Phone Button    *******************/
/*
$("#phone_button").click(function() {
    $('#phone_position').css({
        "margin-left": "75%",
        "-webkit-transform": "perspective( 900px) rotateY( -15deg)",
        "transform": "perspective( 900px) rotateY( -15deg)"
    });
});
*/