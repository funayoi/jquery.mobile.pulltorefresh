(function($) {
    $.fn.pulltorefresh = function (options) {
        var _options = $.extend({
            async: false,
            refresh: function(){},
            abort: function(){}
            }, options);

        $(this).data("isRefreshing", false);
        $(this).bind("pulltorefreshstart", _options.refresh);
        $(this).bind("pulltorefreshabort", _options.abort);

        var target = $(this);
        var finishCallback = function() {
            alert("finish");
            target.css("top", 0);
            target.data("isRefreshing", false);
        };

        $(this).draggable({ 
            axis: "y",
            create: function(event, ui) {
                $(this).prepend('<div class="pull-header">reloading...</div>');
                startPosTop = $(this).parent().position().top;
                $(this).data("finish", function() {
                    $("#draggable").css("top", 0);
                });
            },
            stop: function(event, ui) {
                var top = parseInt($(this).css("top"));
                if (top >= 80) {
                    // when pulled
                    $(this).data("isRefreshing", true);
                    $(this).css("top", 80);

                    // trigger start event
                    $(this).trigger("pulltorefreshstart", finishCallback);
                    if (!_options.async) {
                        finishCallback()
                    }
                } else {
                    // when released
                    $(this).css("top", 0);

                    // abort refreshing process
                    if ($(this).data("isRefreshing")) {
                        $(this).trigger("pulltorefreshabort");
                        $(this).data("isRefreshing", false)
                    }
                }
            }
        });
    };
})(jQuery);
