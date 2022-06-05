$(document).ready(function () {
    $("#loader").hide();
    $("#btnExcel").hide();
    $("#btnPdf").hide();
    var ModelName = document.getElementById("txtModelName");
    var BarCode = document.getElementById("txtBarCode");
    var BrandName = document.getElementById("drpBrandName");
    var Category = document.getElementById("drpCategory");
    var Description = document.getElementById("txtDesc");
    // Execute a function when the user releases a key on the keyboard
    ModelName.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("btnSearch").click();
        }
    });
    BarCode.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("btnSearch").click();
        }
    });
    BrandName.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("btnSearch").click();
        }
    });
    Category.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("btnSearch").click();
        }
    });
    Description.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("btnSearch").click();
        }
    });
});
var Listt = []
function SearchView() {
    var html = '';
    $("#loader").show();
    var ModelName = $("#txtModelName").val();
    var BarCocde = $("#txtBarCode").val();
    var BrandName = $("#drpBrandName").val();
    var Category = $("#drpCategory").val();
    var Description = $("#txtDesc").val();
    //console.log(ModelName, BarCocde, BrandName, Category);
    $.ajax({
        type: "GET",
        url: "/WHIssue/WareHouseFilterationData?ModelName=" + ModelName + "&BarCode=" + BarCocde + "&BrandName=" + BrandName + "&CatName=" + Category + "&Desc=" + Description,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (ListData) {
            $("#btnExcel").show();
            $("#btnPdf").show();
           // console.log(ListData);
            for (var i = 0; i < ListData.length; i++) {
                if (ListData[i].description.length > 100) {
                    ListData[i].description = ListData[i].description.substr(0, 150) + '...';
                }
            }
            Listt = ListData;
            DrawDataTable()
            $("#loader").hide();
        },
        error: function () {
            swal("Sorry", "An error occured", "error")
        }
    })
}
function DrawDataTable() {
    var html = '<div class="table-responsive">'
    html += '<table class="table table-borderless table-hover mb-none" id = "tbl_data" style = "text-align:center !important; background-color: White">'
    html += '     <thead>'
    html += '      <tr class="bg-dark">'
    html += '       <th></th>'
    html += '       <th>ModelName</th>'
    html += '      <th class="hidden-xs hidden-sm">Barcode</th>'
    html += '      <th>Description</th>'
    html += '      <th>Brand</th>'
    html += '      <th>Catgeroy</th>'
    html += '      <th style="font-size:12px;width:5px;text-align:center">Nozha</th>'
    html += '      <th style="font-size:12px;width:5px;text-align:center">N.C</th>'
    html += '      <th style="font-size:12px;width:5px;text-align:center">Obour</th>'
    html += '      <th style="font-size:12px;width:5px;text-align:center">M.S</th>'
    html += '      <th style="font-size:12px;width:5px;text-align:center">M.O.E</th>'
    html += '      <th style="font-size:12px;width:5px;text-align:center">C.F.C</th>'
    html += '      <th style="font-size:12px;width:5px;text-align:center">Online</th>'
    html += '      <th style="font-size:12px;width:5px;text-align:center">C.S</th>'
    html += '       <th style="font-size:12px;width:5px;text-align:center">S.C</th>'
    html += '       <th style="font-size:12px;width:5px;text-align:center">XDemo</th>'
    html += '       <th style="font-size:12px;width:5px;text-align:center">F.&.D</th>'
    html += '       <th style="font-size:12px;width:5px;text-align:center">Total</th>'
    html += '       <th style="font-size:12px;width:5px;text-align:center">Allocated</th>'
    html += '       <th style="font-size:12px;width:5px;text-align:center">Free.Stock</th>'
    html += '      <th style="font-size:12px;width:5px;text-align:center; font:bold">Incoming</th>'
    html += '      </tr>'
    html += '      </thead>'
    html += '       <tbody>'
    html += '       </tbody>'
    html += '    </table>'
    html += ' </div >'
    //console.log(html)
    $("#TableDIV").html(html);
    var table = $('#tbl_data').DataTable({
        "data": Listt,
        "columns": [
            {
                "mRender": function (data, type, full) {
                    return '<a id="ModelAction"><i data-toggle class="fa fa-plus-square-o text-primary h5 m-none" style="cursor: pointer;"></i></a>';
                }
            },
            {
                "className": '',
                "orderable": false,
                "title": "ModelName",
                "data": "modelName",
            },
            { data: "barCode", "className": "hidden-xs hidden-sm" },
            { data: "description", "className": "hidden-xs hidden-sm"},
            { data: "brandName", "className": "hidden-xs hidden-sm" },
            { data: "categoryName", "className": "hidden-xs hidden-sm" },
            { data: "elNozha", "className": "table-cell-edit  hidden-xs hidden-sm" },
            { data: "nasrCity", "className": "table-cell-edit  hidden-xs hidden-sm" },
            { data: "elObour", "className": "table-cell-edit  hidden-xs hidden-sm" },
            { data: "elMerghany", "className": "hidden-xs hidden-sm" },
            { data: "moe", "className": "hidden-xs hidden-sm" },
            { data: "cfc", "className": "hidden-xs hidden-sm" },
            { data: "online", "className": "hidden-xs hidden-sm" },
            { data: "citystars", "className": "hidden-xs hidden-sm" },
            { data: "maintenance", "className": "hidden-xs hidden-sm" },
            { data: "demo", "className": "hidden-xs hidden-sm" },
            { data: "fd", "className": "force-width hidden-xs hidden-sm" },
            { data: "total", "className": "table-cell-edit" },
            { data: "allocated" },
            { data: "freeStock" },
            {
                "mRender": function (data, type, full) {
                    return '<a onclick="GetIncomingData(\''+ full.modelName + '\')">' + full.ordering + '</a>';
                }
              
            }
        ],
        "order": [[0, 'asc']],
    });


    $('#tbl_data tbody').on('click', 'td #ModelAction', function () {
        var $this = $(this);
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        var Model = $("TD", tr).eq(1).html();
        //console.log(Model);
        //console.log(Model);
        $.ajax({
            type: "POST",
            url: "/WHIssue/ModelNameSubData?ModelName=" + Model,
            success: function (DataforModel) {
                //console.log(DataforModel);
                if (DataforModel == null) {
                    swal("Warning", 'There is no data for this serial!', "error")
                }
                else {
                if (row.child.isShown()) {
                   // This row is already open - close it
                   // $this.removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
                    row.child.hide();
                     tr.removeClass('shown');
                    }
                else {
                    // Open this row
                    //$this.removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
                    row.child(format(DataforModel)).show();
                        tr.addClass('shown');
                    }
                }
            },
            error: function () {
                swal("Warning", 'The Adress is requierd!', "error")
            }
        });
    });
}
function ExportEXcelSheet() {
    var ModelName = $("#txtModelName").val();
    var BarCocde = $("#txtBarCode").val();
    var BrandName = $("#drpBrandName").val();
    var Category = $("#drpCategory").val();
    //console.log(ModelName, BarCocde, BrandName, Category);
    window.location.href = "/WHIssue/WareHouseViewExcelReport?ModelName=" + ModelName + "&BarCode=" + BarCocde + "&BrandName=" + BrandName + "&CatName=" + Category;
}
function Exportpdfreport() {
    var ModelName = $("#txtModelName").val();
    var BarCocde = $("#txtBarCode").val();
    var BrandName = $("#drpBrandName").val();
    var Category = $("#drpCategory").val();
    console.log(ModelName, BarCocde, BrandName, Category);
    window.open("/WHIssue/WareHousrReportPdf?ModelName=" + ModelName + "&BarCode=" + BarCocde + "&BrandName=" + BrandName + "&CatName=" + Category, "_blank");
}
function format(d) {
    console.log(d);
    // `d` is the original data object for the row
    html = '<table class="table table-striped table-bordered table-hoverd">' +
        '<thead class="bg-warning">' +
        '<tr>' +
        '<th class="center">PONO</th>' +
        '<th class="center hidden-xs hidden-sm">PODate</th>' +
        '<th class="center hidden-xs hidden-sm">Project Name</th>' +
        '<th class="center hidden-xs hidden-sm">Seller</th>' +
        '<th class="center">Quantity</th>' +
        '<th class="center">Order REF</th>'+
        '<th class="center">ETA</th>'+
        '</tr>'+
        '</thead>'
    for (var i = 0; i < d.length; i++) {
        //var ETA ;
        //if (d[i].formatedETA == '01-01-0001') {
        //    ETA = '';
        //}
        //if (d[i].formatedETA != '01-01-0001') {
        //    ETA = d[i].formatedETA;
        //}
            html +=
            '<tbody>'+
            '<tr>' +
            '<td>' + d[i].pono + '</td>' +
            '<td class="hidden-xs hidden-sm">' +  d[i].formatedETA; + '</td>' +
            '<td class="hidden-xs hidden-sm">' + d[i].projectName + '</td>' +
            '<td class="hidden-xs hidden-sm">' + d[i].seller + '</td>' +
            '<td>' + d[i].coverdQTY + '</td>' +
            '<td>' + d[i].location + '</td>' +
                '<td>' + d[i].formatedETA + '</td>' +
             '</tr>' +
             '</tbody>'
            }
     
      html+=  '</table>';
    return html; 
}


function GetIncomingData(ModelName) {
    $.ajax({
        type: "POST",
        url: "/WHIssue/GetIncomingAllData?ModelName=" + ModelName,
        success: function (Data) {
            var html = '';
           // console.log(Data);
            if (Data.length == 0) {
                swal("Warning", 'There is no data to show...', "error")
            }
            if (Data.length != 0) {
                for (var i = 0; i < Data.length; i++) {
                    var ETA = ''; var RedDate = '';
                    if (Data[i].formatedETA == '01-01-0001') {
                        ETA = '';
                    }
                    if (Data[i].formatedETA != '01-01-0001') {
                        ETA = Data[i].formatedETA;
                    }
                    if (Data[i].formatedRED == '01-01-0001') {
                        RedDate = '';
                    }
                    if (Data[i].formatedRED != '01-01-0001') {
                        RedDate = Data[i].formatedRED;
                    }

                    var RowNO = i + 1;
                    html += '<tr>'
                    html += '<td>' + RowNO + '</td>'
                    html += '<td>' + Data[i].orderREf + '</td>'
                    html += '<td>' + Data[i].incoming + '</td>'
                    html += '<td>' + ETA + '</td>'
                    html += '<td>' + Data[i].shipMethod + '</td>'
                    html += '<td>' + Data[i].notes + '</td>'
                    html += '<td>' + RedDate + '</td>'
                    html += '</tr>'
                }
                $('#listt').html(html);
                $("#lblModelName").html(ModelName);
                $('#IncomingAllocationModel').modal('show')
            }
        },
        error: function () {
            swal("Warning", 'The Adress is requierd!', "error")
        }
    });
}

