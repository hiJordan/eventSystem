// 每次调用 $.get() 或 $.post() 或 $.ajax(),会先调用ajaxPrefilter函数
// 此函数可以得到ajax相关的配置
$.ajaxPrefilter(function(options) {
    // 发起请求之前，同一拼接路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    console.log(options);
});