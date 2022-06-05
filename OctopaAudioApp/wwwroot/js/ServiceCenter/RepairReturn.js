$("body").on("click", "#btnAdd", function () {
    var Serial = $("#txtSerial");
    var Serials = [];
    var DataTable = $("#tblRepDe");
    if (DataTable.length != 0) {
        $("#tblRepDe TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            Data.Serial = row.find("TD").eq(2).html();
            Serials.push(Data);
        });
    }
    var DataS = Serials.find(S => S.Serial === Serial.val());
    if (DataS != undefined) {
        swal("Warning", 'This serial is already exist you can not add it twice!', "error")

    }
    else {
        var ModelName = $("#txtModelName");
        var PartNo = $("#txtpartNo");
        var Country = $("#txtCountryOfOrging");
        var RMANo = $("#txtRmaNo");
        var Quantity = $("#txtQuantity");
        var unitePrice = $("#txtUnitePrice");

        if (ModelName.val() == "" || Serial.val() == "") {
            swal("Warning", 'ModelName or Serial is missed please check if you fill it!', "error")
        }
        else {
            var tBody = $("#tblRepDe > TBODY")[0];
            var row = tBody.insertRow(-1);

            var cell = $(row.insertCell(-1));
            cell.html(ModelName.val());

            var cell = $(row.insertCell(-1));
            cell.html(PartNo.val());

            var cell = $(row.insertCell(-1));
            cell.html(Serial.val());

            var cell = $(row.insertCell(-1));
            cell.html(Country.val());

            var cell = $(row.insertCell(-1));
            cell.html(RMANo.val());

            var cell = $(row.insertCell(-1));
            cell.html(Quantity.val());

            var cell = $(row.insertCell(-1));
            cell.html(unitePrice.val());

            cell = $(row.insertCell(-1));

            var btnRemove = $("<input />");
            btnRemove.attr("type", "button");
            btnRemove.attr("onclick", "Remove(this);");
            btnRemove.val("Remove");
            btnRemove.addClass("btn btn-danger btn-sm");
            cell.append(btnRemove);

        }
        //Clear the TextBoxes.
        ModelName.val("");
        PartNo.val("");
        Serial.val("");
        Country.val("");;
        RMANo.val("");
        Quantity.val("");
        unitePrice.val("");
    }
});
function Remove(button) {
    //Determine the reference of the Row using the Button.
    var row = $(button).closest("TR");
    var name = $("TD", row).eq(0).html();
    if (confirm("Do you want to Delete This Row: " + name)) {
        //Get the reference of the Table.
        var table = $("#tblRepDe")[0];
        //Delete the Table row using it's Index.
        table.deleteRow(row[0].rowIndex);
    }
};
function SearchforSerial() {
    var Serial = $("#txtSerial");
    if (Serial.val() == "") {
        swal("Warning", 'You Search for nothing!', "error")
    }
    else {
        $.ajax({
            type: "POST",
            url: "/ServiceCenterData/SearchForItemSerial?SerialNO=" + Serial.val(),
            success: function (SerialData) {
                console.log(SerialData);
                if (SerialData == null) {
                    swal("Warning", 'There is no data for this serial!', "error")
                }
                else {
                    var ModelName = $("#txtModelName");
                    var BarCode = $("#txtBarCode");
                    var PartNo = $("#txtpartNo");
                    ModelName.val(SerialData.modelName);
                    BarCode.val(SerialData.barCode);
                    PartNo.val(SerialData.partNumber);
                }
            },
            error: function () {
                swal("Warning", 'The Adress is requierd!', "error")
            }
        });
    }
  
}
function CancelConfirmation() {
    swal({
        title: "Are you sure?",
        text: "You want to cancel this RMA!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    },
        function () {
            window.location = "/ServiceCenterData/RepairAndReturnView"
        }

    );

}
$("body").on("click", "#btnSave", function () {

    var ShipTo = $("#txtShipTo");
    var Shipping = $('#cehckShipping').is(":checked");
    var Suplliers = $("#drpSupllier");
    var MethodType = $("#drpMethod");
    var Address = $("#txtAdress");
    var ContactPerson = $("#txtContactP");
    var From = $("#txtfrom");
    var To = $("#txtTO");
    var Comments = $("#txtComments");

    if (ShipTo.val() == "" || Suplliers.val() == 0 || Address.val() == "" || ContactPerson.val() == "" || From.val() == "" || To.val() == "" || Comments.val() == "") {
        swal("Warning", 'Please , make sure that you fill all data  because all data is required!', "error")
    }
    else {
        var RepH = {};
        RepH.ShipTo = ShipTo.val();
        if ($('#cehckShipping').is(":checked")) {
            RepH.Shipping = true;
        }
        else {
            RepH.Shipping = false;
        }
        RepH.Suppliers = Suplliers.val();
        RepH.MethodType = MethodType.val();
        RepH.Address = Address.val();
        RepH.ContactPerson = ContactPerson.val();
        RepH.From = From.val();
        RepH.To = To.val();
        RepH.Comments = Comments.val();


        var RepDS = new Array();
        $("#tblRepDe TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            Data.Model = row.find("TD").eq(0).html().trim();
            Data.PartNo = row.find("TD").eq(1).html().trim();
            Data.Serial = row.find("TD").eq(2).html().trim();
            Data.CountryOfOrigin = row.find("TD").eq(3).html().trim();
            Data.RMANo = row.find("TD").eq(4).html().trim();
            Data.NoOfPieces = row.find("TD").eq(5).html().trim();
            Data.UnitPrice = row.find("TD").eq(6).html().trim();
            RepDS.push(Data);
        });
    }
    if (RepDS.length == 0 ) {
          swal("Warning", 'There is no data to save', "error")
      }
    if (RepDS.length != 0) {
        var Data = { RepDS, RepH };
        console.log(RepDS, RepH);
        $.ajax({
            type: "POST",
            url: "/ServiceCenterData/SaveNewRepair",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (NRMAREQNO) {
                    swal({
                        title: "Done",
                        text: 'Data Saved Done',
                        type: "success",
                        confirmButtonClass: "btn-primary",
                        confirmButtonText: "OK",
                        closeOnConfirm: false
                    },
                        function () {
                            window.location = "/ServiceCenterData/RepairDetails?ReqNo=" + NRMAREQNO
                        }
                    );
               
            },
            error: function (responseText)
            {
                swal("Warning", responseText, "error")
            }
        });
    }   
    });

    
