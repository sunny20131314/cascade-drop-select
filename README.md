## cascade-drop-select.js
这是一个联动下拉框，基于jquery框架。

## 功能
1. 可以设置下拉框的初始值
2. 可以设置显示的下拉框的个数
3. 设置没有数据时的select状态，禁止使用/隐藏 ，其中隐藏有两种方式— visibility: hidden/display：none
4. 选择是否需要提示语： 请选择

## 实现
1. 	相应的html结构，容器 div#cascade-drop-select-1,可以写相应的 select，写一些class方便使用， 也可以不写相应的 select ，仅仅写个<div id=“cascade-drop-select-1></div>，相关的select，js会自动处理.

	``` html
	<div id=“cascade-drop-select-1>
	  <select class=“one”></select>
	  <select class=“two”></select>
	  <select class=“three”></select>
	</div>
	```

1. 因为是基于jquery框架，所以使用前先引入jquery框架，再引入js文件.
3. 找到相应的容器，调用方法cascadeDropSelect，传入参数，如下所示


``` javascript
$("#cascade-drop-select-1").cascadeDropSelect({
       data: [ //选择框的数据
      {"name": "前端课程",
        "child": [
          {"name": "HTML5",
            "child": [
              {"name": "HTML",
                "child": [
                  {"name": "header",
                    "child": [
                      {"name": "h1"},
                      {"name": "h2"}
                    ]},
                  {"name": "nav"}
                ]},
              {"name": "HTML5"}
            ]},
          {"name": "JSON"}]
      },
     {"name": "数据库",
        "child": [
          {"name": "Mysql"},
          {"name": "SqlServer"},
          {"name": "Oracle"},
          {"name": "Mssql"}
        ]}
    ],   //选择框的数据
    default: ['数据库', 'C++', 'c!!'], //set select初始值
    selectLen: 5,     //最多显示的select选择框
    noData: 'hidden', //设置无数据时的样式: none/hidden
    optionTip: false  //是否需要提示语:
  });
```
   * 参数 data 传值select的所有选择框的数据，使用树状结构， 其中name是指当前select option的值，同一对象内的child属性，是指其后面的子对象，即下一select 的数据，如此层层向下的一个数据结构，没有限制。
   * 参数 default 设置下拉框的初始值，不传值则按默认行为———即不需要提示语时，是显示需要显示的且有数据的下拉框。
   * 参数：selectLen 设置显示的下拉框的个数，默认2个
   * 参数：noData 设置没有数据时的select状态，可传参数 hidden/ none.  ———不传值则为禁止使用disabled，传值hidden即为设置无数据时的select样式 visibility: hidden， 传值none设置无数据时的select样式 display：none
   * 参数 optionTip 设置是否需要提示语： true/false， true时使用提示语，这时候select改动仅修改下一select 的 option 的值。false 时，显示需要显示的且有数据的select下拉框。

