/**
 * Created by user on 2015/12/14.
 */

xqsight.nameSpace.reg("cms.ad");

(function () {
    cms.ad.adMain = function () {
        var ctxData = xqsight.utils.getServerPath("cms");

        /**
         * 申明内部对象
         * @type {xqsight.pmpf}
         */
        var obj = this;

        this.adTable = {};

        /** 初始化调用 function **/
        this.init = function () {
            /**  查询 **/
            $(".btn-search").click(function () {
                obj.adTable.ajax.reload();
            });
            $(document).bind("keydown", ".filter input", function (e) {
                var theEvent = window.event || e;
                var code = theEvent.keyCode || theEvent.which;
                if (code == 13) {
                    obj.adTable.ajax.reload();
                }
            });

            /**  重置  **/
            $("#btn-undo").click(function () {
                xqsight.utils.cleanValue(".filter");
            });

            /**  新增 **/
            $("#btn-plus").on("click", obj.plusFun);

            /** 修改 **/
            $("#btn-edit").on("click", obj.editFun);

            /** 删除 **/
            $("#btn-remove").on("click", obj.removeFun);

            obj.loadAdTableFun();
        };


        /**  新增 function **/
        this.plusFun = function () {
            xqsight.win.show("banner新增", "cms/ad/adManage.html", 700, 400,true);
        }

        /**  修改 function **/
        this.editFun = function () {
            var selRows = obj.adTable.rows(".info").data();
            if (selRows.length < 1) {
                xqsight.win.alert("请选择修改的数据");
                return;
            }
            xqsight.win.show("banner修改", "cms/ad/adManage.html?adId=" + selRows[0].adId,700, 400,true);
        }

        /**  删除 function **/
        this.removeFun = function () {
            var selRows = obj.adTable.rows(".info").data();
            if (selRows.length < 1) {
                xqsight.win.alert("请选择修改的数据");
                return;
            }
            xqsight.win.confirm("确认删除吗？", function (btn) {
                if (btn == "yes") {
                    $.ajax({
                        url: ctxData + "/cms/ad/" + selRows[0].adId + "?date=" + new Date().getTime(),
                        method: "delete",
                        success: function (retData) {
                            debugger
                            xqsight.win.alert("删除成功", retData.code);
                            if (retData.code == "0") {
                                obj.adTable.ajax.reload();
                            }
                        }
                    });
                }
            });
        }

        /**  加载数据表 function  **/
        this.loadAdTableFun = function () {
            var record_table = $("#ad-table").DataTable({
                "oLanguage" : { // 汉化
                    sUrl : xqsight.utils.getServerPath("dataTableLocal")
                },
                "bAutoWidth" : false,
                "bFilter" : false,// 搜索栏
                "bLengthChange" : false,// 每行显示记录数
                "iDisplayLength" : 15,// 每页显示行数
                "bSort" : false,
                "bInfo" : true,// Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
                "sPaginationType" : "full_numbers", // 分页，一共两种样式 另一种为two_button // 是datatables默认
                "bServerSide" : true,
                "sAjaxSource": ctxData + '/cms/ad/page?filter_EQI_type=1',
                "fnServerData": function (sUrl, aoData, fnCallback) {
                    $.ajax({
                        url : sUrl,
                        method : "get",
                        data : aoData,
                        success : function(data){
                            fnCallback(data);
                            //渲染结束重新设置高度
                            parent.xqsight.common.setIframeHeight($.getUrlParam(xqsight.iframeId));
                        }
                    });
                },
                "fnServerParams": function (aoData) {
                    aoData.push(
                        {"name": "adName", "value": $("#adName").val()}
                    );
                },
                "aoColumnDefs": [
                    {
                        sDefaultContent: '',
                        aTargets: ['_all']
                    }
                ],
                "aoColumns": [{
                    data: "adId",
                    sWidth: "2",
                    render: function (value) {
                        return '<label class="pos-rel"><input id="' + value + '" type="checkbox" class="ace" /><span class="lbl"></span></label>';
                    }
                }, {
                    data: "adName",
                    sWidth: "100",
                    sClass: "text-center"
                }, {
                    data: "adImage",
                    sWidth: "60",
                    sClass: "text-center",
                    render: function (value) {
                        return '<a href="javascript:void(0);" onclick="xqsight.win.imgShow(\'' + value + '\')">查看</a>';
                    }
                }, {
                    data: "sort",
                    sWidth: "80",
                    sClass: "text-center"
                }, {
                    data: "adId",
                    sWidth: "80",
                    sClass: "text-center",
                    render: function () {
                        return "<div class='bolder'> <a class='red' href='javaScript:adMain.editFun()'><i class='ace-icon fa fa-edit'></i></a> | " +
                            "<a class='red' href='javaScript:adMain.removeFun()'><i class='ace-icon fa fa-remove'></i></a></div> ";
                    }
                }]
            });

            obj.adTable = record_table;

            //单选事件
            $("#ad-table tbody").on("click", "tr", function () {
                $.each($("#ad-table tbody").find("input[type='checkbox']"), function (index, object) {
                    object.checked = false;
                });
                $(this).find("input[type='checkbox']").get(0).checked = true;
                $("#ad-table>tbody>tr").removeClass("info");
                $(this).addClass("info");
            });

            $("#ad-table tbody").on("dblclick", "tr", function () {
                obj.editFun();
            });
        }


        /** 新增编辑回调函数 **/
        this.editCallBackFun = function (params) {
            //加载数据
            obj.adTable.ajax.reload();
            if (params.adId == undefined || params.adId == "") {
                return;
            }
            //选中之前选中的数据
        }
    };

    /** 初始化数据 **/
    $(document).ready(function () {
        adMain.init();
    });
})();
var adMain = new cms.ad.adMain();





