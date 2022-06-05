$("body").on("click", "#btnAddAuto", function () {


    var Persentage = $("#txtPercA");
    var Amounts = $("#txtAmountA");
    var NumberOfDays = $("#txtNoDaysA");
    var Date = $("#txtDateA");
    var TextNote = $("#txtCommentA");
    var Type = $("#drpTypesA option:selected");
    var Status = $("#drstatusA option:selected");

   
    var tBody = $("#tblauto > TBODY")[0];

    var row = tBody.insertRow(-1);

    var cell = $(row.insertCell(-1));
    cell.html(Type.val());

    var cell = $(row.insertCell(-1));
    cell.html(Persentage.val());

    var cell = $(row.insertCell(-1));
    cell.html(Amounts.val());


    var cell = $(row.insertCell(-1));
    cell.html(NumberOfDays.val());

    var cell = $(row.insertCell(-1));
    cell.html(Date.val());

    var cell = $(row.insertCell(-1));
    cell.html(Status.val());

    var cell = $(row.insertCell(-1));
    cell.html(TextNote.val());

    cell = $(row.insertCell(-1));

    var btnRemove = $("<input />");
    btnRemove.attr("type", "button");
    btnRemove.attr("onclick", "Remove(this);");
    btnRemove.val("Remove");
    btnRemove.addClass("btn btn-danger btn-sm");
    cell.append(btnRemove);

    //Clear the TextBoxes.
    Persentage.val("");
    Amounts.val("");
    Days.val("");
    Date.val("");
    Notes.val("");
    Type.rowIndex = -1;
    status.rowIndex = -1;

});


$("body").on("click", "#btnAdd", function () {

    var Persentage = $("#txtPerc");
    var Amounts = $("#txtAmount");
    var NumberOfDays = $("#txtNoDays");
    var Date = $("#txtDate");
    var TextNote = $("#txtComment");
    var Type = $("#drpTypes option:selected");
    var Status = $("#drstatus option:selected");

    if (Persentage.val() == "" || Amounts.val() == "" || NumberOfDays.val() == "" || Date.val() == "" ) {
        swal({
            title: "Misiing Data",
            text: "You Must Enter All Data To add",
            icon: "warning",
            button: "OK",
            dangerMode: true,
            timer: 5000000,
        })
    }

    else {
        var tBody = $("#tblCollection > TBODY")[0];

        var row = tBody.insertRow(-1);

        var cell = $(row.insertCell(-1));
        cell.html(Type.val());

        var cell = $(row.insertCell(-1));
        cell.html(Persentage.val());

        var cell = $(row.insertCell(-1));
        cell.html(Amounts.val());


        var cell = $(row.insertCell(-1));
        cell.html(NumberOfDays.val());

        var cell = $(row.insertCell(-1));
        cell.html(Date.val());

        var cell = $(row.insertCell(-1));
        cell.html(Status.val());

        var cell = $(row.insertCell(-1));
        cell.html(TextNote.val());

        cell = $(row.insertCell(-1));

        var btnRemove = $("<input />");
        btnRemove.attr("type", "button");
        btnRemove.attr("onclick", "Remove(this);");
        btnRemove.val("Remove");
        btnRemove.addClass("btn btn-danger btn-sm");
        cell.append(btnRemove);

        //Clear the TextBoxes.
        Persentage.val("");
        Amounts.val("");
        Days.val("");
        Date.val("");
        Notes.val("");
        Type.rowIndex = -1;
        status.rowIndex = -1;

    }

   
});

function Remove(button) {
    //Determine the reference of the Row using the Button.
    var row = $(button).closest("TR");
    var name = $("TD", row).eq(0).html();
    if (confirm("Do you want to delete: " + name)) {

        //Get the reference of the Table.
        var table = $("#tblCollection")[0];

        //Delete the Table row using it's Index.
        table.deleteRow(row[0].rowIndex);
    }
};


function ShowTableAuto() {
    var lTable = document.getElementById("AutoTable");
    //var ButtonSave = document.getElementById("diVbuttons");
    lTable.style.visibility = "visible";
    //ButtonSave.style.visibility = "visible";
}

function ShowTableManu() {

    var lTable = document.getElementById("DivCollection");
   //var ButtonSave = document.getElementById("diVbuttons");
    lTable.style.visibility = "visible";
    //ButtonSave.style.visibility = "visible";
}


$("body").on("click", "#btnAuto", function () {

    var btnMan = document.getElementById("btnManuel");
    btnMan.style.visibility = "hidden";
    var Lbl = document.getElementById("lbltype");
    Lbl.innerText = "Auto";
});

$("body").on("click", "#btnManuel", function () {

    var BtnAuto = document.getElementById("btnAuto");
    BtnAuto.style.visibility = "hidden";
    var Lbl = document.getElementById("lbltype");
    Lbl.innerText = "Manuel";
});





