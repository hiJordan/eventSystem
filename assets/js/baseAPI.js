// 每次调用 $.get() 或 $.post() 或 $.ajax(),会先调用ajaxPrefilter函数
// 此函数可以得到ajax相关的配置
$.ajaxPrefilter(function(options) {
    // 发起请求之前，全局统一拼接路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;

    // 全局/my/路径下的请求，设置权限，以供正常访问
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        };
    }

    // 全局挂载complete
    // 不论请求成功，还是失败，都会调用complete
    // 若直接进入index界面，没有登录，则跳转到login界面
    options.complete = function(res) {
        if (res.responseJSON.status === 1) {
            localStorage.removeItem('token');
            location.href = '/day17-eventMangeSystemProject/login.html'
        }
    }

});