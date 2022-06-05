
function onlyNumberKey(evt) {

        // Only ASCII charactar in that range allowed
        var ASCIICode = (evt.which) ? evt.which : evt.keyCode
        if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}
    $(document).ready(function () {

        $("#tblordercheck TBODY TR").each(function () {
            var row = $(this);
            var DeleteItem = row.find("TD").eq(10).find("input").is(':checked');
            if (DeleteItem == true) {
                $(this).closest('tr').css('background-color', '#89CFF0');
            }
        });

    var InvoiceNO = $("#txtInvoiceNO").val();
    var DeliverDate = $("#txtInvoiceDate").val();
    var ProformaDate = $("#txtProfDate").val();
        if (InvoiceNO != "") {
        $("#txtInvoiceNO").prop("disabled", true);
        }
        if (DeliverDate != "") {
        $("#txtInvoiceDate").prop("disabled", true);
        }

        if (ProformaDate != "") {
            $("#txtProfDate").prop("disabled", true);
        }
    $('#txtPONO').select2();


    var ModelNAME = document.getElementById("txtModelName").value;
        if (ModelNAME == "") {
        //console.log("Just Test");
        $('#exampleModal').modal('hide');
    }
        if (ModelNAME != "") {

        $('#exampleModal').modal('show');
    }
});


 

