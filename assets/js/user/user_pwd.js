$(function() {
    // 表单验证
    var form = layui.form;

    form.verify({
        // 1.密码长度限制
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 2.new old密码内容不同
        different: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不能与原密码相同';
            }
        },
        // 3.new re密码相同
        same: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入不一致';
            }
        }

    });

    // 密码修改后提交
    $('.layui-form').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(`密码修改失败：${res.message}`);
                }
                layui.layer.msg(res.message);
                $('.layui-form')[0].reset();
            },
        });
    });
})