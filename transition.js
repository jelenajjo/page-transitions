var PageTransitions = (function () {

    var startPageIndex = 0,
        animEndEventNames = {
            'WebkitAnimation'   : 'webkitAnimationEnd',
            'OAnimation'        : 'oAnimationEnd',
            'msAnimation'       : 'MSAnimationEnd',
            'animation'         : 'animationend'
        },

        // animation end event name
        animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],

        // support css animations
        support = Modernizr.cssanimations;

    function init() {

        // Get all the .pt-page div.
        $('.pt-page').each( function() {
            var $page = $(this);
            $page.data('originalClassList', $page.attr('class'));
        });

        // Get all the .pt-wrapper div which is the parent for all pt-div
        $('.pt-wrapper').each( function() {
            var $wrapperDiv = $(this);
            $wrapperDiv.data('current', 0);
            $wrapperDiv.data('isAnimating', false);
            $wrapperDiv.children('.pt-page').eq(startPageIndex).addClass('pt-page-current');
        });

        // Adding click event to .pt-trigger
        $('.pt-trigger').click(function() {
            $pageTrigger = $(this);
            Animate($pageTrigger);
        });
    }

    // All pt-trigger click event calls this function
    // This function gets the animation id, goto page that we define in `data-animation` and 'data-goto' repectively.
    function Animate($pageTrigger) {

        // Checking for 'data-animation' and 'data-goto' attributes.
        if (!($pageTrigger.attr('data-animation'))) {
            alert("Transition.js : Invalid attribute configuration. \n\n 'data-animation' attribute not found");
            return false;
        }
        else if (!($pageTrigger.attr('data-goto'))) {
            alert("Transition.js : Invalid attribute configuration. \n\n 'data-goto' attribute not found");
            return false;
        }

        var animation = $pageTrigger.data('animation').toString(),
            gotoPage, inClass, outClass, selectedAnimNumber;

         // Check if the delimiter '-' is present then create an animation array list.
        if(animation.indexOf('-') != -1) {
            var randomAnimList = animation.split('-');
            selectedAnimNumber = parseInt(randomAnimList[(Math.floor(Math.random() * randomAnimList.length))]);
        }
        else {
            selectedAnimNumber = parseInt(animation);
        }

        // Checking if the animation number is out of bound, max allowed value is 1 to 67.
        if (selectedAnimNumber > 67) {
            alert("Transition.js : Invalid 'data-animation' attribute configuration. Animation number should not be greater than 67");
            return false;
        }

        switch(selectedAnimNumber) {
            case 1:
                inClass = 'pt-page-moveFromRight';
                outClass = 'pt-page-moveToLeft';
                break;
            case 2:
                inClass = 'pt-page-moveFromLeft';
                outClass = 'pt-page-moveToRight';
                break;
        }

        // This will get the pt-trigger elements parent wrapper div
        var $pageWrapper = $pageTrigger.closest('.pt-wrapper');
        var currentPageIndex = $pageWrapper.data('current'), tempPageIndex,
            $pages = $pageWrapper.children('div.pt-page'),
            pagesCount = $pages.length,
            endCurrentPage = false,
            endNextPage = false;

        gotoPage = parseInt($pageTrigger.data('goto'));

        // check if 'data-goto' value is greater than total pages inside 'pt-wrapper'
        if (!(pagesCount < gotoPage)) {
            
            tempPageIndex = currentPageIndex;

            if($pageWrapper.data('isAnimating')) {
                return false;
            }

            // Setting the isAnimating property to true.
            $pageWrapper.data('isAnimating', true);

            // Current page to be removed.
            var $currentPage = $pages.eq(currentPageIndex);

            // Checking gotoPage value and decide what to do
            // -1 Go to next page
            // -2 Go to previous page
            // 0+ Go to custom page number.
            // NEXT PAGE
            if (gotoPage == -1) {

                // Incrementing page counter to diplay next page
                if(currentPageIndex < pagesCount - 1) {
                    ++currentPageIndex;
                }
                else {
                    currentPageIndex = 0;
                }
            }
            // PREVOUS PAGE
            else if (gotoPage == -2) {
                if (currentPageIndex == 0){
                    currentPageIndex = pagesCount - 1;

                }
                else if(currentPageIndex <= pagesCount - 1 ) {
                    --currentPageIndex;
                }
                else {
                    currentPageIndex = 0;
                }

            }
            // GOTO PAGE
            else {
                currentPageIndex = gotoPage - 1 ;
            }

            // Check if the current page is same as the next page then do not do the animation
            // else reset the 'isAnimatiing' flag
            if (tempPageIndex != currentPageIndex) {
                $pageWrapper.data('current', currentPageIndex);

                // Next page to be animated.
                var $nextPage = $pages.eq(currentPageIndex).addClass('pt-page-current');

                $currentPage.addClass(outClass).on(animEndEventName, function() {
                    $currentPage.off(animEndEventName);
                    endCurrentPage = true;
                    if(endNextPage) {
                        onEndAnimation($pageWrapper, $nextPage, $currentPage);
                    }
                });

                $nextPage.addClass(inClass).on(animEndEventName, function() {
                    $nextPage.off(animEndEventName);
                    endNextPage = true;
                    if(endCurrentPage) {
                        onEndAnimation($pageWrapper, $nextPage, $currentPage);
                    }
                });

            }
            else {
                $pageWrapper.data('isAnimating', false);
            }

        }
        else {
            alert("Transition.js : Invalid 'data-goto' attribute configuration.");
        }

        // Check if the animation is supported by browser and reset the pages.
        if(!support) {
            onEndAnimation($currentPage, $nextPage);
        }

    }

    function onEndAnimation($pageWrapper, $nextPage, $currentPage) {
        resetPage($nextPage, $currentPage);
        $pageWrapper.data('isAnimating', false);
    }

    function resetPage($nextPage, $currentPage) {
        $currentPage.attr('class', $currentPage.data('originalClassList'));
        $nextPage.attr('class', $nextPage.data('originalClassList') + ' pt-page-current');
    }

    return {
        init : init,
    };

})();

$(document).ready(function() {
    // initializing page transition.
    PageTransitions.init();
});