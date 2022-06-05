



window.onbeforeunload = function () {
    sessionStorage.setItem("RequestDate", $('#txtrequestDate').val());
    sessionStorage.setItem("ShipTo", $('#txtshipto').val());
    sessionStorage.setItem("shiping", $('#chekshiping').val());
    sessionStorage.setItem("Suplier", $('#drpsup').val());
    sessionStorage.setItem("Adress", $('#txtadress').val());
    sessionStorage.setItem("ContactPerson", $('#txtcontct').val());
    sessionStorage.setItem("From", $('#txtfrom').val());
    sessionStorage.setItem("TO", $('#txtto').val());
    sessionStorage.setItem("Comment", $('#txtcomment').val());
    //sessionStorage.setItem("From", $('#txtfrom').val());

}
window.onload = function () {
    //console.log("Rbna ystor")
    var RequestDate = sessionStorage.getItem('RequestDate');
    if (RequestDate !== null) $('#txtrequestDate').val(RequestDate);

    var ShipTo = sessionStorage.getItem('ShipTo');
    if (ShipTo !== null) $('#txtshipto').val(ShipTo);

    var shiping = sessionStorage.getItem('shiping');
    if (shiping !== null) $('#chekshiping').val(shiping);

    var Suplier = sessionStorage.getItem('Suplier');
    if (Suplier !== null) $('#drpsup').val(Suplier);

    var Adress = sessionStorage.getItem('Adress');
    if (Adress !== null) $('#txtadress').val(Adress);

    var ContactPerson = sessionStorage.getItem('ContactPerson');
    if (ContactPerson !== null) $('#txtcontct').val(ContactPerson);

    var From = sessionStorage.getItem('From');
    if (From !== null) $('#txtfrom').val(From);

    var TO = sessionStorage.getItem('TO');
    if (TO !== null) $('#txtto').val(TO);

    var Comment = sessionStorage.getItem('Comment');
    if (Comment !== null) $('#txtcomment').val(Comment);
}

    $("body").on("click", "#btnSave", function () {
        //Loop through the Table rows and build a JSON array.
       
        var ReqDate = $("#txtReqDate");
        var ShipTo = $("#txtshipto");
        var Shipping= $("#chekshiping");
        var Suplliers = $("#drpsup");
        var selectedVal = "";
        var MethodType = $("input[type='radio'][name='Mehod']:checked");
        if (MethodType.length > 0) {
            selectedVal = MethodType.val();
        }
        else
        {
            alert("the value is 0");
            return;
        }
        //var MethodType = $("#radrepair");
        //var MethodType = $("#radReturnOnly");
        //var MethodType = $("#radReplacements");
        //var MethodType = $("#radReturnfaultyunit");
        var Address = $("#txtadress");
        var ContactPerson = $("#txtcontct");
        var From = $("#txtfrom");
        var To = $("#txtto");
        var Comments = $("#txtcomment");
       
        var RepH = {};
        RepH.ReqDate = ReqDate.val();
        RepH.ShipTo = ShipTo.val();
        RepH.Shipping = Shipping.val();
        RepH.Suppliers = Suplliers.val();
        RepH.MethodType = selectedVal;
        RepH.Address = Address.val();
        RepH.ContactPerson = ContactPerson.val();
        RepH.From = From.val();
        RepH.To = To.val();
        RepH.Comments = Comments.val();
        var RepDS = new Array();

        $("#tblRep TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            Data.ReqNo = row.find("TD").eq(0).html();
            Data.Model = row.find("TD").eq(1).html();
            Data.BarCode = row.find("TD").eq(2).html();
            Data.PartNo = row.find("TD").eq(3).html();
            Data.Serial = row.find("TD").eq(4).html();
            Data.CountryOfOrigin = row.find("TD").eq(5).html();
            Data.RMANo = row.find("TD").eq(6).html();
            Data.NoOfPieces = row.find("TD").eq(7).html();
            Data.UnitPrice = row.find("TD").eq(8).html();
            RepDS.push(Data);

        });
        console.log(RepDS, RepH);
        var Data = { RepDS, RepH };
        $.ajax({
            type: "POST",
            url: "/RepairAndReturnHeaders/InsertRepairAndReturn",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.isRedirect) {
                    window.location.href = json.redirectUrl;
                }
                alert(r + " record(s) inserted.");
            }
        });

    });

    
function RemoveFunction(Parm) {
    var Data = [];
    Data.Serial = Parm;
    var data = { Data, Parm };
    console.log(JSON.stringify(data));
    $.ajax({
        type: "POST",
        url: "/RepairAndReturnHeaders/Remove",
        data: JSON.stringify(Parm),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            var newrow = $("tblRep tr:last-child");
            location.reload();
        }

    });
};
