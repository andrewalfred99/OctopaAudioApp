
window.onbeforeunload = function () {

    sessionStorage.setItem("Supllier", $('#drpsup').val());
    sessionStorage.setItem("Currncy", $('#drpCurrncy').val());
    sessionStorage.setItem("Group", $('#drpGroup').val());

}
window.onload = function () {
    var Supllier = sessionStorage.getItem('Supllier');
    if (Supllier !== null) $('#drpsup').val(Supllier);

    var Currncy = sessionStorage.getItem('Currncy');
    if (Currncy !== null) $('#drpCurrncy').val(Currncy);
    var Group = sessionStorage.getItem('Group');
    if (Group !== null) $('#drpGroup').val(Group);
}
$(document).ready(function (e) {
    var To = 0;
    $("#tblorder TBODY TR").each(function () {
        var row = $(this);
        var Pto = row.find("TD").eq(8).find("input").val();
        var Unite = row.find("TD").eq(9).find("input").val();
        var Multi = (Pto * Unite);
        To += Multi;
    });
    console.log(To);
    $("#lblTotalFinal").val(To);
    $("#lblGrandTotal").val(To);

    $("input").change(function () {
        var Total = 0;
        $("input[name=gider]").each(function () {
            Total = Total + parseInt($(this).val());
        });
        var G = Total;
        //$("input[name=Gtotal]").val(Total);
        $(".txtMult input").keyup(multInputs);
        function multInputs() {
            var mult = 0;
            $("tr.txtMult").each(function () {
                var $val1 = $('.val1', this).val();
                var $val2 = $('.val2', this).val();
                var $total = ($val1) * ($val2);
                $('.multTotal', this).text($total);
                mult += $total;
            });
            $("#lblGrandTotal").val(mult);
            var FinalTotal = parseFloat(G + mult).toFixed(2);
            $("#lblTotalFinal").val(FinalTotal);
        }
    });

    $("body").on("click", "#btnSave", function () {
        var RequestNo = $("#txtReqno");
        var OrderRef = $("#txtRef");
        var Total = $("#lblTotalFinal");
        var TotalAfterDiscount = $("#lblGrandTotal");
        var Discount = $("#lblGGtotal");
        var AddedBy = $("#txtUser");
        var GroupName = $("#txtGroupNameFinal");
        var Supplier = $("#drpsup");
        var Currency = $("#drpCurrncy");
        var Notes = $("#txtNotes");
        var GetOrderItemsH = {};
        GetOrderItemsH.RequestNo = RequestNo.val();
        GetOrderItemsH.Total = Total.val();
        GetOrderItemsH.Notes = Notes.val();
        GetOrderItemsH.TotalAfterDiscount = TotalAfterDiscount.val();
        GetOrderItemsH.Discount = Discount.val();
        GetOrderItemsH.OrderRef = OrderRef.val();
        GetOrderItemsH.AddedBy = AddedBy.val();
        GetOrderItemsH.GroupName = GroupName.val();
        GetOrderItemsH.Supplier = Supplier.val();
        GetOrderItemsH.Currency = Currency.val();
        var ORID = new Array();
        //console.log(GroupName.val());
        $("#tblorder TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            var Qt = row.find("TD").eq(8).find("input").val();
            if (parseInt(Qt) != 0) {
                Data.BrandName = row.find("TD").eq(1).html();
                Data.ModelName = row.find("TD").eq(2).html();
                Data.Qty = row.find("TD").eq(8).find("input").val();
                Data.UnitPrice = row.find("TD").eq(9).find("input").val();
                ORID.push(Data);
            }
        });
        if (ORID.length == 0) {
            $("#lblerrormessage").html("Please Add one item At least");
            $('#WarningMessage').modal('show');
        }
        if (Currency.val() == "" || Currency.val() == 0 || Currency.val() == null || Supplier.val() == "" || Supplier.val() == 0 || Supplier.val() == null) {
            $("#lblerrormessage").html("Please fell all data for this order");
            $('#WarningMessage').modal('show');
        }
        else {
            var Data = { ORID, GetOrderItemsH };
            console.log(Data);
            $.ajax({
                type: "POST",
                url: "/AllocatedItems/InsertNewOrder",
                data: JSON.stringify(Data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    $("#lblMessage").html(json);
                    $('#SuucssfalesMessage').modal('show');
                },
                error: function () {
                    $("#lblerrormessage").html(json);
                    $('#WarningMessage').modal('show');
                }
            });
        }
       
    });
});
//AddItem Button
function AddNewItemSearch(Parm) {
    var RequestNo = $("#txtReqno");
    var GroupName = $("#txtGroupNameFinal");
    var search = Parm;
    var GetOrderItemsH = {};
    GetOrderItemsH.RequestNo = RequestNo.val();
    GetOrderItemsH.GroupName = GroupName.val();
    var GetReservationViewSql = new Array();
    $("#tblorder TBODY TR").each(function () {
        var row = $(this);
        var Data = {};
        Data.BrandName = row.find("TD").eq(1).html();
        Data.ModelName = row.find("TD").eq(2).html().trim();
        Data.PTO = row.find("TD").eq(8).find("input").val().trim();
        Data.UnitPrice = row.find("TD").eq(9).find("input").val().trim();
        GetReservationViewSql.push(Data);
    });
    //console.log(GetReservationViewSql);
    var Data = { GetReservationViewSql, GetOrderItemsH };
    $.ajax({
        type: "POST",
        url: "/AllocatedItems/AddItem?search=" + search + "&drpGroup=" + GroupName.val(),
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json == "Data Saved Successfully") {
                location.reload();
                localStorage.clear();
                sessionStorage.clear();
            }
            if (json != "Data Saved Successfully") {
                $("#lblerrormessage").html(json);
                $('#WarningMessage').modal('show');
            }

        }
    });
};
function RemoveFunction(Parm) {
    var RequestNo = $("#txtReqno");
    var GroupName = $("#drpGroup");
    var ModelDelted = Parm;

    var GetOrderItemsH = {};
    GetOrderItemsH.RequestNo = RequestNo.val();
    GetOrderItemsH.GroupName = GroupName.val();
    var GetReservationViewSql = new Array();
    $("#tblorder TBODY TR").each(function () {
        var row = $(this);
        var Data = {};
        // var Qt = row.find("TD").eq(7).find("input").val();
        Data.BrandName = row.find("TD").eq(1).html();
        Data.ModelName = row.find("TD").eq(2).html().replace(/\n/g, '');
        Data.PTO = row.find("TD").eq(8).find("input").val().replace(/\n/g, '');
        Data.UnitPrice = row.find("TD").eq(9).find("input").val().replace(/\n/g, '');
        GetReservationViewSql.push(Data);
    });
    var Data = { GetReservationViewSql, GetOrderItemsH };
    $.ajax({
        type: "POST",
        url: "/AllocatedItems/DeleteItem?ModelDelete=" + ModelDelted,
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            $("#lblMessage").html(json);
            $('#SuucssfalesMessage').modal('show');
        }
    });
};
$("body").on("click", "#btnDeleteRange", function () {
    var Group = $("#txtGroupNameFinal").val();
    var GetReservationViewSql = new Array();
    $("#tblorder TBODY TR").each(function () {
        var row = $(this);
        var Data = {};
        // var Qt = row.find("TD").eq(7).find("input").val();
        Data.BrandName = row.find("TD").eq(1).html();
        Data.ModelName = row.find("TD").eq(2).html().replace(/\n/g, '');
        Data.PTO = row.find("TD").eq(8).find("input").val().replace(/\n/g, '');
        Data.UnitPrice = row.find("TD").eq(9).find("input").val().replace(/\n/g, '');
        GetReservationViewSql.push(Data);
    });
    var Data = { GetReservationViewSql };

    $.ajax({
        type: "POST",
        url: "/AllocatedItems/DeleteOverQuantity?GName=" + Group,
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json == "Data Deletd Succ") {
                window.location.reload();
            }
        }
    });
});
$("body").on("click", "#btnUpdateAfterSearch", function () {
    var Group = $("#txtGroupNameFinal").val();
    var GetReservationViewSql = new Array();
    $("#tblorder TBODY TR").each(function () {
        var row = $(this);
        var Data = {};
        // var Qt = row.find("TD").eq(7).find("input").val();
        Data.BrandName = row.find("TD").eq(1).html();
        Data.ModelName = row.find("TD").eq(2).html().trim();
        Data.PTO = row.find("TD").eq(8).find("input").val().trim();
        Data.UnitPrice = row.find("TD").eq(9).find("input").val().trim();
        GetReservationViewSql.push(Data);
    });
    var Data = { GetReservationViewSql };

    $.ajax({
        type: "POST",
        url: "/AllocatedItems/UpdateAfterSearch",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json == "Data Updated Done") {
                $('#AddItem').modal('show');
            }
            if (json != "Data Updated Done") {
                $('#AddItem').modal('hide');
            }
        }
    });
});

function Aftersuccess() {
    var RequestNo = $("#txtReqno").val().trim();
    var OrderRef = $("#txtRef").val();
    sessionStorage.clear();
    localStorage.clear();
    $.ajax({
        type: "GET",
        url: "/AllocatedItems/DelteFromSql?ReqNo=" + RequestNo + "&Orderrf=" + OrderRef,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            window.location.href = "/AllocatedItems/Details?id=" + RequestNo + "&OrderRef=" + OrderRef;
        },
        error: function () {
            $("#lblerrormessage").html(json);
            $('#WarningMessage').modal('show');
        }
    });
}