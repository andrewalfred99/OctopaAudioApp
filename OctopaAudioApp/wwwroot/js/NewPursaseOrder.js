 $(document).ready(function () {
    $('#drpsup').select2();
    $('#txtPONO').select2();
});

function onlyNumberKey(evt) {
    // Only ASCII charactar in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}
$(document).ready(function () {
    $("body").on("click", "#btnSave", function () {
        //Order Data
        var OrderREf = $("#txtRef");
        var Supplier = $("#txtSupllier");
        var Prices = $("#drpPrices");
        var Groupname = $("#txtGroupName");
        var PaymentMethod = $("#drpPaymentMehod");
        var PONO = $("#txtPONO");
        var Notes = $("#txtNotes");
        var Currancy = $("#txtCurrency");
        var Total = $("#txtTotal");
        var GTotal = $("#txtGtotal");
        var Discount = $("#txtDiscount");
        var PaymentTerms = $("#txtPaymentTerm");
        if (PaymentTerms.val() == 0) {
            $("#lblerrormessage").html("you must select the PaymentTerms for this Order");
            $('#WarningMessage').modal('show');
        }
        if (PaymentTerms.val() != 0) {
            var LOH = {};
            LOH.OrderREf = OrderREf.val();
            LOH.Supplier = Supplier.val();
            LOH.Prices = Prices.val();
            LOH.Groupname = Groupname.val();
            LOH.PaymentMethod = PaymentMethod.val();
            LOH.PaymentTerms = PaymentTerms.val();
            if ($('#txtCIF').is(":checked")) {
                LOH.CIF = true;
            }
            else {
                LOH.CIF = false;
            }
            if ($('#checkSPO').is(":checked")) {
                LOH.SPOrder = true;
            }
            else {
                LOH.SPOrder = false;
            }
            LOH.PONO = PONO.val();
            LOH.Notes = Notes.val();
            LOH.Currancy = Currancy.val();
            LOH.Total = Total.val();
            LOH.GTotal = GTotal.val();
            LOH.Discount = Discount.val();
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

            var LOD = new Array();
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
            $("#TblDetailes TBODY TR").each(function () {
                var row = $(this);
                var Data = {};
                Data.ModelName = row.find("TD").eq(0).html().trim();
                Data.QTY = parseInt(row.find("TD").eq(2).html());
                Data.UnitPrice = parseFloat(row.find("TD").eq(3).html());
                LOD.push(Data);
            });
            var Data = { LOD, LOH, LORC, LORCG, BillTo, ShipTo };
            console.log(Data);
            $.ajax({
                type: "POST",
                url: "/AllocatedItems/InsertNewOrderItems",
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
                            closeOnConfirm: false
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

    });
});

