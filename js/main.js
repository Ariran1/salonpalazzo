// ymaps && ymaps.ready(initMap);
// var myMap,
//     myPlacemark;

// function initMap(){
//     if (!document.getElementById('map'))
//         return;

//     myMap = new ymaps.Map("map", {
//         center: [47.22873, 39.725307],
//         zoom: 16,
//         controls: ['smallMapDefaultSet']
//     });

//     myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
//         hintContent: 'ПАЛАЦЦО'
//     }, {
//         iconLayout: 'default#image',
//         iconImageHref: '/static/img/map.png',
//         iconImageSize: [62, 57],
//         iconImageOffset: [-10, -57]
//     });

//     myMap.behaviors.disable('scrollZoom');
//     myMap.geoObjects.add(myPlacemark);
// }



/*
Десктопная версия
1. Сетка
2. Плавающие иконки меню
3. Плавающие панель навигации и обратной связи
4. Магнитный скролл

Мобильная версия


*/


var app = {
    // app props

    init: function() {
        this.mobile = $(window).width() < 768;

        //this.scroll();
        this.sideNavigation.init();
        !this.mobile && app.grid('.js-grid');
        this.innerPage = $('.main--inner').length;

        $('.full-height').height($(window).height());

        if (location.pathname === '/design/') {
            $('body').addClass('outside-main');
            $('body').removeClass('dark-section');
            return
        }

        $(window).on('resize', function(event) {
            app.mobile = $(window).width() < 768;

            if (!app.mobile) {
                app.grid('.js-grid');
                $('body').removeClass('fixed-nav');
            } else {
                $('body').removeClass('dark-section outside-main');
                $('.scroll').removeClass('is-active');
                $('.scroll-shell').removeAttr('style');
            }



            $('.full-height').height($(window).height());
            app.mobile && $(window).trigger('scroll');
        });

        $(window).on('scroll', (function(event) {
            if (this.innerPage) {
                this.mobile && $('body').toggleClass('fixed-nav', app.mobile && $(window).scrollTop() > ($('.inner-bg').height() - 50));
            } else {
                $('body').toggleClass('fixed-nav', app.mobile && $(window).scrollTop() > $(window).height());
            }
        }).bind(this));

        $(window).trigger('scroll');
    },
    sideNavigation: {
        init: function() {
            if ($('.main--inner').length)
                return;

            $(window).on('scroll', (function(event) {
                if (app.mobile)
                    return;

                var
                    scrollTop = $(window).scrollTop(),
                    outsideMain = app.currentSection > 0;

                $('body').addClass('outside-main');
                $('body')[app.currentSection > 0 ? 'addClass' : 'removeClass']('outside-main');
                !app.mobile && $('body')[app.currentSection === 2 || app.currentSection === 5 ? 'removeClass' : 'addClass']('dark-section');
            }).bind(this));

            $(window).trigger('scroll');
        }
    },
    grid: function(container) {
        var
            $container = $(container),
            count = Math.floor($container.width() / 320),
            cellSize = Math.floor($container.width() / count),
            percent = 100 / count;

        $('.js-grid > *').css({
            width: percent + '%',
            height: cellSize
        });
    },
    scroll: function() {
        if (location.pathname === '/design/') {
            return
        }
        $('.scroll').toggleClass('is-active', !this.mobile);
        this.mobile && $('body, .page').removeAttr('style');
        this.currentSection = Math.round($(window).scrollTop() / this.sections);


        if (!$('.js-scroll').length || this.mobile)
            return;

        var
            // h = $(window).height() * $('.page').length;
            h = 5000;
            // console.log(h)

        this.sections = h / ($('.page').length);

        !this.mobile && $('body').height(h);

        $(window).on('resize', (function(event) {
            this.sections = h / ($('.page').length),
            this.currentSection = Math.ceil($(window).scrollTop() / this.sections);

            $(window).trigger('scroll');
        }).bind(this));

        $(window).on('scroll', (function(event) {
            if (location.pathname !== '/') {
                return
            }
            this.index = Math.ceil($(window).scrollTop() / this.sections);

            if (this.index !== this.currentSection) {
                this.currentSection = this.index;

                !app.mobile && $('.scroll-shell').css({
                    transform: 'translateY(-' + $('.page').eq(this.currentSection).position().top + 'px)'
                });
            }

        }).bind(this));

        $(window).trigger('scroll');
    }
};


$(function() {
    'use strict';

    app.init();

    // Side controls

    $('.js-toggle-nav').on('click', function(event) {
        $('body').removeClass('side-feedback-active').toggleClass('side-navigation-active');
    });

    $('.js-toggle-desire').on('click', function(event) {
        $('body').removeClass('side-navigation-active').toggleClass('side-feedback-active');
    });

    $('.js-close-side').on('click', function(event) {
        $('body').removeClass('side-feedback-active side-navigation-active');
    });

    $('.js-full-slider').bxSlider({
        mode: 'fade',
        controls: false
    });

    $('.js-full-slider-control').bxSlider({
        mode: 'fade',
        auto: true,
        // nextSelector: '.slide-control',
        nextText: '&#8250;',
        // prevSelector: '.slide-control.prev',
        prevText: '&#8249;'
    });

    $('.js-slider').bxSlider({
        mode: 'fade',
        controls: false
    });

    $('.js-toggle-catalog').on('click', function(event) {
        $('.catalog-navigation').fadeToggle();
        event.preventDefault();
    });

    $('.js-catalog-item__links').on('click', function(event) {
        $(this).siblings('.catalog-item__links-popup').fadeToggle();
        event.preventDefault();
    });

    // $('.js-catalog-item__links-list a').on('click', function(event) {
    //     $(this).closest('.catalog-item__links-popup').fadeOut();
    //     event.preventDefault();
    // });

    $('.js-toggle-category').on('click', function(event) {
        var parentCategory = $(this).closest('.catalog-navigation__category');

        if (parentCategory.hasClass('is-static')) {
            return false;
        }

        var toggle = !parentCategory.hasClass('is-selected');
        var h = $(window).width() < 768 ? 360 : $(window).height();

        parentCategory.toggleClass('is-selected', toggle);
        $(this).siblings('.catalog-navigation__items').height(toggle ? h : 0);

        event.preventDefault();
    });

    $('[href="' + window.location.pathname.slice(7) + '"]').parent().addClass('is-active');

    $('.js-show-main-map, .js-close-map').on('click', function(event) {
        event.preventDefault();
        $('.main-contacts').toggleClass('is-map');
    });

    $('.js-side-call').on('click', function(event) {
        event.preventDefault();

        $(this).parent().toggleClass('is-active');
        $(this).siblings('.side-feedback__inner').slideToggle();
    });

    $('.js-company-history').on('click', function(event) {
        event.preventDefault();

        $(this).closest('li').toggleClass('is-active');
        $(this).siblings('.company__history-description').slideToggle();
    });

    $('.js-salon-map').on('click', function(event) {
        event.preventDefault();
        $('.salon__map').slideToggle(300, function() {
            myMap.container.fitToViewport();
        });
    });

    $('.js-ghost').length && $('.js-ghost').inFieldLabels({fadeOpacity: 0});
    $('#about').length && $('#about').flexible();

    $('[href="#connect"]').on('click', function(event) {
        $(window).scrollTop(400);
        event.preventDefault();
    });

    app.mobile && $('.main-designers__slider').bxSlider({
        controls: false
    });

    $('#tag-filter').change(function(){
        var self = $(this)
        $.ajax({
            url: self.attr('action'),
            data: self.serialize(),
            success: function(data) {
                $('#mills-grid').html(data)
            }
        })
    })
    $('#tag-filter .reset label').click(function(){
        $(this).parents('#tag-filter').trigger('reset').trigger('change')
    });

    $('.catalog-navigation__wrapper').each(function() {
        if ($(this).find('div a').length > 5) {
            $(this).find('div a:gt(4)').fadeOut()
            $(this).find('div a.more').fadeIn()
        }
    })

    $('.catalog-navigation__wrapper .more').click(function(e) {
        e.preventDefault();
        $(this).parents('.catalog-navigation__wrapper').find('div a').fadeIn()
        $(this).fadeOut()
    })
});
