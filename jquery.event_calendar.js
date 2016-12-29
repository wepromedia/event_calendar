;(function ($, window, undefined) {
    'use strict';
    var methods = {
        init: function (opt) {
            return this.each(function(e,v){
                var id = $(".event_calendar_container").length + 1;
                $(this).attr("data-calendar-id",id);
                $(this).attr("id","calendar_id_"+id);
                var options = $.extend( {
                    'api' : ['./json/calendar.json'],
                    'week': ["日","月","火","水","木","金","土"],
                    'width':"100%",
                    'target_obj':false,
                    'calender_icon':true,
                    'target_click':true,
                    'id':id
                }, opt);
                var $this = $(this),
                    data = $this.data('option',options);
                createCalendarContainer(this,options);
                optionBindEvent($this,options);

            });
        },
        getOption: function (obj) {
            if(obj){
                var $this = $(obj);
            }else{
                var $this = $(this);
            }
            return $this.data("option");
        },
        setOption: function (opt,obj) {
            if(obj){
                var $this = $(obj);
            }else{
                var $this = $(this);
            }
            return $this.each(function(e,v){
                var options = $.extend($(this).data("option"),opt);
                var $this = $(this),
                    data = $this.data('option',options);
            });
        },
        open: function (obj) {
            if(obj){
                var $this = $(obj);
            }else{
                var $this = $(this);
            }
            var opt = methods.getOption($this);
            var default_date = "";
            if(opt.target_obj && $(opt.target_obj)){
                var target_contents = __getTargetContents(opt.target_obj);
                if(Date.parse(target_contents)){
                    default_date = new Date(target_contents);
                    __setTargetContents(opt.target_obj,default_date);
                }
            }
            if(default_date == ""){
                default_date = new Date();
            }
            createCalendar($this,opt,default_date);
            $this.find(".event_calendar_container").addClass("open");
            $this.find(".event_calendar_icon").addClass("on");
            return this;
        },
        close:function (obj) {
            if(obj){
                var $this = $(obj);
            }else{
                var $this = $(this);
            }
            methods.setOption({"now_month":false},$this);
            $this.find(".event_calendar_container").fadeOut();
            $this.find(".event_calendar_container").removeClass("open");
            $this.find(".event_calendar_icon").removeClass("on");
        },
        destroy:function (){

        }
    };
    var optionBindEvent = function($this,options){
        $(document).on('mousedown', function(evt){
            if($this.find(".event_calendar_container").hasClass("open") == false){
                return true;
            }
            var c = $(evt.target).closest(".event_calendar_container").length;
            var t = $(evt.target).closest(options.target_obj).length;
            var i = $(evt.target).closest(".event_calendar_icon").length;
            if(options.target_obj && options.target_click && options.calender_icon){
                if(((!c) && (options.calender_icon && !i) && (options.target_obj && options.target_click && !t))){
                    methods.close($this);
                }
            }else if((!c) && (options.calender_icon && !i)){
                methods.close($this);
            }else if ((!c) && (options.target_obj && options.target_click && !t)){
                methods.close($this);
            }
        });

        if(options.target_obj && options.target_click){
            $(document).on("focus",options.target_obj,function(){
                methods.open($this);
            });
        }
        if(options.calender_icon){
            $(document).on("mouseup","#calendar_id_"+options.id+" .event_calendar_icon",function(evt){
                if($(this).hasClass("on")){
                    methods.close($(this).parent());
                }else{
                    methods.open($(this).parent());
                }
            });
        }



    };
    /*--------------------------------------------------
     Calendar Container Create - カレンダーのベースを作成する
     --------------------------------------------------*/
    var createCalendarContainer = function(obj,options){
        var $obj = $(obj);
        if(options.calender_icon){
            $obj.append('<a href="javascript:void(0);" class="event_calendar_icon"></a>');
        }
        var html = '<div class="event_calendar_container">';
        html += '<div class="event_calendar_bg"></div>';
        html += '<div class="event_calendar_container_inner">';
        html += '<div class="event_calendar_header">';
        html += '<div class="event_calendar_header_prev_btn"><a href="javascript:void(0);">&lt;</a></div>';//prev
        html += '<div class="event_calendar_header_title">2016年12月</div>';//title
        html += '<div class="event_calendar_header_next_btn"><a href="javascript:void(0);">&gt;</a></div>';//next
        html += '</div>';
        html += '<div class="event_calendar_body">';
        html += '<table class="event_calendar_table">';
        html += '</table>';
        html += '</div>';
        html += '<div class="event_calendar_result"></div>';
        html += '<div class="copyright">Event Calendar by Wepromedia Original</div>';
        html += '</div></div>';
        $obj.append(html);
        $obj.find(".event_calendar_container_inner").css({"width":options.width});
    };
    /*--------------------------------------------------
     Calendar Create - カレンダーを作成する。
     --------------------------------------------------*/
    var createCalendar = function(obj,options,date){
        var $obj = $(obj);
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        var format_month = year +"-" + ( '00' + month ).slice( -2 );
        var s = new Date(year,month-1,1);//開始日
        var t = new Date(year,month,0);//末尾
        var last_day = t.getDate();
        var start_week = s.getDay();
        var row_limit = Math.ceil((last_day + start_week) / 7);
        var html = '<tr>';
        //曜日
        for(i=0;i<7;i++){
            html += '<th>' + options.week[i] + '</th>';
        }
        html += '</tr><tr>';
        var count_date = 1;
        // 最初の空白を出力
        for (var i = 0; i < start_week; i++) {
            html += '<td class="calendar_none">&nbsp;</td>';
        }
        for (var row = 0; row < row_limit; row++) {
            if (row == 0) {
                for (var col = start_week; col < 7; col++) {
                    html += createTableTd(count_date,format_month,options);
                    count_date++;
                }
            } else {
                html += '<tr>';
                for (var col = 0; col < 7; col++) {
                    if (last_day >= count_date) {
                        html += createTableTd(count_date,format_month,options);
                    } else {
                        html += '<td class="calendar_none">&nbsp;</td>';
                    }
                    count_date++;
                }
            }
            html += '</tr>';
        }
        methods.setOption({"now_month":format_month},obj);

        $obj.find(".event_calendar_header_title").html(format_month);
        $obj.find(".event_calendar_table").empty();
        $obj.find(".event_calendar_result").empty();
        $obj.find(".event_calendar_table").append(html);
        getEventList(obj,options,date);
        $obj.find(".event_calendar_container").fadeIn();
    };
    var createTableTd = function(count_date,format_month,options){//TDの中身
        var format_date = format_month + "-" + ( '00' + count_date ).slice( -2 );
        if(options.target_obj){
            var get_contents = __getTargetContents(options.target_obj);
            if(get_contents == format_date){
                var tmp = "now";
            }
        }

        var td = '<td data-calendar_date="'+format_date+'" class="'+tmp+'"><div class="calendar_date">'+count_date+'</div><div class="calendar_event"></div></td>';
        return td;
    };
    /*--------------------------------------------------
     イベントを取得する
     --------------------------------------------------*/
    var getEventList = function(obj,options,date){
        var $obj = $(obj);
        var month = date.getMonth()+1;
        var data = {"date":date.getFullYear() +"-" + ( '00' + month ).slice( -2 )};
        if(!Array.isArray(options.api)){
            options.api = [options.api];
        }
        $.each(options.api,function(key,url){
            $.ajax({
                url: url,
                type: "post",
                data: data,
                timeout: 10000,
                dataType: "json",
                success: function(result, textStatus, xhr) {
                    if(result.length > 0){
                        $.each(result,function(e,v){
                            if(v.date == undefined || v.title == undefined){
                                return true;
                            }
                            var day = new Date(v.date);
                            var mon = day.getMonth()+1;
                            var dy = day.getDate();
                            var check_date = day.getFullYear() +"-" + ( '00' + mon ).slice( -2 ) + "-" + ( '00' + dy ).slice( -2 );
                            if($obj.find("td[data-calendar_date='"+check_date+"'] .calendar_event").length == 0){
                                return true;
                            }
                            var html = '<span class="event_icon"></span>';
                            $obj.find("td[data-calendar_date='"+check_date+"'] .calendar_event").append(html);
                            if($obj.find(".event_calendar_result .calendar_event_detail[data-calendar_date='"+check_date+"']").length == 0){
                                $obj.find(".event_calendar_result").append('<div class="calendar_event_detail" data-calendar_date="'+check_date+'"><ul></ul></div>');
                            }
                            if(v.time == undefined){
                                var date_set = v.date;
                            }else{
                                var date_set = v.date + " " + v.time;
                            }
                            var html = '<li><div class="event_date">'+ date_set + '</div><div class="event_title">' + v.title +'</div></li>';
                            $obj.find(".calendar_event_detail[data-calendar_date='"+check_date+"'] ul").append(html);
                        });
                    }
                },
                error: function(xhr, textStatus, error) {
                    console.log(result);
                }
            });
        });

    };
    /*--------------------------------------------------
     カレンダーのマウスイベント - 月移動
     --------------------------------------------------*/
    $(document).on("click", ".event_calendar_header_prev_btn a", function(e) {
        var $obj = $(this).parents(".event_calendar_container").parent();
        var options = methods.getOption($obj);
        var prev_month = new Date(options.now_month);
        prev_month.setMonth(prev_month.getMonth() - 1);
        createCalendar($obj,options,prev_month);
    });
    $(document).on("click", ".event_calendar_header_next_btn a", function(e) {
        var $obj = $(this).parents(".event_calendar_container").parent();
        var options = methods.getOption($obj);
        var next_month = new Date(options.now_month);
        next_month.setMonth(next_month.getMonth() + 1);
        createCalendar($obj,options,next_month);
    });
    /*--------------------------------------------------
     カレンダーのマウスイベント - hover
     --------------------------------------------------*/
    $(document).on("mouseenter", ".event_calendar_table td", function(e) {
        var date = $(this).attr("data-calendar_date");
        var $obj = $(this).parents(".event_calendar_container").parent();
        if($obj.find(".calendar_event_detail[data-calendar_date='"+date+"']").length != 0){
            $obj.find(".calendar_event_detail[data-calendar_date='"+date+"']").slideDown();
        }
    });
    $(document).on("mouseleave", ".event_calendar_table td", function(e) {
        var date = $(this).attr("data-calendar_date");
        var $obj = $(this).parents(".event_calendar_container").parent();
        if($obj.find(".calendar_event_detail[data-calendar_date='"+date+"']").length != 0){
            $obj.find(".calendar_event_detail[data-calendar_date='"+date+"']").slideUp();
        }
    });
    /*--------------------------------------------------
     カレンダーのマウスイベント - click
     --------------------------------------------------*/
    $(document).on("click", ".event_calendar_table td", function(e) {
        var date = $(this).attr("data-calendar_date");
        var $obj = $(this).parents(".event_calendar_container").parent();
        if(date !== undefined){
            var options = methods.getOption($obj);
            var day = new Date(date);
            __setTargetContents(options.target_obj,day);
        }
        methods.close($obj);
    });
    /*--------------------------------------------------
     既存の値を取得する
     --------------------------------------------------*/
    var __getTargetContents = function(obj){
        var tag = $(obj).prop("tagName");
        if(tag == "INPUT" || tag == "TEXTAREA"){
            return $(obj).val();
        }else{
            return $(obj).text();
        }
    };
    /*--------------------------------------------------
     既存値を設定する
     --------------------------------------------------*/
    var __setTargetContents = function(obj,date){
        var month = date.getMonth()+1;
        var date_format = date.getFullYear() +"-" + ( '00' + month ).slice( -2 ) + "-" + ( '00' + date.getDate() ).slice( -2 );
        var tag = $(obj).prop("tagName");
        if(tag == "INPUT" || tag == "TEXTAREA"){
            return $(obj).val(date_format);
        }else{
            return $(obj).text(date_format);
        }
    };

    $.fn.eventCalendar = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }

    };


})(jQuery);
