$(document).ready(function (e) {
    $("input").change(function () {
        // var mult = 0;
        $(".txtMult input").keyup(multInputs);
        function multInputs() {

            // for each row:
            $("tr.txtMult").each(function () {
                // get the values from this row:
                var $val1 = $('.val1', this).val();
                var $val2 = $('.val2', this).val();
                var RdType = $("input[name='type']:checked").val();
                if (RdType == 0) {
                    var $total = ($val1) * ($val2);
                }
                if (RdType == 1) {
                    var $total = ($val2) / ($val1);
                }
                // set total for the row
                $('.multTotal', this).val($total);
            });

        }

    });
    // btn Save Data
    $("body").on("click", "#btnUpdate", function () {
        var Total = 0;
        var RValue = $("#txtRecValue").val();
        var CollectorName = $("#txtcollectorname").val();
        if (Total > RValue) {
            swal("Warning", "The total value is more than Rec Value!", "error")
        }
        if (CollectorName == "") {
            swal("Warning", "Please Enter the Collector Nasme!", "error")
            //$("#lblerrormessage").html("The Paid Value is more than Unpaid Value ");
            //$('#WarningMessage').modal('show');
        }
        if (CollectorName != "" && parseFloat(Total) <= parseFloat(RValue)) {

            var PenRec = $("#txtPenRecNo");
            var CVNO = $("#txtCVNO");
            var DueDate = $("#txtDueDate");
            var ReceiptNO = $("#RecNo");
            var ReceiptType = $("#txtRType");
            var Customer = $("#txtCustCode");
            var Value = $("#txtRecValue");
            var Note = $("#txtNotes");
            var Collector = $("#txtcollectorname");
            var Currency = $("#txtCurrency");

            // Receivable Data Header
            var RECVD = {};
            RECVD.DueDate = DueDate.val();
            RECVD.Customer = Customer.val();
            RECVD.Value = Value.val();
            RECVD.Note = Note.val().trim();
            RECVD.Collector = Collector.val().trim();
            RECVD.Currency = Currency.val();
            RECVD.CVNO = CVNO.val();
            if (ReceiptType.val() == "Cash") {
                RECVD.ReceiptType = 1;
            }
            if (ReceiptType.val() == "Cheque") {
                RECVD.ReceiptType = 2;
            }
            if (ReceiptType.val() == "Transfer") {
                RECVD.ReceiptType = 3;
            }
            var ChqData = {};
            var BankName = $("#txtBankName");
            var CheqNo = $("#txtAccountNo");
            ChqData.BankName = BankName.val();
            ChqData.ChequeNO = CheqNo.val();
            //ReceivableDetails Data
            var LIRECV = new Array();
            $("#grdDetails TBODY TR").each(function () {
                var row = $(this);
                var Data = {};
                var AmountNull = row.find("TD").eq(11).find("input").val();
                if (AmountNull != 0) {
                    Data.RequestNO = row.find("TD").eq(1).html();
                    Data.ReceiptNO = ReceiptNO.val();
                    Data.UnpaidValue = parseFloat(row.find("TD").eq(8).html());
                    Data.Type = row.find("TD").eq(0).html();
                    Data.PaidValue = parseFloat(row.find("TD").eq(11).find("input").val());
                    Data.Rate = row.find("TD").eq(9).find("input").val();
                    Data.Amount = parseFloat(row.find("TD").eq(10).find("input").val());
                    LIRECV.push(Data);
                }
            });
            var Data = { LIRECV, RECVD, ChqData };
            console.log(Data);
            $.ajax({
                type: "POST",
                url: "/ReceiptAccountViews/NewReceivable?PeRecNo=" + PenRec.val(),
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
                            closeOnConfirm: false
                        },
                            function () {
                                window.location = "/ReceiptAccountViews/PendingRec"
                            });
                    }
                    if (json != "Data Saved Successfully") {
                        swal("Warning", json, "error")
                    }
                }
            });
        }
    });
});



