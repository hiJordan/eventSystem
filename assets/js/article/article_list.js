$(function() {
    // 文章相关参数
    var query_show = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    }
    var layer = layui.layer;
    var laypage = layui.laypage;
    var form = layui.form;

    get_article_list();
    render_cates_selects();

    // 获取文章列表，并渲染到表格中
    function get_article_list() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: query_show,
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg(res.message);
                }
                // 使用模板引擎，将数据渲染到表格中
                var render_tb = template('article_list', res);
                $('tbody').html(render_tb);
                // 渲染分页区域
                render_paging_box(res.total);
            }
        });
    }


    // 格式化发布时间，使用模板引擎过滤
    template.defaults.imports.formate_time = function(value) {
        var time = new Date(value);
        var y = pad_zero(time.getFullYear());
        var mon = pad_zero(time.getMonth() + 1);
        var d = pad_zero(time.getDate());

        var h = pad_zero(time.getHours());
        var m = pad_zero(time.getMinutes());
        var s = pad_zero(time.getSeconds());

        return `${y}-${mon}-${d} ${h}:${m}:${s}`;
    };
    // 时间补零
    function pad_zero(data) {
        return data > 9 ? data : '0' + data;
    };

    // 获取分类信息，渲染到文章分类下拉列表中
    function render_cates_selects() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg(res.message);
                }
                var render_cates = template('article_cates', res);
                $('[name=cate_id]').html(render_cates);
                // 列表项是动态添加到页面中，未被Layui监听到，故使用render在此渲染
                form.render();
            }
        });
    }

    // 筛选表格中的文章
    $('.layui-form').on('submit', function(event) {
        event.preventDefault();
        // 获取cate_id与state，改变query_show字典，发起筛选请求
        query_show.cate_id = $('[name=cate_id]').val();
        query_show.state = $('[name=state]').val();
        console.log(12, $('[name=cate_id]').val(), $('[name=state]').val());
        get_article_list();

    });

    // 分页区域
    // 点击页码时，切换表格项
    // 可以切换每页中表格的数据项
    function render_paging_box(total) {
        laypage.render({
            elem: 'paging', //渲染到的区域
            count: total, //数据总数，从服务端得到
            limit: query_show.pagesize, //每页显示的数据条数
            curr: query_show.pagenum, //当前显示的页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //定义功能
            limits: [2, 3, 5, 10], //每页的条目数
            // jump会在点击页码时触发，以及调用laypage.render时触发
            // 若laypage.render时触发，若不进行判断，会发生死循环
            // first为true为laypage.render时触发，false则切换时发生
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                query_show.pagenum = obj.curr; //得到当前页，以便向服务端请求对应页的数据。
                query_show.pagesize = obj.limit; //得到每页中的条目数
                //初始加载时不执行，防止死循环
                if (!first) {
                    get_article_list();
                }
            }
        });

    }

    // 删除文章
    // 因表格是动态渲染的，故事件委托在tbody上
    $('tbody').on('click', '.del_list', function(event) {

        layer.confirm('确认删除文章?', { icon: 3, title: '提示' }, function(index) {
            // 删除按钮的个数
            var del_btns = $('.del_list').length;
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + $(event.target).attr('data-id'),
                success: function(res) {
                    if (res.status !== 0) {
                        layer.msg(res.message);
                    }
                    // 执行到此时，且del_btns为1则本页数据被全部删除
                    // 删除后，当前的页码仍未改变，会请求空的数据，渲染不了表格
                    // 故手动减去1，去掉当前页，此减1操作，在页码等于1时，不在进行
                    if (del_btns === 1) {
                        query_show.pagenum = query_show.pagenum === 1 ? 1 : query_show.pagenum - 1;
                    }
                    get_article_list();
                }
            });

            layer.close(index);
        });
    });

    // 修改文章
    var index_article = null;
    $('tbody').on('click', '.modify_list', function(event) {
        // index_article = layer.open({
        //     type: 1,
        //     title: '修改文章内容',
        //     content: $('#modify_article').html(),
        // });
        location.href = 'article_publish.html?id=' + $(this).attr('data-id');

    })

});