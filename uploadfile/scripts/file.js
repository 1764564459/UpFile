(function ($, window, document) {

    var FilesName = "Files", formData, file_list = [], file_elem, list_box, list_ul,
        defaults = {
            displayTarget: null
        };
    function RandStr(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
    //
    //初始化当前
    function Files(elem, option) {
        if (typeof FileReader === 'undefined') {
            alert("抱歉，你的浏览器不支持 FileReader");
            input.setAttribute('disabled', 'disabled');
        } else {
            //input.addEventListener('change', GetFile, false);
        }
        var utl = self.URL;
        //alert(utl);
        //初始化
        this._elem = elem;//
        this._setting = $.extend(defaults, option);//合并数据
        this._defaults = defaults;
        this._name = FilesName;
        this.init();
    }
    //
    //删除某一项
    //<param name='arg'>当前文件对象</param>
    //<return></return>
    function del_file(arg) {
        var data = arg.data;
        $.each(file_list, function (_index, _item) {
            if (_item.fileName.trim() === data.fileName.trim()) {
                file_list.splice(_index, 1);//删除位于_index元素
                $("#list_ul li:eq(" + _index + ")").remove();
                return true;
            }
        });
    }
    //
    //获取文件位置
    //<param name='arg'>当前文件对象</param>
    //<return></return>
    function file_pos(arg) {
        var _pos = 0;
        $.each(file_list, function (_index, _item) {
            if (_item !== undefined && _item.fileName.trim() === arg.fileName.trim()) {
                _pos = _index;
                return true;
            }
        });
        return _pos;
    }
    //
    //重绘
    //<param name='arg'>文件数组</param>
    //<return></return>
    function re_paint(arg) {
        if (arg.length > 0) {
            $("#list_ul").empty();
        }
        $.each(arg, function (_index, _item) {
            var list_box = document.createElement("DIV")
                , _left = document.createElement("IMG")
                , _center = document.createElement("IMG")
                , _right = document.createElement("IMG")
                , _img = document.createElement("IMG")
                , li_item = document.createElement("LI");
            $(list_box).addClass(["list_box"])
                , $(_center).attr({ "src": "../image/delete.svg" }).addClass(["center"]).bind("click", _item, del_file)
                , $(_left).attr({ "src": "../image/Arrow_left.svg" }).addClass(["left"]).bind("click", _item, left_move)
                , $(_right).attr({ "src": "../image/Arrow_right.svg" }).addClass(["right"]).bind("click", _item, right_move)
                , $(_img).attr({ "src": _item.result }).addClass(["file_img"]);
            list_box.append(_left)
                , list_box.append(_center)
                , list_box.append(_right);
            li_item.append(list_box), li_item.append(_img);
            list_ul.append(li_item);
        });
    }
    //
    //文件左移动显示
    //<param name='arg'>当前文件对象</param>
    //<return></return>
    function left_move(arg) {
        var data = arg.data, _temp, _pos = 0, _len = 0;
        _pos = file_pos(data), _len = file_list.length - 1;
        if (!_pos ) {//只有一个、点击第一项【本身替换、首位互换】
            _temp = file_list[_pos];
            file_list[_pos] = file_list[_len], file_list[_len] = _temp;
            //$("#list_ul li:eq(0) .file_img")[0].src = file_list[_len].base64;
            //$("#list_ul li:eq(" + _len + ") .file_img")[0].src = file_list[0].base64;
        }
        else {//中间【上下切换】
            _temp = file_list[_pos];
            file_list[_pos] = file_list[_pos - 1], file_list[_pos - 1] = _temp;
        }
        re_paint(file_list);
    }
    //
    //文件右移动显示
    //<param name='arg'>当前文件对象</param>
    //<return></return>
    function right_move(arg) {
        var data = arg.data, _temp, _pos = 0, _len = 0;
        _pos = file_pos(data), _len = file_list.length - 1;//总长度

        //第一个
        if (!_pos && !_len) {//第一个【本身替换】
            _temp = file_list[0];
            file_list[0] = file_list[_len], file_list[_len] = _temp;
        }
        else if (_pos === _len) //最后一个【头尾替换】
        {
            _temp = file_list[0];
            file_list[0] = file_list[_pos], file_list[_pos] = _temp;
        }
        else//中间【上下切换】
        {
            _temp = file_list[_pos];
            file_list[_pos] = file_list[_pos + 1], file_list[_pos + 1] = _temp;
        }
        re_paint(file_list);
    }

    //文件属性设置
    Files.prototype = {
        init: function () {
            var elem = this;
            //上传文件容器
            var file_box = document.createElement("DIV");
            $(file_box).attr({ id: "file_box" });
            //上传文件
            file_elem = document.createElement("INPUT");
            $(file_elem).attr({ "multiple": true, "type": "file", "id": "file_elem" }).on("change", Porpety.GetFile);
            //展示文件容器
            list_box = $(elem._setting.displayTarget);
            //文件列表
            list_ul = document.createElement("UL");
            $(list_ul).attr({ id: "list_ul" });

            //将各项添加到相应容器里面
            this._elem.append(file_box), file_box.append(file_elem), list_box.append(list_ul);
        },
        size: function () {
            return file_list.length;
        },
        getFormData: function () {
            return formData;
        }
    };
    //选择文件类型对应的图片地址
    var ImgArr = {
        ".xls": "../image/xls.png",
        ".xlsx": "../image/xls.png",
        ".doc": "../image/doc.png",
        ".docx": "../image/doc.png",
        ".txt": "../image/txt.png",
        ".pdf": "../image/pdf.png"
    }, fileName, fileExt;

    //全局属性【相当于类、方法】
    var Porpety = {
        GetFile: function () {
            formData = new FormData();//全局formData【储存文件】
            var nLen = this.files.length;
            for (var i = 0; i < nLen; i++) {
                if (!file_elem['value'].match(/.jpg|.gif|.png|.jpeg|.bmp|.xls|.xlsx|.doc|.docx|.txt|.pdf/i)) {　　 //判断上传文件格式
                    return alert("上传的文件格式不正确，请重新选择");
                }
                //文件加入formData中
                formData.append(i, this.files[i]);
                //文件读取器
                var reader = new FileReader();
                reader.readAsDataURL(this.files[i]); //转成base64
                $.extend(reader, { index: i, fileName: this.files[i].name, files: this.files[i] });//读取器添加文件名称

                reader.onload = function (e) {//读取器加载
                    var imgMsg = {
                        fileName: this.fileName, //RandStr(5), //获取文件名
                        result: this.result //reader.readAsDataURL方法执行完后，base64数据储存在reader.result里
                    };

                    fileExt = this.fileName.substring(this.fileName.indexOf('.')).toLowerCase();//获取文件后缀
                    if (ImgArr[fileExt] !== undefined)//不是图片类型显示默认
                    {
                        imgMsg.result = ImgArr[fileExt];
                    }

                    file_list.push(imgMsg);//文件添加到array里面
                   
                    re_paint(file_list);
                };
            }
        },
        ImageToBase64: function (url, callback, _Formart) {//要很久才能得到base64【不能同步获取】
            //image to base64
            var canvas = document.createElement("CANVAS");//创建一个画布
            var pen = canvas.getContext("2d");
            var _img = new Image();
            var _base64;
            _img.src = url;
            _img.crossOrigin = 'Anonymous';//跨域【所有】
            _img.onload = function () {
                canvas.height = _img.height;
                canvas.width = _img.width;
                pen.drawImage(_img, 0, 0);
                _base64 = canvas.toDataURL(_Formart || 'image/png');
                callback(_base64);
                canvas = null;
            };
          var r= _img.onload;
        }
    };


    $.fn[FilesName] = function (elem, options) {   //向jQuery注册插件
        var e = this;
        e.each(function () {
            $.data(e, "Files_" + FilesName, new Files(this, elem, options));
        });
        return Files.prototype;
    };
    //....封装组件逻辑
})(jQuery, window, document);