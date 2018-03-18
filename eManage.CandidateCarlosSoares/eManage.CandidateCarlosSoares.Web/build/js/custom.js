/**
 * Resize function without multiple trigger
 * 
 * Usage:
 * $(window).smartresize(function(){  
 *     // code here
 * });
 */
(function($,sr){
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
      var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args); 
                timeout = null; 
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100); 
        };
    };

    // smartresize 
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');

// Sidebar
function init_sidebar() {
    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function () {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.outerHeight(),
            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight;

        $RIGHT_COL.css('min-height', contentHeight);
    };

    $SIDEBAR_MENU.find('a').on('click', function (ev) {
        //console.log('clicked - sidebar_menu');
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function () {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            } else {
                if ($BODY.is(".nav-sm")) {
                    $SIDEBAR_MENU.find("li").removeClass("active active-sm");
                    $SIDEBAR_MENU.find("li ul").slideUp();
                }
            }
            $li.addClass('active');

            $('ul:first', $li).slideDown(function () {
                setContentHeight();
            });
        }
    });

    // toggle small or large menu 
    $MENU_TOGGLE.on('click', function () {
        console.log('clicked - menu toggle');

        if ($BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li.active ul').hide();
            $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
        } else {
            $SIDEBAR_MENU.find('li.active-sm ul').show();
            $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
        }

        $BODY.toggleClass('nav-md nav-sm');

        setContentHeight();
    });

    // check active menu
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

    $SIDEBAR_MENU.find('a').filter(function () {
        return this.href == CURRENT_URL;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
        setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    //$(window).smartresize(function () {
    //    setContentHeight();
    //});

    setContentHeight();

    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel: { preventDefault: true }
        });
    }
};
// /Sidebar


function init_DataTables() {

    //console.log('run_datatables');

    if (typeof ($.fn.DataTable) === 'undefined') { return; }
    //console.log('init_DataTables');

    var handleDataTableButtons = function () {
        if ($("#datatable-buttons").length) {
            $("#datatable-buttons").DataTable({
                dom: "Bfrtip",
                buttons: [
                  {
                      extend: "copy",
                      className: "btn-sm"
                  },
                  {
                      extend: "csv",
                      className: "btn-sm"
                  },
                  {
                      extend: "excel",
                      className: "btn-sm"
                  },
                  {
                      extend: "pdfHtml5",
                      className: "btn-sm"
                  },
                  {
                      extend: "print",
                      className: "btn-sm"
                  },
                ],
                responsive: true
            });
        }
    };

    TableManageButtons = function () {
        "use strict";
        return {
            init: function () {
                handleDataTableButtons();
            }
        };
    }();

    $('#datatable').dataTable();

    $('#datatable-keytable').DataTable({
        keys: true
    });

    $('#datatable-responsive').DataTable();

    $('#datatable-scroller').DataTable({
        ajax: "js/datatables/json/scroller-demo.json",
        deferRender: true,
        scrollY: 380,
        scrollCollapse: true,
        scroller: true
    });

    $('#datatable-fixed-header').DataTable({
        fixedHeader: true
    });

    var $datatable = $('#datatable-checkbox');

    $datatable.dataTable({
        'order': [[1, 'asc']],
        'columnDefs': [
          { orderable: false, targets: [0] }
        ]
    });
    $datatable.on('draw.dt', function () {
        $('checkbox input').iCheck({
            checkboxClass: 'icheckbox_flat-green'
        });
    });

    TableManageButtons.init();

};

function init_IonRangeSlider() {

    if (typeof ($.fn.ionRangeSlider) === 'undefined') { return; }
    //console.log('init_IonRangeSlider');

    $("#range_27").ionRangeSlider({
        type: "double",
        min: 1000000,
        max: 2000000,
        grid: true,
        force_edges: true
    });
    $("#range").ionRangeSlider({
        hide_min_max: true,
        keyboard: true,
        min: 0,
        max: 5000,
        from: 1000,
        to: 4000,
        type: 'double',
        step: 1,
        prefix: "$",
        grid: true
    });
    $("#range_25").ionRangeSlider({
        type: "double",
        min: 1000000,
        max: 2000000,
        grid: true
    });
    $("#range_26").ionRangeSlider({
        type: "double",
        min: 0,
        max: 10000,
        step: 500,
        grid: true,
        grid_snap: true
    });
    $("#range_31").ionRangeSlider({
        type: "double",
        min: 0,
        max: 100,
        from: 30,
        to: 70,
        from_fixed: true
    });
    $(".range_min_max").ionRangeSlider({
        type: "double",
        min: 0,
        max: 100,
        from: 30,
        to: 70,
        max_interval: 50
    });

    //$(".range_time24").ionRangeSlider({
    //    min: +moment().subtract(12, "hours").format("X"),
    //    max: +moment().format("X"),
    //    from: +moment().subtract(6, "hours").format("X"),
    //    grid: true,
    //    force_edges: true,
    //    prettify: function (num) {
    //        var m = moment(num, "X");
    //        return m.format("Do MMMM, HH:mm");
    //    }
    //});

};

	var randNum = function() {
	  return (Math.floor(Math.random() * (1 + 40 - 20))) + 20;
	};


// Panel toolbox
$(document).ready(function() {
    $('.collapse-link').on('click', function() {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');
        
        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function(){
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200); 
            $BOX_PANEL.css('height', 'auto');  
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});
// /Panel toolbox

// Tooltip
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});
// /Tooltip

// Progressbar
if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar();
}
// /Progressbar

// Switchery
$(document).ready(function() {
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });
    }
});
// /Switchery


// iCheck
$(document).ready(function() {
    if ($("input.flat")[0]) {
        $(document).ready(function () {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        });
    }
});
// /iCheck

// Table
$('table input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('table input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});

var checkState = '';

$('.bulk_action input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
    checkState = 'all';
    countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
    checkState = 'none';
    countChecked();
});

function countChecked() {
    if (checkState === 'all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (checkState === 'none') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }

    var checkCount = $(".bulk_action input[name='table_records']:checked").length;

    if (checkCount) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(checkCount + ' Records Selected');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}



// Accordion
$(document).ready(function() {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).load(function () {
        NProgress.done();
    });
}

	
	  //hover and retain popover when on popover content
        var originalLeave = $.fn.popover.Constructor.prototype.leave;
        $.fn.popover.Constructor.prototype.leave = function(obj) {
          var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
          var container, timeout;

          originalLeave.call(this, obj);

          if (obj.currentTarget) {
            container = $(obj.currentTarget).siblings('.popover');
            timeout = self.timeout;
            container.one('mouseenter', function() {
              //We entered the actual popover – call off the dogs
              clearTimeout(timeout);
              //Let's monitor popover content instead
              container.one('mouseleave', function() {
                $.fn.popover.Constructor.prototype.leave.call(self, self);
              });
            });
          }
        };

        $('body').popover({
          selector: '[data-popover]',
          trigger: 'click hover',
          delay: {
            show: 50,
            hide: 400
          }
        });


	function gd(year, month, day) {
		return new Date(year, month - 1, day).getTime();
	}
	  
		function init_charts() {
			
				//console.log('run_charts  typeof [' + typeof (Chart) + ']');
			
				if( typeof (Chart) === 'undefined'){ return; }
				
				//console.log('init_charts');
			
				
				Chart.defaults.global.legend = {
					enabled: false
				};
				

			// Bar chart
			  
			if ($('#mybarChart').length ){ 
			  
			  var ctx = document.getElementById("mybarChart");
			  var mybarChart = new Chart(ctx, {
				type: 'bar',
				data: {
				  labels: ["January", "February", "March", "April", "May", "June", "July"],
				  datasets: [{
					label: '# of Votes',
					backgroundColor: "#26B99A",
					data: [51, 30, 40, 28, 92, 50, 45]
				  }, {
					label: '# of Votes',
					backgroundColor: "#03586A",
					data: [41, 56, 25, 48, 72, 34, 12]
				  }]
				},

				options: {
				  scales: {
					yAxes: [{
					  ticks: {
						beginAtZero: true
					  }
					}]
				  }
				}
			  });
			  
			} 
			  
			  
			if($("#chartEnvioDisco").length){
				var f=document.getElementById("chartEnvioDisco");new Chart(f,{type:"bar",data:{labels:["January"],datasets:[{label:"# Total de registros",backgroundColor:"#26B99A",data:[200]},{label:"# Registros com erro",backgroundColor:"#B22222",data:[41]}]},options:{scales:{yAxes:[{ticks:{beginAtZero:!0}}]}}})
								
			}
			
		}

        function createChartBar(idProcess, objId, pendentes, erros, alertas, emExecucao){
            if ($('#'+objId).length ){
			    var ctx = document.getElementById(objId);
			    var myBarChart = new Chart(ctx, {
				    type: 'bar',
				    data: {
				        labels: [""],
				        datasets: [{
					        label: '# Pendentes',
					        backgroundColor: "#26B99A",
					        data: [pendentes]
				        }, {
				            label: '# Alertas',
				            backgroundColor: "#FFFF00",
				            data: [alertas]
				        }, {
					        label: '# Erros',
					        backgroundColor: "#FF0000",
					        data: [erros]
				        }]
				    },
				    events: ["click"],

				    options: {
				        scales: {
					    yAxes: [{
					        ticks: {
						    beginAtZero: true
					        }
					    }]
				        }
				    },

			    });
			    
			    $('#' + objId).click(function (e) {
			        var activeBars = myBarChart.getElementAtEvent(e);			        
			        var typeBar = "";
			        try{
			            typeBar = activeBars[0]._model.datasetLabel;
			        }
			        catch(ex){
			            typeBar = "# Erros";
			        }

			        typeBar = typeBar.replace(/# /, '');
			        var path = window.location.origin + window.location.pathname;
			        path = path.replace('Home/Index', '');
			        window.location = path + "Home/Details?process=" + idProcess + "&type=" + typeBar;
                    //window.location = window.location.origin + window.location.pathname + "Home/Ops";

			        //alert(typeBar);
			    });
			    
	        } 
			
        }

        function handleClick(evt) {
            //var chart = document.getElementById(objId);
            var activeElement = this.getElementAtEvent(evt);
            alert('teste');
        }

		function init_echarts(p, m, r) {

		    p = typeof p !== 'undefined' ? p : 0;
		    m = typeof m !== 'undefined' ? m : 0;
		    r = typeof r !== 'undefined' ? r : 0;
		
		    if( typeof (echarts) === 'undefined'){ return; }
		    //console.log('init_echarts');
			
		
				  var theme = {
				  color: [
					  '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
					  '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
				  ],

				  title: {
					  itemGap: 8,
					  textStyle: {
						  fontWeight: 'normal',
						  color: '#408829'
					  }
				  },

				  dataRange: {
					  color: ['#1f610a', '#97b58d']
				  },

				  toolbox: {
					  color: ['#408829', '#408829', '#408829', '#408829']
				  },

				  tooltip: {
					  backgroundColor: 'rgba(0,0,0,0.5)',
					  axisPointer: {
						  type: 'line',
						  lineStyle: {
							  color: '#408829',
							  type: 'dashed'
						  },
						  crossStyle: {
							  color: '#408829'
						  },
						  shadowStyle: {
							  color: 'rgba(200,200,200,0.3)'
						  }
					  }
				  },

				  dataZoom: {
					  dataBackgroundColor: '#eee',
					  fillerColor: 'rgba(64,136,41,0.2)',
					  handleColor: '#408829'
				  },
				  grid: {
					  borderWidth: 0
				  },

				  categoryAxis: {
					  axisLine: {
						  lineStyle: {
							  color: '#408829'
						  }
					  },
					  splitLine: {
						  lineStyle: {
							  color: ['#eee']
						  }
					  }
				  },

				  valueAxis: {
					  axisLine: {
						  lineStyle: {
							  color: '#408829'
						  }
					  },
					  splitArea: {
						  show: true,
						  areaStyle: {
							  color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
						  }
					  },
					  splitLine: {
						  lineStyle: {
							  color: ['#eee']
						  }
					  }
				  },
				  timeline: {
					  lineStyle: {
						  color: '#408829'
					  },
					  controlStyle: {
						  normal: {color: '#408829'},
						  emphasis: {color: '#408829'}
					  }
				  },

				  k: {
					  itemStyle: {
						  normal: {
							  color: '#68a54a',
							  color0: '#a9cba2',
							  lineStyle: {
								  width: 1,
								  color: '#408829',
								  color0: '#86b379'
							  }
						  }
					  }
				  },
				  map: {
					  itemStyle: {
						  normal: {
							  areaStyle: {
								  color: '#ddd'
							  },
							  label: {
								  textStyle: {
									  color: '#c12e34'
								  }
							  }
						  },
						  emphasis: {
							  areaStyle: {
								  color: '#99d2dd'
							  },
							  label: {
								  textStyle: {
									  color: '#c12e34'
								  }
							  }
						  }
					  }
				  },
				  force: {
					  itemStyle: {
						  normal: {
							  linkStyle: {
								  strokeColor: '#408829'
							  }
						  }
					  }
				  },
				  chord: {
					  padding: 4,
					  itemStyle: {
						  normal: {
							  lineStyle: {
								  width: 1,
								  color: 'rgba(128, 128, 128, 0.5)'
							  },
							  chordStyle: {
								  lineStyle: {
									  width: 1,
									  color: 'rgba(128, 128, 128, 0.5)'
								  }
							  }
						  },
						  emphasis: {
							  lineStyle: {
								  width: 1,
								  color: 'rgba(128, 128, 128, 0.5)'
							  },
							  chordStyle: {
								  lineStyle: {
									  width: 1,
									  color: 'rgba(128, 128, 128, 0.5)'
								  }
							  }
						  }
					  }
				  },
				  gauge: {
					  startAngle: 225,
					  endAngle: -45,
					  axisLine: {
						  show: true,
						  lineStyle: {
							  color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
							  width: 8
						  }
					  },
					  axisTick: {
						  splitNumber: 10,
						  length: 12,
						  lineStyle: {
							  color: 'auto'
						  }
					  },
					  axisLabel: {
						  textStyle: {
							  color: 'auto'
						  }
					  },
					  splitLine: {
						  length: 18,
						  lineStyle: {
							  color: 'auto'
						  }
					  },
					  pointer: {
						  length: '90%',
						  color: 'auto'
					  },
					  title: {
						  textStyle: {
							  color: '#333'
						  }
					  },
					  detail: {
						  textStyle: {
							  color: 'auto'
						  }
					  }
				  },
				  textStyle: {
					  fontFamily: 'Arial, Verdana, sans-serif'
				  }
			  };

			   
			  
			   //echart Gauge
			  
			if ($('#echartProcessamento').length) {
			  
				var echartGauge = echarts.init(document.getElementById('echartProcessamento'), theme);

			  echartGauge.setOption({
				tooltip: {
				  formatter: "{a} <br/>{b} : {c}%"
				},
				series: [{
				  name: 'Processamento',
				  type: 'gauge',
				  center: ['50%', '50%'],
				  startAngle: 140,
				  endAngle: -140,
				  min: 0,
				  max: 100,
				  precision: 0,
				  splitNumber: 10,
				  axisLine: {
					show: true,
					lineStyle: {
					  color: [
						[0.2, 'lightgreen'],
						[0.4, 'orange'],
						[0.8, 'skyblue'],
						[1, '#ff4500']
					  ],
					  width: 30
					}
				  },
				  axisTick: {
					show: true,
					splitNumber: 5,
					length: 8,
					lineStyle: {
					  color: '#eee',
					  width: 1,
					  type: 'solid'
					}
				  },
				  axisLabel: {
					show: true,
					formatter: function(v) {
					  switch (v + '') {
						case '10':
						  return '';
						case '30':
						  return '';
						case '60':
						  return '';
						case '90':
						  return '';
						default:
						  return '';
					  }
					},
					textStyle: {
					  color: '#333'
					}
				  },
				  splitLine: {
					show: true,
					length: 30,
					lineStyle: {
					  color: '#eee',
					  width: 2,
					  type: 'solid'
					}
				  },
				  pointer: {
					length: '80%',
					width: 8,
					color: 'auto'
				  },
				  title: {
					show: true,
					offsetCenter: ['-65%', -10],
					textStyle: {
					  color: '#333',
					  fontSize: 15
					}
				  },
				  detail: {
					show: true,
					backgroundColor: 'rgba(0,0,0,0)',
					borderWidth: 0,
					borderColor: '#ccc',
					width: 100,
					height: 40,
					offsetCenter: ['-60%', 10],
					formatter: '{value}%',
					textStyle: {
					  color: 'auto',
					  fontSize: 30
					}
				  },
				  data: [
				  {
					value: p,
					name: 'Processamento'
				  }
				  ]
				}]
			  });

			}  
			   
			if ($('#echartMemoria').length) {

			    var echartGauge = echarts.init(document.getElementById('echartMemoria'), theme);

			    echartGauge.setOption({
			        tooltip: {
			            formatter: "{a} <br/>{b} : {c}%"
			        },			        
			        series: [{
			            name: 'Memoria',
			            type: 'gauge',
			            center: ['50%', '50%'],
			            startAngle: 140,
			            endAngle: -140,
			            min: 0,
			            max: 100,
			            precision: 0,
			            splitNumber: 10,
			            axisLine: {
			                show: true,
			                lineStyle: {
			                    color: [
                                  [0.2, 'lightgreen'],
                                  [0.4, 'orange'],
                                  [0.8, 'skyblue'],
                                  [1, '#ff4500']
			                    ],
			                    width: 30
			                }
			            },
			            axisTick: {
			                show: true,
			                splitNumber: 5,
			                length: 8,
			                lineStyle: {
			                    color: '#eee',
			                    width: 1,
			                    type: 'solid'
			                }
			            },
			            axisLabel: {
			                show: true,
			                formatter: function (v) {
			                    switch (v + '') {
			                        case '10':
			                            return '';
			                        case '30':
			                            return '';
			                        case '60':
			                            return '';
			                        case '90':
			                            return '';
			                        default:
			                            return '';
			                    }
			                },
			                textStyle: {
			                    color: '#333'
			                }
			            },
			            splitLine: {
			                show: true,
			                length: 30,
			                lineStyle: {
			                    color: '#eee',
			                    width: 2,
			                    type: 'solid'
			                }
			            },
			            pointer: {
			                length: '80%',
			                width: 8,
			                color: 'auto'
			            },
			            title: {
			                show: true,
			                offsetCenter: ['-65%', -10],
			                textStyle: {
			                    color: '#333',
			                    fontSize: 15
			                }
			            },
			            detail: {
			                show: true,
			                backgroundColor: 'rgba(0,0,0,0)',
			                borderWidth: 0,
			                borderColor: '#ccc',
			                width: 100,
			                height: 40,
			                offsetCenter: ['-60%', 10],
			                formatter: '{value}%',
			                textStyle: {
			                    color: 'auto',
			                    fontSize: 30
			                }
			            },
			            data: [
                        {
                            value: m,
                            name: 'Memoria'
                        }
			            ]
			        }]
			    });

			}

		}  
	   
	   
	$(document).ready(function() {
	    init_charts();
	    init_sidebar();
	    init_DataTables();
	    init_IonRangeSlider();
	    //init_echarts();
        
	});	
	

	//var btnCust = '<button type="button" class="btn btn-secondary" title="Add picture tags" ' +
    //'onclick="alert(\'Call your custom code here.\')">' +
    //'<i class="glyphicon glyphicon-tag"></i>' +
    //'</button>';
//	var btnCust = '';
//	$(".UploadFileAvatar").fileinput({
//	    overwriteInitial: true,
//	    maxFileSize: 1500,
//	    showClose: false,
//	    showCaption: false,
//	    browseLabel: '',
//	    removeLabel: '',
//	    browseIcon: '<i class="glyphicon glyphicon-folder-open"></i>',
//	    removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
//	    removeTitle: 'Cancel or reset changes',
//	    elErrorContainer: '#kv-avatar-errors-1',
//	    msgErrorClass: 'alert alert-block alert-danger',
//	    defaultPreviewContent: '<img src="/images/default_avatar.png" alt="Your Avatar">',
//	    layoutTemplates: { main2: '{preview} ' + btnCust + ' {remove} {browse}' },
//	    allowedFileExtensions: ["jpg", "png", "gif"]
//});

	//var btnCust = '';//'<button type="button" class="btn btn-secondary" title="Add picture tags" ' +
    //    //'onclick="alert(\'Call your custom code here.\')">' +
    //    //'<i class="glyphicon glyphicon-tag"></i>' +
    //    //'</button>'; 
	//$("#avatar-1").fileinput({
	//    overwriteInitial: true,
	//    maxFileSize: 1500,
	//    showClose: false,
	//    showCaption: false,
	//    showBrowse: false,
	//    browseOnZoneClick: true,
	//    removeLabel: '',
	//    removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
	//    removeTitle: 'Cancel or reset changes',
	//    elErrorContainer: '#kv-avatar-errors-2',
	//    msgErrorClass: 'alert alert-block alert-danger',
	//    defaultPreviewContent: '<img src="/Images/default_avatar_male.jpg" alt="Your Avatar"><h6 class="text-muted">Click to select</h6>',
	//    layoutTemplates: {main2: '{preview} ' +  btnCust + ' {remove} {browse}'},
	//    allowedFileExtensions: ["jpg", "png", "gif"]
	//});

	// confirmation
	//$('.example-p-2').on('click', function () {
	//    $.confirm({
	//        title: 'A secure action',
	//        content: 'Its smooth to do multiple confirms at a time. <br> Click confirm or cancel for another modal',
	//        icon: 'fa fa-question-circle',
	//        animation: 'scale',
	//        closeAnimation: 'scale',
	//        opacity: 0.5,
	//        buttons: {
	//            'confirm': {
	//                text: 'Proceed',
	//                btnClass: 'btn-blue',
	//                action: function () {
	//                    $.confirm({
	//                        title: 'This maybe critical',
	//                        content: 'Critical actions can have multiple confirmations like this one.',
	//                        icon: 'fa fa-warning',
	//                        animation: 'scale',
	//                        closeAnimation: 'zoom',
	//                        buttons: {
	//                            confirm: {
	//                                text: 'Yes, sure!',
	//                                btnClass: 'btn-orange',
	//                                action: function () {
	//                                    $.alert('A very critical action <strong>triggered!</strong>');
	//                                }
	//                            },
	//                            cancel: function () {
	//                                $.alert('you clicked on <strong>cancel</strong>');
	//                            }
	//                        }
	//                    });
	//                }
	//            },
	//            cancel: function () {
	//                $.alert('you clicked on <strong>cancel</strong>');
	//            },
	//            moreButtons: {
	//                text: 'something else',
	//                action: function () {
	//                    $.alert('you clicked on <strong>something else</strong>');
	//                }
	//            },
	//        }
	//    });
	//});