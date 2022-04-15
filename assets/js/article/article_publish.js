$(function() {
    var layer = layui.layer;
    var form = layui.form;

    // 判断是修改文章，还是准备发布新文章
    // var modify_or_publish = 'publish';
    // if (location.search) {
    //     modify_or_publish = 'modify';
    // }

    init_cate();
    // 初始化富文本编辑器
    initEditor()

    // 获取文章分类信息，渲染到下拉列表中
    function init_cate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var render_cates = template('article_cate', res);
                $('[name=cate_id]').html(render_cates);
                form.render();
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 打开获取图片的窗口
    $('.change_img').on('click', function() {
        $('#upload_img').click();
    });
    // 获取的图片显示在剪裁区
    $('#upload_img').on('change', function(event) {
        var file = event.target.files;
        // 判断用户是否选择了文件
        if (file.length === 0) {
            return;
        }
        console.log(file[0]);
        var newImgURL = URL.createObjectURL(file[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 定义文章的状态
    var article_state = '已发布';
    $('#save').on('click', function() {
        article_state = '草稿';
    });

    // 获取表单中的数据,并发送到服务器
    $('#publish_article').on('submit', function(event) {
        event.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', article_state);

        // 将封面裁剪过后的图片，输出为一个文件对象
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function(blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象，存储到 fd 中
            fd.append('cover_img', blob);
            // 6. 发起 ajax 数据请求

            publish_article(fd);

        })
    })

    // 定义一个将文章发布的方法
    function publish_article(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            processData: false,
            contentType: false,
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg(res.message);
                }
                location.href = 'article_list.html';
                layer.msg(res.message);
            }
        });
    }
    // modify_article();

    // function modify_article() {
    //     if (modify_or_publish === 'modify') {
    //         // 解析get请求中要修改的文章的id
    //         var article_id = location.search.substring(4);

    //         // 发送请求，获得响应的数据
    //         $.ajax({
    //             method: 'get',
    //             url: '/my/article/' + article_id,
    //             success: function(res) {
    //                 if (res.status !== 0) {
    //                     layer.msg(res.message);
    //                 }
    //                 // 填充数据到页面
    //                 console.log(res.data);
    //                 form.val('publish_article', res.data);

    //                 var img = res.data.cover_img;
    //                 var newImgURL = URL.createObjectURL(get_img(img))
    //                 $image
    //                     .cropper('destroy') // 销毁旧的裁剪区域
    //                     .attr('src', newImgURL) // 重新设置图片路径
    //                     .cropper(options) // 重新初始化裁剪区域
    //             }
    //         });
    //     }

    // }

    // function get_img(url) {
    //     $.ajax({
    //         method: 'get',
    //         url: url,
    //         success: function(res) {
    //             return res;
    //         }
    //     });
    // }




});