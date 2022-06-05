$(document).ready(function () {
    $("#loader").hide();
    $("#drpCust").select2();
    $("#drpTBank").select2();
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#listofCustomerData tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $("#tblChque").hide();
    $("#tblBankData").hide();
    $("#drpCust").change(function () {
        $("#loader").show();
        var html = '';
        var SelectedValue = $('#drpCust option:selected').val();
        $.ajax({
            type: "POST",
            url: "/ServiceCenterData/SearchForCustomerData?CusatCode=" + SelectedValue,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (ALLData) {
                if (ALLData.length != 0) {
                    $("#loader").hide();
                    var CustData = ALLData.detailsData;
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
                }
                else {
                    $("#loader").hide();
                    swal("Warning", "There is No data To show", "error")
                }
            }
        });
    });
    $("#drpTyps").change(function () {
        var SelectedValue = $('#drpTyps option:selected').val();
        if (parseInt(SelectedValue) == 1) {
            $("#txtRecValue").prop("disabled", false);
            $("#tblChque").hide();
            $("#tblBankData").hide();
        }
        if (parseInt(SelectedValue) == 2) {
            $("#txtRecValue").prop("disabled", false);
            $("#tblChque").show();
            $("#tblBankData").hide();
        }
        if (parseInt(SelectedValue) == 3) {
            $("#txtRecValue").prop("disabled", false);
            $("#tblBankData").show();
            $("#tblChque").hide();
        }
        if (parseInt(SelectedValue) == 4) {
            $("#txtRecValue").prop("disabled", false);
            $("#tblBankData").show();
            $("#tblChque").hide();
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
            window.location = "/ServiceCenterData/SCRecReceivable";
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
    $("#txtAmount" + id).val(TotalAmount);

    $("#tableReceDetails TBODY TR").each(function () {
        var row = $(this);
        var Amount = parseFloat(row.find("TD").eq(10).find("input").val());
        Total = parseFloat(Total + Amount);
    });

    var RecTotal = $("#txtRecValue").val();
    var SubTotal = parseFloat(RecTotal - Total);
    $("#txtSupTotal").val(SubTotal);
}
function RecValueChange() {
    var Total = 0;
    $("#tableReceDetails TBODY TR").each(function () {
        var row = $(this);
        var Amount = parseFloat(row.find("TD").eq(10).find("input").val());
        Total = parseFloat(Total + Amount);
    });

    var RecTotal = $("#txtRecValue").val();
    var SubTotal = parseFloat(RecTotal - Total);
    $("#txtSupTotal").val(SubTotal);
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

function SaveNewRece() {

    var RecNo = $("#txtRecNo").val();
    var FormatedDueDate = $("#txtDuDate");
    var Customer = $("#drpCust");
    var Value = $("#txtRecValue");
    var Note = $("#txtNotes");
    var ReceiptType = $("#drpTyps");
    var Currency = $("#drpCurr");
    var BankName = $("#txtChequeBankName");
    var CheqNo = $("#txtChequetNo");
    var TRBankName = $("#drpTBank").val();
    var AccountNo = $("#drpAccountNO").val();
    var rowsCount = $('#tableReceDetails tr').length;

    if (parseInt(Customer) == -1) {
        swal("Warning", "You must select Customer", "error")
    }
    else if (parseInt(rowsCount) <= 1) {
       
        swal("Warning", "There is no data to save", "error")
    }
    else {
        var NSCREC = {};
        NSCREC.FormatedDueDate = FormatedDueDate.val();
        NSCREC.Customer = Customer.val();
        NSCREC.ReceipValue = Value.val();
        NSCREC.Note = Note.val();
        NSCREC.Currency = Currency.val();
        NSCREC.CheqNo = CheqNo.val();
        NSCREC.BankName = BankName.val();
        NSCREC.AccountNo = AccountNo;
        NSCREC.TRBankName = TRBankName;
        NSCREC.ReceiptType = ReceiptType.val();
        var NSCRECDE = new Array();

        $("#tableReceDetails TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            var AmountNull = row.find("TD").eq(11).find("input").val();
            if (AmountNull != 0) {
                Data.RequestNO = row.find("TD").eq(1).html().trim();
                Data.UnpaidValue = parseFloat(row.find("TD").eq(8).html().trim());
                Data.Type = row.find("TD").eq(0).html().trim();
                Data.PaidValue = parseFloat(row.find("TD").eq(11).find("input").val().trim());
                Data.Rate = row.find("TD").eq(9).find("input").val().trim();
                Data.Amount = parseFloat(row.find("TD").eq(10).find("input").val().trim());
                NSCRECDE.push(Data);
            }
        });

        var Data = { NSCRECDE, NSCREC }
        console.log(Data)
        $.ajax({
            type: "POST",
            url: "/ServiceCenterData/CreateServiceReceivable",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
              
                if (json == "Data Saved Done") {
                    swal({
                        title: "Done",
                        text: 'Data Saved Successfully',
                        type: "success",
                        confirmButtonClass: "btn-primary",
                        confirmButtonText: "OK",
                        closeOnConfirm: false,
                        AllowOutsideClick: false
                    },
                        function () {
                            window.location = "/ServiceCenterData/DetailesOFReceivable?RecNO" + RecNo;
                        });
                }
                else {
                    swal("Warning", json, "error")
                }
            },
            error: function () {
                swal("Warning", "Somthing Went Wrong", "error")
            }
        });
    }

   
}