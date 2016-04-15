$('.menu_item').off().click(function (e) {
    scroll($(this).attr('data-scroll'));
});

function scroll(id) {
    $('html,body').animate({
        scrollTop: $("#" + id).offset().top
    },
           'slow');
}
