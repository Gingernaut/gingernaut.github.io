$(document).ready(function() {

    'use strict';
    var a = baffle("#a");
    var b = baffle("#b");
    var c = baffle("#c");
    var d = baffle("#d");
    var e = baffle("#e");
    var f = baffle("#f");


    a.set({
        characters: '▓░█ ▒░▒▓░ ▒░░▓> ▒█▓ █░><▒ █▒█▓ ▓░/ ▓▓/█ █▓▒█',
    });

    b.set({
        characters: '▓░█ ▒░▒▓░ ▒░░▓> ▒█▓ █░><▒ █▒█▓ ▓░/ ▓▓/█ █▓▒█',
    });

    c.set({
        characters: '▓░█ ▒░▒▓░ ▒░░▓> ▒█▓ █░><▒ █▒█▓ ▓░/ ▓▓/█ █▓▒█',
    });

    d.set({
        characters: '▓░█ ▒░▒▓░ ▒░░▓> ▒█▓ █░><▒ █▒█▓ ▓░/ ▓▓/█ █▓▒█',
    });

    e.set({
        characters: '▓░█ ▒░▒▓░ ▒░░▓> ▒█▓ █░><▒ █▒█▓ ▓░/ ▓▓/█ █▓▒█',
    });

    f.set({
        characters: '▓░█ ▒░▒▓░ ▒░░▓> ▒█▓ █░><▒ █▒█▓ ▓░/ ▓▓/█ █▓▒█',
    });

    b.reveal(1000);
    a.reveal(1000);
    c.reveal(1000);
    d.reveal(9000);
    e.reveal(9000);
    f.reveal(9000);

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

