$(function() {

    var layer = layui.layer;

    render_article_cate();

    // 获取文章分类列表,渲染内容到页面
    function render_article_cate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                // 移除已删除的表格项,即is_delete等于1的数据项
                $.each(res.data, function(index, ele) {
                    if (ele.is_delete === 1) {
                        res.data[index].remove();
                    }
                });
                // 渲染表格到页面
                var article_cate_tb = template('article_tb', res);
                $('.layui-table tbody').html(article_cate_tb);
            }
        });
    }

    // 弹出添加文章分类页面
    var close_index = null;
    $('#article_cate_add').on('click', function(event) {
        close_index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#article_add').html(),
        });
    });
    // 触发提交时，添加到服务器，并渲染在页面
    // 事件委托在body节点上，因弹出层是body的子节点
    // 若委托于body，html之外，其他节点上，则无法根据事件冒泡触发此事件
    $('body').on('submit', '#article_list', function(event) {
        event.preventDefault();
        console.log(event);
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 数据提交后，重新渲染页面
                render_article_cate();
                // 关闭弹出层
                layer.close(close_index);

            }
        });
    });

    // 弹出修改文章分类页面
    var modify_index = null;
    $('tbody').on('click', '.modify_tb', function(event) {
        modify_index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#article_modify').html(),
        });
        // 根据id获取分类信息，显示在弹出层
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + $(this).attr('data-id'),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 分类数据显示在页面中
                var form = layui.form;
                form.val('article_cate_list', res.data);
            }
        });
    });
    // 触发修改按钮后，重新渲染页面
    $('body').on('submit', '#article_cate_modify', function(event) {
        event.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                console.log(event);
                render_article_cate();
                layer.close(modify_index);
                layer.msg(res.message);
            }
        });
    });

    // 删除操作
    $('tbody').on('click', '.del_td', function(event) {
        var data_id = $(this).attr('data-id');
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + data_id,
                success: function(res) {
                    if (res.status !== 0) {
                        layer.msg(res.message);
                    }
                    render_article_cate();
                    layer.close(index);
                    layer.msg(res.message);
                    console.log(this, $(this), $(this).attr('data-id'));
                }
            });
        });
    })
});