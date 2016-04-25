/**
 * Created by sunny on 16/4/1.
 */


!function($) {

  /**
   * @param options
   * $el: jquery对象   obj
   * selectArr: 当前的数据: []  array
   * num:   当前实例化的值        number
   *
   * optionTip: option 请选择  string
   * default: select的所有默认值  []
   * total: 全部实例化对象    obj
   * maxNum: 总初始化对象的最大num,标记最后一个值  number
   *
   */

  function AutoOptions ( options ) {
    this.options = options;

    this.num = options.num; //当前初始化的序列

    AutoOptions.prototype.optionTip = options.optionTip ? "<option value=''>请选择</option>" : '';

    AutoOptions.prototype.default = options.default; //默认值

    AutoOptions.prototype.total = options.total; //总初始化对象

    AutoOptions.prototype.maxNum = options.maxNum; //总初始化对象的最大num,标记最后一个值

    // 设置select 样式
    if (options.noData == 'none') {
      AutoOptions.prototype.css = {
        cssAttr: 'display',
        cssVal: 'none'
      };
    } else if (options.noData == 'hidden') {
      AutoOptions.prototype.css = {
        cssAttr: 'visibility',
        cssVal: 'hidden'
      };
    }

    if ( !options.$el ) {
      return;
    }

    this.$el = options.$el;

    this.selectArr = options.selectArr;

    // 看是否有绑定change事件
    this.changeId = 0;

    // 是否select 设置了默认值
    this.inited = 0;

    this._init();
  }

  AutoOptions.prototype._init = function () {
    var self = this;

    // 改相应的html
    self._html( self.selectArr, self.optionTip, self.$el );

    // 初始化select完成则触发回调  --因为当前函数仍没有初始化完成,所以设置时间触发器,等当前任务完成后再触发
    self.num == self.maxNum && setTimeout(function () {
      self._done();

      // 显示容器
      self.$el.parent().show();
    }, 1);

    self.optionTip || self._changeEvt({obj: self });

    // 绑定过change事件则无需再绑定
    if( self.changeId ){
      return;
    }

    self.changeId = 1;

    // 当前select绑定change事件,下一个select的值要随之改变
    self.$el.on( 'change', function( e ){
      var that = this;
      self._changeEvt( {obj: self, index: that.selectedIndex } );
    });
  };

  // 当前select:相应的html
  AutoOptions.prototype._html = function ( selectArr, optionTip, $el ) {
    $.each( selectArr, function(i, val) {
      optionTip += "<option value='" + val.name + "'>" + val.name + "</option>";
    });

    $el.attr("disabled", false).html( optionTip ).css({'display': '', 'visibility': ''});
  };

  // 当前select绑定change事件,下一个select的值要随之改变
  //参数对象属性: obj 当前操作的对象, index为change触发的序列号,init为初始化select默认值的相对index
  AutoOptions.prototype._changeEvt = function( obj ){
    var self = obj.obj,
      index = obj.index >= 0 ? obj.index : 0,
      init = obj.init,
      nowIndex;

    // 只有当有默认值时,才设置select的值
    init >= 0 && self.$el.val( self.selectArr[init].name );

    //之后的select 禁止 及样式修改
    self.css ? self.$el.nextAll( 'select' ).empty().attr("disabled", true).css( self.css.cssAttr, self.css.cssVal )
      : self.$el.nextAll( 'select' ).empty().attr("disabled", true);

    index = self.optionTip ? ( index -1 ): index;

    nowIndex = init >= 0 ? init : index && index == -1 ? 0 : index;

    // 下一个元素存在 且 有值
    var next = self.total[self.num + 1];
    if( !next ){
      return;
    }
    next.selectArr = self.selectArr && self.selectArr[nowIndex].child || '';
    next.selectArr && next._init();
  };

  // select全部new完成, 可传入回调
  AutoOptions.prototype._done = function ( fn ) {
    fn && fn();

    var self = this;

    // 默认值仅设置一次
    if( self.inited ){
      return;
    }

    self.inited = 1;

    self._defaultVal();
  };

  AutoOptions.prototype._defaultVal = function ( arr ) {
    var self = this;

    // 设置select初始值 *attention: 初始化每个select标签后,stop为true则停止设置初始值
    for( var m = 0; m <= self.maxNum ; m++ ){
      if( self.default[m] == '' || self.default[m] == undefined ){
        self.default.length = 0;
      }

      // 当前的 index 值
      if( self.default.length ){
        var num = self.total[m].selectArr && self.total[m].selectArr.findIndexInArrObj( self.default[m] );

        if( num != 0 && !num ){
          self.default.length = 0;
        }

        // 触发值改变
        self.default.length && num >= 0 && self._changeEvt( {obj: self.total[m], init: num } );

      } else {
        // 促发自动循环默认第一个值 *无提示语  or *无初始值
        !self.optionTip && self._changeEvt({obj: self.total[m] });
      }
    }
  };

    // 看当前值val 是对应的数组arr中的对象的属性值attr  具体index
  Array.prototype.findIndexInArrObj = function(val, attr ) {
    var arr = this;
    if( !val ){
      return;
    }
    attr = attr || 'name';
    for( var m = 0; m != arr.length; m++ ){
      if( val == arr[m][attr] ){
        return m >= 0 ? m : '';
      }
    }
  };

  $.fn.cascadeDropSelect = function ( options ) {
    var self = this; // jquery对象

    if ( !self.length ) {
      return;
    }

    options = $.extend({
      data: [],      // select的 data
      selectLen: 2,  // select 选择框的个数,默认 3,
      default: [],     // 传进来的默认值
      noData: null,       // 没有数据时相应的 select的样式: none/hidden
      optionTip: false // true时:添加请选择option,false时,不添加
    }, options);


    // select
    var selectHtml = '',
      selectLen = options.selectLen,
      selectBefore = self.find( 'select' ), // 该元素下已有的 select
      selectBeforeLen = selectBefore.length; // 该元素下已有的 select

    //隐藏容器,select 全部渲染好之后再显示
    this.hide();

    // select框 设置到 selectLen参数
    if ( selectBeforeLen < selectLen ){/*less then add*/
      for( var k = selectBeforeLen; k != selectLen; k++ ){
        selectHtml += '<select></select>';
      }
      self.append( selectHtml );
    } else if( selectBeforeLen > selectLen ){/*more then remove*/
      for( var n = selectLen; n != selectBeforeLen; n++ ){
        selectBefore.eq(n-1).remove();
      }
    }

    // 初始化每个对象,并保存下来
    var Ao = [];
    self.find('select').each( function( i, el ){
      Ao[i] = new AutoOptions(
        { $el: $(el),
          selectArr: i ? '' : options.data, // 初始化时 只有第一个select 传了值
          optionTip: options.optionTip,
          default: options.default || [],
          noData: options.noData,
          maxNum: selectLen -1,
          total: Ao,
          num: i
        });
    });
    return Ao;
  };
}(jQuery);
