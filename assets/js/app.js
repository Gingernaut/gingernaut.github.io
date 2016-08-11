$(document).ready(function () {
    $('#landing').mousemove(function (e) {
        parallax(e, this, 1);
        parallax(e, document.getElementById('landingtextcenter'), 2);
        parallax(e, document.getElementById('layer-three'), 3);
    });
});

function parallax(e, target, layer) {
    var layer_coeff = 30 / layer;
    var x = ($(window).width() - target.offsetWidth) / 2 - (e.pageX - ($(window).width() / 2)) / layer_coeff;
    var y = ($(window).height() - target.offsetHeight) / 2 - (e.pageY - ($(window).height() / 2)) / layer_coeff;
    $(target).offset({ top: y ,left : x });
};