$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    };
    // 1.3 创建裁剪区域
    $image.cropper(options);

    // 从本地图片获取窗口
    $('.local-img').on('click', function() {
        $('#upload_avatar').click();
    });

    // 图片显示在裁剪区
    $('#upload_avatar').on('change', function(event) {
        // 获取本地图片
        var local_avatar = event.target.files[0];
        // 显示在裁剪区
        show_image(local_avatar);
    });

    // 图片上传到服务器，并更换页面中的头像
    $('.upload-img').on('click', function() {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: { 'avatar': dataURL },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                window.parent.get_user_info();
                layui.layer.msg(res.message);
                // show_image($('#upload_avatar')[0].files[0]);
            }
        });
    });

    // 图片显示
    function show_image(files) {
        console.log(files);
        if (files.length === 0) {
            return layui.layer.msg('图片获取失败');
        }
        // 根据图片创建路径
        var newImgURL = URL.createObjectURL(files);
        // 显示在裁剪区
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    }
})