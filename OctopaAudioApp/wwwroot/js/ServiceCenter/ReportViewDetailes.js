

$(document).ready(function () {
    $("#loader").hide();
});
// Allreport Data Filter 
function SearchForReportData() {
    $("#loader").show();
    var html = '';
    var ReqNo = $("#txtsearchReqNo").val();
    var Customer = $("#drpCust").val();
    var Phone = $("#txtPhone").val();
    var Serial = $("#txtSerial").val();
    var DateFrom = $("#txtfromdate").val();
    var DateTo = $("#txtToDate").val();
    $.ajax({
        type: "POST",
        url: "/ServiceCenterData/SearchforspacificReport?ReqNo=" + ReqNo + "&Customers=" + Customer + "&FromDate=" + DateFrom + "&ToDate=" + DateTo + "&SerialNOS=" + Serial + "&PhoneN=" + Phone,
        success: function (Data) {
            console.log(Data);
            if (Data.length == 0) {
                $("#loader").hide();
                swal("Warning", 'There is no data to show ...!', "error")
            }
            else {
                for (var i = 0; i < Data.length; i++) {
                    var RowNO = i + 1;
                    html += '<tr>'
                    html += '<td>' + RowNO + '</td>'
                    html += '<td>' + Data[i].requestNO + '</td>'
                    html += '<td>' + Data[i].formatedDate + '</td>'
                    html += '<td>' + Data[i].departMent + '</td>'
                    html += '<td>' + Data[i].reportNO + '</td>'
                    html += '<td>' + Data[i].custName + '</td>'
                    html += '<td>' + Data[i].phone + '</td>'
                    html += '<td>' + Data[i].serialNO + '</td>'
                    html += '<td><a onclick="ReportDetailes(' + Data[i].requestNO + ')" data-toggle="tooltip" data-placement="top" title="Report Detailes" style="font-size:20px;margin-right:5px" ><i class="fa fa-book"></i></a></td>'
                    html += '</tr>'
                }
                $('#datalist').html(html);
                $("#loader").hide();
            }
        },
        error: function () {
            $("#loader").hide();
            swal("Warning", 'The Adress is requierd!', "error")
        }
    });
}

function ReportDetailes(RequestNo) {
    window.open("/ServiceCenterData/ReportDetailes?RequestN=" + RequestNo, "_blank")
}
function EditReport(RequestNo) {
    alert(RequestNo);
}