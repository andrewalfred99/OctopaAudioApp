$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

//add Items in Sqlight

// Save New ShipMent
$("body").on("click", "#btnSave", function () {
    //Header Data
    var CIN = $("#txtCiNo").val();
    var CID = $("#txtCiDate").val();
    if (CIN == "" || CID == "") {
        $("#lblerrormessage").html("Please Insert CI NO OR CI Date For This ShipMent");
        $('#WarningMessage').modal('show');
    }
    else {
        var ShipName = $("#txtShipName");
        var CINO = $("#txtCiNo");
        var CIDate = $("#txtCiDate");
        var Currency = $("#drpCurrency");
        var ShippingMethod = $("#drpShipMethod");
        var ETA = $("#txtETA");
        var ETS = $("#txtETS");
        var Forwarder = $("#txtForwarder");
        var Rate = $("#txtRate");
        var ClearanceFeez = $("#txtCFeez");
        var ClearanceStatus = $("#txtCStatus");
        var DocStatus = $("#txtDocStatus");
        var Total = $("#lblTotalFinal");
        var Discount = $("#lblGGtotal");
        var DocFeez = $("#txtDfees");
        var FinalTotal = $("#lblGrandTotal");
        var GroupName = $("#txtbakupGName");
        var RateCurrency = $("#drpRateCurrency");
        var RateNotes = $("#txtRNotes");
        var Dimension = $("#txtDimension");

        var OSHC = {};
        OSHC.ShipName = ShipName.val();
        OSHC.CINO = CINO.val();
        OSHC.CIDate = CIDate.val();
        OSHC.Currency = Currency.val();
        OSHC.ShippingMethod = ShippingMethod.val();
        if (ETA.val() == "") {
            OSHC.ETA = null;
        }

        if (ETA.val() != "") {
            OSHC.ETA = ETA.val();
        }
        if (ETS.val() == "") {
            OSHC.ETS = null;
        }
        if (ETS.val() != "") {
            OSHC.ETS = ETS.val();
        }
        //OSHC.ETA = ETA.val();
        //OSHC.ETS = ETS.val();
        OSHC.Forwarder = Forwarder.val();
        OSHC.Rate = Rate.val();
        OSHC.ClearanceFeez = ClearanceFeez.val();
        OSHC.ClearanceStatus = ClearanceStatus.val();
        OSHC.DocStatus = DocStatus.val();
        OSHC.Total = Total.val();
        OSHC.Discount = Discount.val();
        OSHC.DocFeez = DocFeez.val();
        OSHC.FinalTotal = FinalTotal.val();
        OSHC.GroupName = GroupName.val();
        OSHC.RateCurrency = RateCurrency.val();
        OSHC.RateNotes = RateNotes.val();
        OSHC.Dimension = Dimension.val();

        //Item Data
        var OSHDE = new Array();
        $("#tblOrderItems TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            Data.CINO = CINO.val();
            Data.OrderRef = row.find("TD").eq(1).html();
            Data.ModelName = row.find("TD").eq(2).html();
            Data.BarCode = row.find("TD").eq(3).html();
            Data.QTY = row.find("TD").eq(4).html();
            Data.UnitPrice = row.find("TD").eq(5).html();
            Data.Notes = row.find("TD").eq(7).find("textarea").val();
            OSHDE.push(Data);
        });
        console.log(OSHC);
        var Data = { OSHC, OSHDE };
        $.ajax({
            type: "POST",
            url: "/OrderShipMents/CreateNewShipment?GroupName=" + GroupName.val(),
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json == "Data Saved Successfully") {
                    $("#lblerrormessage").html("ShipMent Saved Successfully");
                    $('#SuucssfalesMessage').modal('show');
                }
                if (json != "Data Saved Successfully") {
                    $("#lblerrormessage").html(json);
                    $('#WarningMessage').modal('show');
                }
            }
        });
    }

});
        //btn Update ShipMent
// Insert Into Header
$("body").on("click", "#btnSaveHeader", function () {
    var OrderRef = $(this).val();
    var GName = $("#txtbakupGName").val();
    var ShipName = $("#txtShipName");
    var CINO = $("#txtCiNo");
    var CIDate = $("#txtCiDate");
    var Currency = $("#drpCurrency");
    var ShippingMethod = $("#drpShipMethod");
    var ETA = $("#txtETA");
    var ETS = $("#txtETS");
    var Forwarder = $("#txtForwarder");
    var Rate = $("#txtRate");
    var ClearanceFeez = $("#txtCFeez");
    var ClearanceStatus = $("#txtCStatus");
    var DocStatus = $("#txtDocStatus");
    var Discount = $("#lblGGtotal");
    var DocFeez = $("#txtDfees");
    var GroupName = $("#txtbakupGName");
    var RateCurrency = $("#drpRateCurrency");
    var RateNotes = $("#txtRNotes");
    var Dimension = $("#txtDimension");
    if (CIDate.val() == "" && CINO.val() == "") {
        $("#lblerrormessage").html("please insert CI NO and CI Date");
        $('#WarningMessage').modal('show');
    }
    if (CIDate.val() != "" && CINO.val() != "") {
        var OSHC = {};
        OSHC.ShipName = ShipName.val();
        OSHC.CINO = CINO.val();
        OSHC.CIDate = CIDate.val();
        OSHC.Currency = Currency.val();
        OSHC.ShippingMethod = ShippingMethod.val();
        if (ETA.val() == "") {
            OSHC.ETA = null;
        }

        if (ETA.val() != "") {
            OSHC.ETA = ETA.val();
        }
        if (ETS.val() == "") {
            OSHC.ETS = null;
        }
        if (ETS.val() != "") {
            OSHC.ETS = ETS.val();
        }
        //OSHC.ETA = ETA.val();
        //OSHC.ETS = ETS.val();
        OSHC.Forwarder = Forwarder.val();
        if (Rate.val() == "") {
            OSHC.Rate = 0;
        }
        if (Rate.val() != "") {
            OSHC.Rate = Rate.val();
        }
        if (Discount.val() == "") {
            OSHC.Rate = 0;
        }
        if (Discount.val() != "") {
            OSHC.Discount = Discount.val();
        }
        if (DocFeez.val() == "") {
            OSHC.DocFeez = 0;
        }
        if (DocFeez.val() != "") {
            OSHC.DocFeez = DocFeez.val();
        }
        if (ClearanceFeez.val() == "") {
            OSHC.ClearanceFeez = 0;
        }
        if (ClearanceFeez.val() != "") {
            OSHC.ClearanceFeez = ClearanceFeez.val();
        }
        //OSHC.Rate = Rate.val();
        //OSHC.ClearanceFeez = ClearanceFeez.val();
        OSHC.ClearanceStatus = ClearanceStatus.val();
        OSHC.DocStatus = DocStatus.val();
        //OSHC.Discount = Discount.val();
        // OSHC.DocFeez = DocFeez.val();
        OSHC.GroupName = GroupName.val();
        OSHC.RateCurrency = RateCurrency.val();
        OSHC.RateNotes = RateNotes.val();
        OSHC.Dimension = Dimension.val();
        //console.log(OrderRef, GName);
        var Data = { OSHC };
        $.ajax({
            type: "POST",
            url: "/OrderShipMents/InsertHeadrData?GName=" + GroupName.val() + "&OrderRef=" + OrderRef + "&ShipName=" + ShipName.val(),
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json == "Data Saved Successfully") {
                    window.location = "/OrderShipMents/GetOrderItems?OrderRef=" + OrderRef + "&GName=" + GName + "&Shipname=" + ShipName.val();
                }
                if (json != "Data Saved Successfully") {
                    $("#lblerrormessage").html(json);
                    $('#WarningMessage').modal('show');
                }
            }
        });
    }

});
$(document).ready(function () {
    //Auto Cal Total
    var Total = 0;
    $("#tblOrderItems TBODY TR").each(function () {
        var row = $(this);
        var qty = row.find("TD").eq(4).html();
        var Unite = row.find("TD").eq(5).html();
        var Mul = (qty * Unite);
        Total += Mul;
    });
    $("#lblTotalFinal").val(Total);
    $("#lblGrandTotal").val(Total);
});
//Calculate Grand Total
getPrice = function () {
    var Total = Number(document.getElementById("lblTotalFinal").value);
    var DisCount = Number(document.getElementById("lblGGtotal").value);
    var DocFees = Number(document.getElementById("txtDfees").value);
    var totalValue = (Total + DocFees) - (Total * (DisCount / 100));
    document.getElementById("lblGrandTotal").value = totalValue.toFixed(2);
}
$("body").on("click", "#btnClose", function () {
    var ShipName = $("#txtShipName");
    $("#lblerrorcancelmessage").html("Once Canceld, you will not be able to recover this ShipMent Data!");
    $('#Warningcansel').modal('show');
});

