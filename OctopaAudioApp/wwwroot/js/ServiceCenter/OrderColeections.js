$(document).ready(function () {
    $("#loader").hide();
    $("#printtypes").hide();

    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#OrderReportData tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
function SearchForData() {
    $("#loader").show();
    var html = '';
    var DrpYears = $("#drpYear");
    var Quarter = $("#drpQuarter");
    $.ajax({
        type: "GET",
        url: "/ServiceCenterData/SearchForOrderCollection?Quarter=" + Quarter.val() + "&Years=" + DrpYears.val(),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (Data) {
            console.log(Data);
            if (Data.length != 0) {
                for (var i = 0; i < Data.length; i++) {
                    var NO = i + 1;
                    html += '<tr>'
                    html += '<td>' + NO + '</td>'
                    html += '<td>' + Data[i].receiptNO + '</td>'
                    html += '<td>' + Data[i].stringReceiptDate + '</td>'
                    html += '<td>' + Data[i].requestNO + '</td>'
                    html += '<td>' + Data[i].description + '</td>'
                    html += '<td>' + Data[i].formatedPaidValue + '</td>'
                    html += '<td>' + Data[i].formatedDepit + '</td>'
                    html += '<td>' + Data[i].customer + '</td>'
                    html += '<td>' + Data[i].type + '</td>'
                    html += '<td>' + Data[i].chequeNO + '</td>'
                    html += '<td>' + Data[i].note + '</td>'
                    html += '</tr>'
                }
                $("#loader").hide();
                $("#printtypes").show();
                $('#OrderReportData').html(html);
            }
            else {
                swal("Sorry", "There is no Data to show", "error")
            }

        },
        error: function () {
            swal("Sorry", "An error occured", "error")
        }
    });
}
function PrintExcel() {
    var DrpYears = $("#drpYear");
    var Quarter = $("#drpQuarter");
    window.location.href = "/ServiceCenterData/ExportCollectionExcel/?Quarter=" + Quarter.val() + "&Years=" + DrpYears.val();
}
function PrintPDf() {
    var DrpYears = $("#drpYear");
    var Quarter = $("#drpQuarter");
    window.location.href = "/ServiceCenterData/ExportCollectionPDF/?Quarter=" + Quarter.val() + "&Years=" + DrpYears.val();
}