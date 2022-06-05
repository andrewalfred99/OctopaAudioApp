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
        for (var i = 0; i < Data.length; i++) {
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
        $('#listofdata').html(html);
    }
}
function ClearFilters() {
    fillData(Data);
}
function ReportData(REQUESTNO) {
    window.open("/ServiceCenterData/ReportReceiveModifing?RequestN=" + REQUESTNO, "_blank")
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
            window.location = "/ServiceCenterData/ReportReceiveing"
        }

    );

}
// Save RecivedReport
function SaveChanges() {
    var UpdatedNOtes = $("#txtNoteUpdate").val();
    var ReceivedName = $("#txtReceivedName").val();
    var IDNO = $("#txtRecivedIDNO").val();

    var Store = $("#drpStores").val();
    if (Store == 0) {
        swal("Warning", 'You Must Select Store ... ', "error")
    }
    else if (ReceivedName == "") {
        swal("Warning", 'please make sure that Received Name or ID No is enterd .....', "error")
    }
    else {
        var Invoice = $("#drpCreateInvoice").val();
        var IncludeTax = $("#drpIncTax").val();

        //var Notes = $("#txtNotes").val();
        var RequestNo = $("#lblRequestNO").html();
        var NTecReportD = new Array();
        $("#TblDeviceDeatilesExist TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            var Deliverd = row.find("TD").eq(12).find("input").is(':checked');
            if (Deliverd == true) {
                Data.ModelName = row.find("TD").eq(1).html();
                Data.SerialNO = row.find("TD").eq(2).html();
            }
            NTecReportD.push(Data);
        });
        var NTecReport = {};
        if (Invoice == 0) {
            NTecReport.Invoice = false;
        }
        else {
            NTecReport.Invoice = true;
        }
        if (IncludeTax == 0) {
            NTecReport.IncludeTax = false;
        }
        else {
            NTecReport.IncludeTax = true;
        }
        var Data = { NTecReportD, NTecReport }
        console.log(Data);
        $.ajax({
            type: "POST",
            url: "/ServiceCenterData/UpdateReceveingRemport?RequestN=" + RequestNo + "&RecName=" + ReceivedName + "&RecID=" + IDNO + "&UpdatedNotes=" + UpdatedNOtes + "&Store=" + Store,
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json == "Data Updated Done") {
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
                            window.location = "/ServiceCenterData/PrintMaintenancePDFDeliverd?RequestNO=" + RequestNo
                        }
                    );
                }
                if (json != "Data Updated Done") {
                    swal("Warning", json, "error")
                }

            },
            error: function () {
                swal("Warning", 'Somthing went wrong', "error")
            }
        });

    }
}