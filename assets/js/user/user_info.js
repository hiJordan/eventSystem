$(function() {
    // 输入验证
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                console.log(value.length);
                return '昵称长度需在1~6。';
            }
        },
    });

    // 获取用户信息
    init_user_info();

    function init_user_info() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('用户信息获取失败。');
                }
                form.val('form_user_info', res.data);
            }
        });
    }

    // 重置表单
    $('#btn_reset').on('click', function(event) {
        event.preventDefault();
        init_user_info();
    });

    // 提交修改
    $('.layui-form').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败.');
                }
                // window指iframe，parent指index页面，从而获得其中的函数
                window.parent.get_user_info();
                layer.msg('用户信息修改成功');
            }
        });
    });
});