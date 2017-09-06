/**
 * 生成监视滚动位置的实例
 * @constructor
 */
var ScrollCenter = function () {
    var noop = function () {
    };

    /**
     * 计算是否在到达监视节点的位置
     * @param {number} scrollTop - 实时滚动到的位置顶部
     * @param {number} screenHeight - 实时的屏幕高度
     * @param {Object} domData - 监视节点的数据
     * @return {Boolean}
     */
    function calc(scrollTop, screenHeight, domData) {
        return scrollTop + screenHeight + domData.threshold > domData.offsetTop && scrollTop < domData.offsetTop + domData.height + domData.threshold
    }

    /**
     * 更新全部监视节点区域
     * @param {Object} activeArea - 包含min和max
     * @param {Object} domData - 监视节点的数据
     */
    function updateArea(activeArea, domData, screenHeight) {
        var newMin = domData.offsetTop - domData.threshold - screenHeight,
            newMax = domData.offsetTop + domData.height + domData.threshold ;
        !activeArea.min && (activeArea.min = newMin);
        !activeArea.max && (activeArea.max = newMax);

        if (newMin < activeArea.min) activeArea.min = newMin;
        if (newMax > activeArea.max) activeArea.max = newMax;
    }

    var _this = this;
    var _activeArea = {
        min: null,
        max: null
    };
    var _threshold = 0;
    var _listenerList = [];
    var _screenHeight = $(window).height();
    $(window).resize(function () {
        _screenHeight = $(window).height();
    });
    $(window).scroll(function () {
        var len = _listenerList.length;
        if (len === 0) return;
        var currentPos = $(window).scrollTop();

        if (currentPos < _activeArea.min || currentPos > _activeArea.max) return;

        for (var i = 0; i < _listenerList.length; i++) {
            var _data = _listenerList[i];
            var isTrigger = calc(currentPos, _screenHeight, _data);
            if (isTrigger) {
                if(_data.once) {
                    _data.fn(currentPos);
                    _listenerList.splice(i, 1);
                    i--;
                }else {
                    _data.fn(currentPos);
                }

            }
        }
    });


    return {
        /**
         * 监听一个节点
         * @param {Object} opts
         * @namespace ScrollCenter
         */
        listen: function (opts) {
            /*
             * {
             *   dom:dom,
             *   fn:fn,
             *   threshold:threshold,
             *   once:true
             * }
             *
             * */
            var $dom = opts.dom;
            var data = $.extend({
                dom: $dom,
                height: $dom.height(),
                offsetTop: $dom.offset().top,
                threshold: _threshold,//修正值
                fn: noop,//触发的fn
                once: true//触发一次还是一直触发
            }, opts);

            _listenerList.push(data);
            updateArea(_activeArea, data ,_screenHeight);

        }
    }
};
$(document).ready(function () {

    $(".feature-tip").click(function (event) {
        var $target = $(event.target);
        if($target.hasClass("active")) {
            $target.removeClass("active");
            $(".tip-text").remove();
        }else {
            $(".feature-tip.active").removeClass("active");
            $(".tip-text").remove();

            $target.addClass("active");
            var tipText = $target.data("tip");
            var pos = $target.position();
            pos.top -= 10;
            pos.left += 80;

            var tpl = $('<span class="tip-text">' + tipText + '</span>');
            tpl.css(pos);
            $("#tip_container").append(tpl);
            setTimeout(function() {
                tpl.addClass("show");
            },0);
        }
    });

    //缓动动画
    var tweenRange = 15;
    var scrollCenter = new ScrollCenter();
    $(".tween").each(function(i, dom) {
        scrollCenter.listen({
            dom:$(dom),
            once:false,
            fn:function(currentPos) {
                var offset = currentPos - this.offsetTop;
                if(offset < 0) {
                    offset = Math.max(-this.height, offset);
                }else {
                    offset = Math.min(this.height, offset);
                }
                var h = - offset / this.height * tweenRange;
                this.dom.css({
                    transform:"translate3d(0,"+h+"px,0)"
                });
            }
        });
    });

//   显示描述
    scrollCenter.listen({
        dom:$(".showDesc"),
        fn:function() {
            $(".showDesc").css({'opacity':1});
        }
    })
});
