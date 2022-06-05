var Data = [];
$(document).ready(function () {
    $("#drpCustomer").select2();
    GetAllData();
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#listofdata tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    CalculateTotal();
    GetAllValues();

    var Total = 0; 
    $("#tbleitemDetailes TBODY TR").each(function () {
        var row = $(this);
        var UnitePrice = row.find("TD").eq(4).find("input").val();
        var Quantity = row.find("TD").eq(3).html();
        Total += UnitePrice * Quantity;
    });
    $("#lblTotal").html(Total);
    $("#lblLGtotal").html(Total);
    var TotalWithTax = Total * 1.14;
    $("#lblLToWT").html(TotalWithTax.toFixed(2));
});
function GetAllData() {
    $.ajax({
        type: "POST",
        url: "/ServiceCenterData/GetTecReportData",
        success: function (Datas) {
            Data = Datas;
            if (Data == null) {
                swal("Warning", 'There is no data to show .... !', "error")
            }
            else {
                fillData(Data);
            }
        },
        error: function () {
            swal("Warning", 'Somthing went wrong!', "error")
        }
    });
}
function FilterData() {
    var Department = $("#drpDepartment").val();
    var Technic = $("#drpTechni").val();
    var Status = $("#drpStatus").val();
    var FilterdData = [];
    console.log(FilterdData, Department, Technic, Status);
    for (var i = 0; i < Data.length; i++) {
        if (Department != 0 && Technic == 0 && Status == 0) {
            if (Data[i].departMent == Department) {
                FilterdData.push(Data[i]);
            }
        }
        if (Department == 0 && Technic != 0 && Status == 0) {
            if (Data[i].technical == Technic) {
                FilterdData.push(Data[i]);
            }
        }
        if (Department == 0 && Technic == 0 && Status != 0) {
            if (Data[i].status == Status) {
                FilterdData.push(Data[i]);
            }
        }
        if (Department != 0 && Technic != 0 && Status == 0) {
            if (Data[i].departMent == Department && Data[i].technical == Technic) {
                FilterdData.push(Data[i]);
            }
        }
        if (Department != 0 && Status != 0 && Technic == 0) {
            if (Data[i].status == Status && Data[i].departMent == Department) {
                FilterdData.push(Data[i]);
            }
        }
        if (Technic != 0 && Status != 0 && Department == 0) {
            if (Data[i].status == Status && Data[i].technical == Technic) {
                FilterdData.push(Data[i]);
            }
        }
        if (Technic != 0 && Status != 0 && Department != 0) {
            if (Data[i].status == Status && Data[i].technical == Technic && Data[i].departMent == Department) {
                FilterdData.push(Data[i]);
            }
        }
    }
    console.log(FilterdData);
    fillData(FilterdData);
}
function fillData(Data) {
    var html = '';
    if (Data.length != 0) {
        console.log(Data)
        for (var i = 0; i < Data.length; i++) {
            if (Data[i].technicalModify == true) {
                var RowNO = i + 1;
                html += '<tr  style="font-weight: bold">'
                html += '<td>' + RowNO + '</td>'
                html += '<td><a onclick="ReportData(' + Data[i].requestNO + ')"> ' + Data[i].requestNO + ' </a> </td>'
                html += '<td>' + Data[i].formatedDate + '</td>'
                html += '<td>' + Data[i].customer + '</td>'
                html += '<td>' + Data[i].reportNO + '</td>'
                html += '<td>' + Data[i].departMent + '</td>'
                html += '<td>' + Data[i].technical + '</td>'
                html += '<td>' + Data[i].status + '</td>'
                html += '</tr>'
            }
            else {
                var RowNO = i + 1;
                html += '<tr>'
                html += '<td>' + RowNO + '</td>'
                html += '<td><a onclick="ReportData(' + Data[i].requestNO + ')"> ' + Data[i].requestNO + ' </a> </td>'
                html += '<td>' + Data[i].formatedDate + '</td>'
                html += '<td>' + Data[i].customer + '</td>'
                html += '<td>' + Data[i].reportNO + '</td>'
                html += '<td>' + Data[i].departMent + '</td>'
                html += '<td>' + Data[i].technical + '</td>'
                html += '<td>' + Data[i].status + '</td>'
                html += '</tr>'
            }
          
        }
        $('#listofdata').html(html);
    }
}
function ClearFilters() {
    fillData(Data);
}
function ReportData(REQUESTNO) {
    window.open("/ServiceCenterData/ReppretPricingModifing?RequestN=" + REQUESTNO, "_blank")
}
function CancelRequest() {
    swal({
        title: "Are you sure?",
        text: "You want to cancel this Report!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    },
        function () {
            window.location = "/ServiceCenterData/ReportPricing"
        }

    );

}
// Delete Item from Data base
function RemoveItemFromDB(RequestNO, ModelName) {
    swal({
        title: "Are you sure?",
        text: "You Will Delete this item ...!" + ModelName,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes",
        closeOnConfirm: false,
        allowOutsideClick: false
    },
        function () {
            $.ajax({
                type: "POST",
                url: "/ServiceCenterData/DeletefromDeviceItemDatabase?ModelN=" + ModelName + "&Requestno=" + RequestNO,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (Requestno) {
                    swal({
                        title: "Done",
                        text: 'Model  ' + ModelName + ' Deleted Done',
                        type: "success",
                        confirmButtonClass: "btn-primary",
                        confirmButtonText: "OK",
                        closeOnConfirm: false
                    },
                        function () {
                            window.location.reload();
                        }
                    );

                },
                error: function () {
                    swal("Warning", 'Somthing went wrong', "error")
                }
            });
        }
    );
}
// Calculate Total
function CalculateTotal() {
    var TotalEx = 0;
    $("#TblDeviceDeatilesExist TBODY TR").each(function () {
        var row = $(this);
        var ExtraFeez = parseInt(row.find("TD").eq(8).find("input").val());
        TotalEx += ExtraFeez ;
    });
    $("#lblLFees").html(TotalEx);
    var TotalWithoutTax = 0;
    $("#tbleitemDetailes TBODY TR").each(function () {
        var row = $(this);
        var UnitePrice = row.find("TD").eq(4).find("input").val();
        var Quantity = row.find("TD").eq(3).html();
        TotalWithoutTax += UnitePrice * Quantity;
    });
    $("#lblTotal").html(TotalWithoutTax.toFixed(2));
    $("#lblLGtotal").html((TotalWithoutTax + TotalEx).toFixed(2));
    GetAllValues();
}
function CalculateTotalUnite(Raw) {
    var row = $(Raw).closest("TR");
    var QAuantity = $("TD", row).eq(3).html();
    var Uniteprice = parseFloat($("TD", row).eq(4).find("input").val());
    var TotalPeritem = QAuantity * Uniteprice
    $("TD", row).eq(5).html(TotalPeritem);
    var TotalWithoutTax = 0;
    $("#tbleitemDetailes TBODY TR").each(function () {
        var row = $(this);
        var UnitePrice =row.find("TD").eq(4).find("input").val();
        var Quantity = row.find("TD").eq(3).html();
        TotalWithoutTax += UnitePrice * Quantity;
    });
    $("#lblTotal").html(TotalWithoutTax.toFixed(2));

    GetAllValues();
}
function GetAllValues() {
    var Total = $("#lblTotal").html();
    var LH = $("#lblLhoures").html();
    var LF = parseFloat($("#lblLFees").html());
    var GrandTotal = parseFloat(Total + LF);
    $("#lblLGtotal").html(GrandTotal.toFixed(2));
    var GTotalWT = GrandTotal * 1.14;
    $("#lblLToWT").html(GTotalWT.toFixed(2));
}
function SaveChanges() {
    var Invoice = $("#drpCreateInvoice").val();
    var IncludeTax = $("#drpIncTax").val();
    var UpdatedNotes = $("#txtUpdatedNote").val();
    var RequestNo = $("#lblRequestNO").html();
    var NTecReportD = new Array();
    $("#TblDeviceDeatilesExist TBODY TR").each(function () {
        var row = $(this);
        var Data = {};
        Data.ModelName = row.find("TD").eq(1).html();
        Data.SerialNO = row.find("TD").eq(2).html();
        Data.ExtraFees = row.find("TD").eq(8).find("input").val();
        NTecReportD.push(Data);
    });
    var NReportItemdD = new Array();
    $("#tbleitemDetailes TBODY TR").each(function () {
        var row = $(this);
        var Data = {};
        Data.ModelName = row.find("TD").eq(0).html();
        Data.SerialNO = row.find("TD").eq(1).html();
        Data.UnitPrice = parseFloat(row.find("TD").eq(4).find("input").val());
        NReportItemdD.push(Data);
    });
    //var NTecReport = {};
    //NTecReport.Invoice = Invoice.val();
    //NTecReport.IncludeTax = IncludeTax.val();
    var Data = { NReportItemdD, NTecReportD }

    $.ajax({
        type: "POST",
        url: "/ServiceCenterData/ReportPricingUpdated?Requestn=" + RequestNo + "&UpdatedNotes=" + UpdatedNotes,
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            swal({
                title: "Done",
                text: 'Report with RequestNo  ' + RequestNo + ' Updated Successfully',
                type: "success",
                confirmButtonClass: "btn-primary",
                confirmButtonText: "OK",
                closeOnConfirm: false,
                allowOutsideClick: false
            },
                function () {
                    window.location.reload();
                }
            );
        },
        error: function () {
            swal("Warning", 'Somthing went wrong', "error")
        }
    });
}
function EditDeviceDetailes(SerialNO, ModelName, RequestNo, Technical) {
    $("#lblReqNo").html(RequestNo);
    $("#lblSerialNO").html(SerialNO);
    $("#lblModelName").html(ModelName);
    $("#lblOldTec").html(Technical);
    $("#modelUpdateTech").modal('show');
}
function UpdateDeviceFinal() {
   var Requestno =  $("#lblReqNo").html();
   var SerialNO  = $("#lblSerialNO").html();
   var ModelName = $("#lblModelName").html();
   var NewTech = $("#drpTechnicalUpdate").val();
   console.log(Requestno, SerialNO, ModelName, NewTech);

    $.ajax({
        type: "POST",
        url: "/ServiceCenterData/UpdateDeviceTechnical?ReqNo=" + Requestno + "&SerialNO=" + SerialNO + "&ModelName=" + ModelName + "&NewTechnical=" + NewTech,
        success: function () {
            swal({
                title: "Done",
                text: 'Report with RequestNo  ' + Requestno + ' Updated Technical Successfully',
                type: "success",
                confirmButtonClass: "btn-primary",
                confirmButtonText: "OK",
                closeOnConfirm: false,
                allowOutsideClick: false
            },
                function () {
                    window.location.reload();
                }
            );
        },
        error: function () {
            swal("Warning", 'Somthing went wrong', "error")
        }
    });
}


