$(document).ready(function () {
    $('#drpGroupname').select2();
    $('#txtPONO').select2(); 
});
function CreateOrder() {
    var ReqN = $("#txtReqNo").val()
    var OrderREf = $("#txtRef");
    var Total = $("#txtTotal")
    var Prices = $("#drpPrices");
    var Groupname = $("#drpGroupname");
    var PaymentMethod = $("#drpPaymentMehod");
    var PONO = $("#txtPONO");
    var Notes = $("#txtNotes");
    var Currancy = $("#txtCurrency");
    var PaymentTerms = $("#txtPaymentTerm");

    if (OrderREf.val() == "") {
        swal("Warning", 'Sorry , you must enter the Order Refrence', "error")
    }
    if (Groupname.val() == 0) {
        swal("Warning", 'Sorry , you must enter the GroupName', "error")
    }
    if ($('#txtCIF').is(":checked") && PONO.val() == 0) {
        swal("Warning", 'Sorry , you must enter the PONO if this order CIF', "error")
    }
    if (OrderREf.val() != "" && Groupname.val() != 0  ) {
        var LOH = {};
        LOH.OrderREf = OrderREf.val();
        LOH.Prices = Prices.val();
        LOH.Groupname = Groupname.val();
        LOH.PaymentMethod = PaymentMethod.val();
        LOH.PaymentTerms = PaymentTerms.val();
        if ($('#txtCIF').is(":checked") && PONO.val() == 0) {
            LOH.CIF = true;
        }
        else {
            LOH.CIF = false;
        }

        LOH.PONO = PONO.val();
        LOH.Notes = Notes.val();
        LOH.Currancy = Currancy.val();
        LOH.Total = Total.val();

        var BillTo = {};
        //Bill TO
        var Address = $("#txtBillAdress");
        var City = $("#txtBillCity");
        var Company = $("#txtBillCompany");
        var Contact = $("#txtBillContact");
        var PostalCode = $("#txtBillPost");
        var Tel = $("#txtBillPhone");
        var Fax = $("#txtCurrency");
        var Email = $("#txtBillEmail");
        var Vat = $("#txtBillVat");

        //BillTo.OrderCode = OrderREf.val();
        BillTo.Address = Address.val();
        BillTo.City = City.val();
        BillTo.Company = Company.val();
        BillTo.Contact = Contact.val();
        BillTo.PostalCode = PostalCode.val();
        BillTo.Tel = Tel.val();
        BillTo.Fax = Fax.val();
        BillTo.Email = Email.val();
        BillTo.Vat = Vat.val();
        //ship To
        var ShipTo = {};
        var Address = $("#txtShipAdress");
        var City = $("#txtShipCity");
        var Company = $("#txtShipCompany");
        var Contact = $("#txtShipContact");
        var PostalCode = $("#txtShipPost");
        var Tel = $("#txtShipPhone");
        var Fax = $("#txtCurrency");
        var Email = $("#txtShipEmail");
        var Vat = $("#txtShipVat");

        ShipTo.OrderCode = OrderREf.val();
        ShipTo.Address = Address.val();
        ShipTo.City = City.val();
        ShipTo.Company = Company.val();
        ShipTo.Contact = Contact.val();
        ShipTo.PostalCode = PostalCode.val();
        ShipTo.Tel = Tel.val();
        ShipTo.Fax = Fax.val();
        ShipTo.Email = Email.val();
        ShipTo.Vat = Vat.val();

        var LORC = new Array();
        var LORCG = new Array();
        //tblGenralRE
        $("#tblSupRE TBODY TR").each(function () {
            var row = $(this);
            var DataS = {};
            var ChechS = row.find("TD").eq(0).find("input").is(':checked');
            if (ChechS == true) {
                DataS.Code = row.find("TD").eq(2).html().trim();
                LORC.push(DataS);
            }
        });
        $("#tblGenralRE TBODY TR").each(function () {
            var row = $(this);
            var DataSG = {};
            var ChechS = row.find("TD").eq(0).find("input").is(':checked');
            if (ChechS == true) {
                DataSG.Code = row.find("TD").eq(2).html().trim();
                LORCG.push(DataSG);
            }
        });
        var Data = { LOH, LORC, LORCG, BillTo, ShipTo };
        console.log(Data);
        $.ajax({
            type: "POST",
            url: "/AllocatedItems/InsertNewRROrder?RequestNo=" + ReqN,
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success:
                function () {
                    swal({
                        title: "Done",
                        text: 'Data saved successfully',
                        type: "success",
                        confirmButtonClass: "btn-primary",
                        confirmButtonText: "OK",
                        closeOnConfirm: false,
                        allowOutsideClick: false
                    },
                        function () {
                            window.location = "/OrderStatus/OrderDetailes?Ref=" + OrderREf.val()
                        }
                    );
                },
            error: function () {
                swal("Warning", error, "error")
            }
        });
    }
}