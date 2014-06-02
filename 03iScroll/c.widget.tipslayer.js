define(['cBase', 'cUICore', 'cWidgetFactory', 'cUIScroll'], function (cBase, cUICore, WidgetFactory, Scroll) {
  "use strict";

  var WIDGET_NAME = 'TipsLayer';

  // 如果WidgetFactory已经注册了ListView，就无需重复注册
  if (WidgetFactory.hasWidget(WIDGET_NAME)) {
    return;
  }

  /**
  * 显示控件，初始化时传入title与html即可
  */
  var TipsLayer = new cBase.Class(cUICore.Layer, {
    __propertys__: function () {
      this.showTitle = true;
      this.contentDom;
      this.title = '';
      this.body = '';
      this.mask = new cUICore.Mask({
        classNames: [cUICore.config.prefix + 'opacitymask']
      });
      var scope = this;
      this.mask.addEvent('onShow', function () {
        this.setzIndexTop(-1);
        $(window).bind('resize', this.onResize);
        this.onResize();
        var scope1 = this;
        this.root.bind('click', function () {
          scope1.hide();
          scope1.root.unbind('click');
          scope.hide();
        });

        //this.root.bind('click',)
      });

      this._loadButtonHtml = function () {
        if (this.buttons.length == 0) {
          return "";
        }
        var btnHtml = ['<div class="cui-roller-btns">'];
        $.each(this.buttons, function (index, item) {
          var cls = 'cui-btns-sure';
          //如果没传按钮类型,认为是确认按钮
          if (item.type == 'cancle') {
            cls = 'cui-btns-cancle';
          }
          btnHtml.push('<div class="cui-flexbd ' + cls + '">' + item.text + '</div>');
        });
        btnHtml.push('</div>');
        return btnHtml.join('')
      },

            this.html = '';
    },
    initialize: function ($super, options) {

      $super({
        onCreate: function () {

        },
        onShow: function () {
          this.title = options.title || '';
          this.buttons = options.buttons || [];
          this.html = options.html || '';

          if (typeof options.showTitle != 'undefined') {
            this.showTitle = options.showTitle;
          }

          this.html = $(this.html);
          this.btns = $(this._loadButtonHtml());

          //新增头尾
          this.header = options.header;
          this.footer = options.footer;

          this.buttons = options.buttons || [];

          this.contentDom.html([
                        '<div class="cui-pop-box">',
                             '<div class="cui-hd">' + this.title + '<div class="lab-close-area"><span class="cui-top-close">×</span></div></div>',
                             '<div class="cui-bd" style="overflow: hidden; position: relative; background-color: #fafafa; width: 100%;">',
                             '</div>',
                        '</div>'
                        ].join(''));

          if (options.width) {
            this.contentDom.find('.cui-pop-box').css({
              'width': options.width + 'px'
            });
          }

          this.mask.show();
          this.reposition();

          this.closeDom = this.contentDom.find('.cui-top-close').parent();
          this.body = this.contentDom.find('.cui-bd');

          //新增头尾
          if (this.header) this.body.before($(this.header));
          if (this.footer) this.body.after($(this.footer));

          if (this.html.length > 1) {
            this.html = $('<div style="width: 100%;"></div>').append(this.html);
          }
          this.html.css('background-color', 'white')

          //检测高度，高度过高就需要处理
          this.body.append(this.html);



          var wh = parseInt($(window).height() * 0.7);

          var _htmlHeight = this.html.height();
          var _h = _htmlHeight;

          if (options.height) _h = options.height;
          if (_h > wh) _h = wh;

          this.body.css({
            'height': _h + 'px'
          });

        
          if (!this.showTitle) {
            this.contentDom.find('.cui-hd').hide();
          }

          var scrollParam = {
            wrapper: this.body,
            scroller: this.html
          };

          $.extend(scrollParam, options);

          //如果设置的高度比html本身形成的高度大的话，这里就没有滑动了
          if (_h < _htmlHeight)
            this.s = new Scroll(scrollParam);

          this.contentDom.find('.cui-pop-box').append(this.btns);

          var scope = this;
          this.closeDom.on('click', function () {
            scope.hide();
          });

          $.each(this.btns, function (index, item) {
            var handler = scope.buttons[index].click;
            $(item).on('click', function () {
              handler.call(scope);
            });
          });

          this.setHtml = function (html) {
            scope.body.html(html);
          };

          var s = '';
        },
        onHide: function () {
          this.s && this.s.destroy();
          this.mask.hide();
          this.closeDom.off('click');
          this.root.remove();
          this.mask.root.remove();
        }
      })
    }
  });

  WidgetFactory.register({
    name: WIDGET_NAME,
    fn: TipsLayer
  });


});