$(function() {
    // 登录与注册区域的切换
    $('#link_reg').on('click', function() {
        $('.login_box').hide();
        $('.reg_box').show();
    });
    $('#link_login').on('click', function() {
        $('.login_box').show();
        $('.reg_box').hide();
    });
    // 表单的校验
    var form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            var pwd = $('.reg_box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    });

    var layer = layui.layer;
    // 发起注册用户的ajax请求
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val(),
        };
        $.post('/api/reguser', data, function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！');
            $('#link_login').click();
        });
    });
    // 发起登录用户的ajax请求
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功');
                localStorage.setItem('token', res.token);
                location.href = '/day17-eventMangeSystemProject/index.html';
            }
        });
    });
});