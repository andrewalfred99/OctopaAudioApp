$("body").on("click", "#btnAdd", function () {

    var PhoneNO = $("#txtPhone");
    var PhoneType = $("#txtType");

    if (PhoneNO.val() == "" || PhoneType.val() == "") {
        alert("Please fill all data to add the Row");
        return;
    }

    var tBody = $("#tblPhone > TBODY")[0];

    var row = tBody.insertRow(-1);

    var cell = $(row.insertCell(-1));
    cell.html(PhoneNO.val());

    var cell = $(row.insertCell(-1));
    cell.html(PhoneType.val());

    cell = $(row.insertCell(-1));


    var btnRemove = $("<input />");
    btnRemove.attr("type", "button");
    btnRemove.attr("onclick", "Remove(this);");
    btnRemove.val("Remove");
    btnRemove.addClass("btn btn-danger btn-sm");
    cell.append(btnRemove);

    //Clear the TextBoxes.
    PhoneNO.val("");
    PhoneType.val("");

    //$("body").on("click", "#btnSave", function () {
    //    //Loop through the Table rows and build a JSON array.
    //    var PhoneD = new Array();
    //    $("#tblPhone  TBODY TR").each(function () {
    //        var row = $(this);
    //        var Data = {};
    //        Data.PhoneNO = row.find("TD").eq(0).html();
    //        Data.PhoneType = row.find("TD").eq(1).html();
    //        PhoneD.push(Data);

    //    });
    //    console.log(PhoneD);
    //    var Data = {PhoneD};
    //    //$.ajax({
    //    //    type: "POST",
    //    //    url: "/Companies/InsertPhone",
    //    //    data: JSON.stringify(Data),
    //    //    contentType: "application/json; charset=utf-8",
    //    //    dataType: "json",
    //    //    success: function (json) {
    //    //        if (json.isRedirect) {
    //    //            window.location.href = json.redirectUrl;
    //    //        }
    //    //        alert(r + " record(s) inserted.");
    //    //    }
    //    //});

    //});

});

function Remove(button) {
    //Determine the reference of the Row using the Button.
    var row = $(button).closest("TR");
    var name = $("TD", row).eq(0).html();
    if (confirm("Do you want to delete: " + name)) {

        //Get the reference of the Table.
        var table = $("#tblPhone")[0];

        //Delete the Table row using it's Index.
        table.deleteRow(row[0].rowIndex);
    }
};

