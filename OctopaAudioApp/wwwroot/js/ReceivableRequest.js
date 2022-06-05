$(document).ready(function () {
    $("#drpCust").select2();
    $("#drpTBank").select2();
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#listofCustomerData tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $("#divDWPL").hide();
    $("#tblChque").hide();
    $("#tblBankData").hide();
    $("#drpCust").change(function () {
        var html = '';
        var htmlD = '';
        var SelectedValue = $('#drpCust option:selected').val();
        $.ajax({
            type: "POST",
            url: "/ReceiptAccountViews/SearchForCustomerData?CusatCode=" + SelectedValue,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (ALLData) {
                var CustData = ALLData.detailsData;
                var DownPayment = ALLData.downP;
                for (var i = 0; i < CustData.length; i++) {
                    html += '<tr class="txtMult">'
                    html += '<td>' + CustData[i].type + '</td>'
                    html += '<td>' + CustData[i].requestNO + '</td>'
                    html += '<td>' + CustData[i].requestDateString + '</td>'
                    html += '<td>' + CustData[i].reason + '</td>'
                    html += '<td>' + CustData[i].docNo + '</td>'
                    html += '<td>' + CustData[i].formatedTotal + '</td>'
                    html += '<td>' + CustData[i].priceType + '</td>'
                    html += '<td>' + CustData[i].formatedTotalIssued + '</td>'
                    html += '<td>' + CustData[i].formatedUnpaid + '</td>'
                    html += '<td><input id ="txtRate' + i + '" onchange="CalCulateAmount(' + i + ')" type="number" class="form-control" value="1" /></td>'
                    html += '<td><input id="txtAmount' + i + '" value="0"  disabled="disabled"  class="form-control" /></td>'
                    html += '<td><input type="number" onchange="CalCulateAmount(' + i + ')" class="form-control" id="txtPaidVal' + i + '" /></td>'
                    html += '</tr>'
                }
                $('#listofCustomerData').html(html);
                if (ALLData.downP.length != 0) {
                    for (var i = 0; i < DownPayment.length; i++) {
                        htmlD += '<tr>'
                        htmlD += '<td>' + DownPayment[i].dpNo + '</td>'
                        htmlD += '<td>' + DownPayment[i].dateString + '</td>'
                        htmlD += '<td>' + DownPayment[i].pendingValue + '</td>'
                        htmlD += '<td><input id="txtUserValue" name="gider" value ="0"  class="form-control" style="width:100%" type="number"/></td>'
                        htmlD += '</tr>'
                    }
                    $('#listDOWNP').html(htmlD);
                }
            }
        });
    });
    $("#drpTyps").change(function () {
        var SelectedValue = $('#drpTyps option:selected').val();
        if (parseInt(SelectedValue) == 1) {
            $("#txtRecValue").prop("disabled", false);
            $("#divDWPL").hide();
            $("#tblChque").hide();
            $("#tblBankData").hide();
        }
        if (parseInt(SelectedValue) == 2) {
            $("#txtRecValue").prop("disabled", false);
            $("#tblChque").show();
            $("#divDWPL").hide();
            $("#tblBankData").hide();
        }
        if (parseInt(SelectedValue) == 3) {
            $("#txtRecValue").prop("disabled", false);
            $("#tblBankData").show();
            $("#divDWPL").hide();
            $("#tblChque").hide();
        }
        if (parseInt(SelectedValue) == 4) {
            $("#txtRecValue").prop("disabled", false);
            $("#divDWPL").hide();
            $("#tblChque").hide();
            $("#tblBankData").hide();
        }
        if (parseInt(SelectedValue) == 5) {
            $("#txtRecValue").prop("disabled", false);
            $("#divDWPL").show();
            $("#tblChque").hide();
            $("#tblBankData").hide();
            $("#txtRecValue").prop("disabled", true);
            $("input").change(function () {

                var Total = 0;
                $("input[name=gider]").each(function () {
                    Total = Total + parseFloat($(this).val());
                });
                parseFloat($("#txtRecValue").val(Total));
            });
            $("#txtRecValue").prop("disabled", true);
            $("#downPaymenttbl TBODY TR").each(function () {
                var row = $(this);
                row.find("TD").eq(3).find("input").prop("disabled", false);
            });
        }
        if (parseInt(SelectedValue) == 6) {
            $("#txtRecValue").prop("disabled", false);
            $("#divDWPL").hide();
            $("#tblChque").hide();
            $("#tblBankData").hide();
        }
    });
});

function CancelConfirmation() {
    swal({
        title: "Are you sure?",
        text: "You want to cancel this Request!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    },
        function () {
            window.location = "/ReceiptAccountViews/ReceivableCycle";
        }

    );

}

function CalCulateAmount(id) {
    var Total = 0;
    var TotalAmount = 0; 
    var Rate = $("#txtRate" + id).val();
    var PaidVal = $("#txtPaidVal" + id).val();
    //alert(Rate, Amount, PaidVal);
    var RdType = $("input[name='type']:checked").val();
    if (RdType == 0) {
        TotalAmount = (Rate) * (PaidVal);
    }
    if (RdType == 1) {
        TotalAmount = (PaidVal) / (Rate);
    }
    var TotalString = TotalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    $("#txtAmount" + id).val(TotalString);

    $("#tableReceDetails TBODY TR").each(function () {
        var row = $(this);
        var RemoveComma = row.find("TD").eq(10).find("input").val().replace(',','')
        var Amount = parseFloat(RemoveComma);
        Total = parseFloat(Total + Amount);
    });
    console.log(Total)
    //return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var RecTotal = $("#txtRecValue").val();
    var SubTotal = parseFloat(RecTotal - Total);
    var SubString = SubTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $("#txtSupTotal").val(SubString);
}

function RecValueChange() {
    var Total = 0;
    $("#tableReceDetails TBODY TR").each(function () {
        var row = $(this);
        var RemoveComma = row.find("TD").eq(10).find("input").val().replace(',', '')
        var Amount = parseFloat(RemoveComma);
        Total = parseFloat(Total + Amount);
    });

    var RecTotal = $("#txtRecValue").val();
    var SubTotal = parseFloat(RecTotal - Total);
    var SubString = SubTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $("#txtSupTotal").val(SubString);
}

function FillAccounts() {
    var SelectedValue = $("#drpTBank").val();
   
    $.ajax({
        type: "POST",
        url: "/ReceiptAccountViews/FillAccuntData?TBank=" + SelectedValue,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (FillData) {
            $("#drpAccountNO option").remove();
            var editContactselect = document.getElementById("drpAccountNO")
            for (var i = 0; i < FillData.length; i++) {
                var opt = FillData[i].accName;
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = FillData[i].accCode;
                editContactselect.appendChild(el)
            }

        },
        error: function () {
            swal("Warning", "Somthing went wrong", "error")
        }
    });
}
$("body").on("click", "#btnsave", function () {
    var Type = $("#drpTyps");
    var RValue = $("#txtRecValue").val();
    var CollectorName = $("#txtCollector").val();
    var Customer = $("#drpCust").val();

    if (CollectorName == "") {
        swal("Warning", "You Must Enter Collector Name", "error")
    }
    if (parseInt(Customer) == -1) {
        swal("Warning", "You must select Customer", "error")
    }
    var rowsCount = $('#tableReceDetails tr').length;
    if (parseInt(rowsCount) <= 1) {
        swal("Warning", "There is no data to save", "error")
    }
    if (CollectorName != "" && parseInt(rowsCount) > 1) {
        var SDueDate = $("#txtDuDate");
        var Customer = $("#drpCust");
        var Value = $("#txtRecValue");
        var Note = $("#txtNotes");
        var Collector = $("#txtCollector");
        var Currency = $("#drpCurr");

        // ReceivableTmp Data Header
        var RECVD = {};
        RECVD.Customer = Customer.val();
        RECVD.Value = Value.val();
        RECVD.Note = Note.val().trim();
        RECVD.Collector = Collector.val();
        RECVD.Currency = Currency.val();
        RECVD.ReceiptType = Type.val();
        RECVD.SDueDate = SDueDate.val();

        var ChqData = {};
        var BankName = $("#txtChequeBankName");
        var CheqNo = $("#txtChequetNo");
        ChqData.BankName = BankName.val();
        ChqData.ChequeNO = CheqNo.val();


        var BankData = {}
        var BBankName = $("#drpTBank").val();
        var BAccountNo = $("#drpAccountNO").val();

        BankData.BankName = BBankName;
        BankData.AccountNO = BAccountNo;


        var LIRECV = new Array();
        $("#tableReceDetails TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            var AmountNull = row.find("TD").eq(11).find("input").val();
            if (AmountNull != 0) {
                Data.RequestNO = row.find("TD").eq(1).html().trim();
                Data.UnpaidValue = parseFloat(row.find("TD").eq(8).html().replace(',', '').trim());
                Data.Type = row.find("TD").eq(0).html().trim();
                Data.PaidValue = parseFloat(row.find("TD").eq(11).find("input").val().replace(',', '').trim());
                Data.Rate = row.find("TD").eq(9).find("input").val().trim();
                Data.Amount = parseFloat(row.find("TD").eq(10).find("input").val().replace(',', '').trim());
                LIRECV.push(Data);
            }
        });
        var ListOfDownPayments = new Array();
        $("#downPaymenttbl TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            var UsedVal = parseFloat(row.find("TD").eq(3).find("input").val().trim());
            if (UsedVal != 0) {
                Data.DPNo = row.find("TD").eq(0).html().trim();
                Data.UsedValue = parseFloat(row.find("TD").eq(3).find("input").val().trim());
                ListOfDownPayments.push(Data);
            }
        });
        var Data = { RECVD, ListOfDownPayments, LIRECV, ChqData, BankData };
        console.log(Data);
        $.ajax({
            type: "POST",
            url: "/ReceiptAccountViews/CreateRequest",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json == "Data Saved Successfully") {
                    swal({
                        title: "Done",
                        text: json,
                        type: "success",
                        confirmButtonClass: "btn-primary",
                        confirmButtonText: "OK",
                        closeOnConfirm: false,
                        AllowOutsideClick: false
                    },
                        function () {
                            window.location = "/ReceiptAccountViews/ReceivableCycle";
                        });
                }
                if (json != "Data Saved Successfully") {
                    swal("Warning", json, "error")
                }
            }
        });
    }
});