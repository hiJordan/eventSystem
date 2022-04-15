$(function() {
    get_user_info();

    var layer = layui.layer;
    // 用户退出
    $('#logout').on('click', function() {
        layer.confirm('是否退出？', { icon: 3, title: '提示' }, function(index) {
            // 清除本地存储的访问权限token
            localStorage.removeItem('token');
            // 跳转到登录页
            location.href = '/day17-eventMangeSystemProject/login.html';
            layer.close(index);
        });
    });
});

// 获取用户信息
function get_user_info() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers: { Authorization: localStorage.getItem('token') || '', },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('用户信息获取失败');
            }
            // 渲染用户头像
            render_avatar(res.data);
        },
    });
}

// 渲染用户头像
function render_avatar(data) {
    // 设置用户名称，若昵称存在，在设昵称，反之为登录名
    var user_name = data.nickname || data.username;
    $('#welcome').html('欢迎 ' + user_name);
    // 设置头像, 若data中图片存在，则设其，若不存，则采用昵称首字为头像
    if (data.user_pic) {
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', data.user_pic).show();
    } else {
        $('.layui-nav-img').hide();
        $('.text-avatar').html(user_name[0].toUpperCase()).show();
    }
}

function test(params) {
    console.log(123);
}