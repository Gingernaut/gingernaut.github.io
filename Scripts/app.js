/*****************       Navbar animation    *******************/
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