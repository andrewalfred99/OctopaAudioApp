$(document).ready(function () {
    $("#loader").hide();
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#listt tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
function SearchForData() {
    var html = '';
    $("#loader").show();
    var Customer = $("#drpCust");
    var ChequeNO = $("#txtChequeNO");
    var Types = $("#drpTypes");
    var FromDate = $("#txtfromdate").val();
    var ToDate = $("#txtToDate").val();
    var RecNp = $("#txtReceiptNo").val();
    $.ajax({
        type: "GET",
        url: "/ReceiptAccountViews/SearchForDataResult?drpCust=" + Customer.val() + "&drpType=" + Types.val() + "&end=" + ToDate + "&start=" + FromDate + "&CheqNo=" + ChequeNO.val() + "&RecNo=" + RecNp,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (Data) {
            console.log(Data);
            if (Data.length != 0) {
                $("#loader").hide();
                for (var i = 0; i < Data.length; i++) {
                    var NO = i + 1;
                    html += '<tr>'
                    html += '<td>' + NO + '</td>'
                    html += '<td><input type="button" target="_blank" onclick="PrintPdfReport(' + Data[i].receiptNO + ')"  value="' + Data[i].receiptNO + '"  style="color:orangered;border-color:transparent"/></td>'
                    html += '<td>' + Data[i].convertRecDate + '</td>'
                    html += '<td>' + Data[i].name + '</td>'
                    html += '<td>' + Data[i].custName + '</td>'
                    html += '<td>' + Data[i].convertValue + '</td>'
                    html += '<td>' + Data[i].chequeNO + '</td>'
                    html += '<td>' + Data[i].bankName + '</td>'
                    html += '<td>' + Data[i].collector + '</td>'
                    html += '<td>' + Data[i].currency + '</td>'
                    html += '<td>' + Data[i].convertDuDate + '</td>'
                    html += '</tr>'
                }
                $('#listt').html(html);
            }
            else {
                swal("Sorry", "There is no data to show", "error")
            }
        },
        error: function () {
            swal("Sorry", "An error occured", "error")
        }
    })
}

function PrintPdfReport(RecNo) {
    window.open("/ReceiptAccountViews/PrintOutRecivable?RECNO=" + RecNo, "_blank")
}