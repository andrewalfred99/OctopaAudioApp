
    $(document).ready(function () {
        $("#tblDetaiels TBODY TR").each(function () {
            var row = $(this);
            var NewAdd = row.find("TD").eq(1).find("input").is(':checked');
            var DeleteCheck = row.find("TD").eq(2).find("input");
            var UpdateCheck = row.find("TD").eq(3).find("input");
            if (NewAdd == true) {
                row.find("TD").eq(2).find("input").prop("disabled", true);
                row.find("TD").eq(3).find("input").prop("disabled", true);
            }

            $(UpdateCheck).on('click', function () {
                if (UpdateCheck.is(':checked') == true) {
                    row.find("TD").eq(6).find("input").prop("disabled", false);
                    row.find("TD").eq(2).find("input").prop("disabled", true);
                    row.find("TD").eq(7).find("input").prop("disabled", false);
                }
                else {
                    row.find("TD").eq(2).find("input").prop("disabled", false);
                    row.find("TD").eq(6).find("input").prop("disabled", true);
                    row.find("TD").eq(7).find("input").prop("disabled", true);
                }
            });

            $(DeleteCheck).on('click', function () {
                if (DeleteCheck.is(':checked') == true) {
                    row.find("TD").eq(3).find("input").prop("disabled", true);
                    row.find("TD").eq(7).find("input").prop("disabled", true);
                }
                else {
                    row.find("TD").eq(3).find("input").prop("disabled", false);
                }
            });
        });

    });

    function UpdatedDone() {
        window.location.reload();
}

    $(document).ready(function () {
        $("#ModelName").keypress(function () {
            var searchtext = $(this).val();
            $.ajax({
                type: "POST",
                url: "/AllocatedItems/GetSearchForItem?SearchText=" + searchtext,
                contentType: "html",
                success: function (response) {
                    $("#TB").html(response);
                }
            })
        })
    })

    function myFunction(ModelName, QTY, UnitePrice, RequestNO, GroupName) {
        var AMELIST = new Array();
        $("#tbPo TBODY TR").each(function () {
            var row = $(this);
            var Data = { };
            var Quant = row.find("TD").eq(2).find("input").val();
            var UnitePrice = row.find("TD").eq(3).find("input").val();
            if (Quant != 0 && UnitePrice != 0) {
             Data.ModelName = row.find("TD").eq(0).html().trim();
                Data.QTY = row.find("TD").eq(2).find("input").val();
                Data.UnitePrice = row.find("TD").eq(3).find("input").val();
                AMELIST.push(Data);
            }
        });
        var OrderRef = $("#txtOrderRef").val();
        var RequestNO = $('#txtRequestNO').val();
        var GroupName = $('#txtGroupName').val();
        //AME.OrderRef = OrderRef;
        var UpdatedItems = new Array();
        $("#tblDetaiels TBODY TR").each(function () {
            var row = $(this);
            //var newitem = row.find("TD").eq(0).find("input").is(':checked');
            var deleteitem = row.find("TD").eq(2).find("input").is(':checked');
            var updateitem = row.find("TD").eq(3).find("input").is(':checked');
            var Data = {};
            if (updateitem == true || deleteitem == true) {
                Data.ModelName = row.find("TD").eq(4).html().trim();
                if (deleteitem == true) {
                    Data.Delete = true;
                    Data.Update = false;
                    Data.AddNew = false;
                }
                if (updateitem == true) {
                    Data.Update = true;
                    Data.QTY = row.find("TD").eq(6).find("input").val();
                    Data.UnitePrice = row.find("TD").eq(7).find("input").val();
                    Data.Delete = false;
                    Data.AddNew = false;
                }
                UpdatedItems.push(Data);
            }
        });

        var Data = { AMELIST, UpdatedItems};
        console.log(Data);
        $.ajax({
        type: "POST",
            url: "/AllocatedItems/AddAmenItem?RequestNo=" + RequestNO + "&GroupName=" + GroupName + "&OrderRef=" + OrderRef,
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json == "Data Saved Successfully") {
                    window.location.reload();
                }
                else {
                    $("#lblerrormessage").html(json);
                    $('#WarningMessage').modal('show');
                }   
            },
            error: function (json) {
                $("#lblerrormessage").html(json);
                $('#WarningMessage').modal('show');
            }
        });
    }
    //Save Function
    $("body").on("click", "#btnUpdate", function () {
        var OrderRef = $("#txtOrderRef").val();
        var RequestNo = $("#txtRequestNO").val();
        var UpdatedItems = new Array();
        $("#tblDetaiels TBODY TR").each(function () {
            var row = $(this);
            var newitem = row.find("TD").eq(1).find("input").is(':checked');
            var deleteitem = row.find("TD").eq(2).find("input").is(':checked');
            var updateitem = row.find("TD").eq(3).find("input").is(':checked');
            var Data = { };
            if (updateitem == true || newitem == true || deleteitem == true) {
              Data.OrderRef = OrderRef;
                Data.ModelName = row.find("TD").eq(4).html();
                Data.QTY = row.find("TD").eq(6).find("input").val();
                Data.UnitePrice = row.find("TD").eq(7).find("input").val();
                if (newitem == true) {
                    Data.AddNew = true;
                    Data.UnitePrice = row.find("TD").eq(7).find("input").val();
                    Data.BrandName = row.find("TD").eq(5).html();
                }
                if (deleteitem == true) {
                  Data.Delete = true;
                }
                if (updateitem == true) {
                  Data.Update = true;
                }
                UpdatedItems.push(Data);
            }
        });
        var Data = {UpdatedItems};
        console.log(Data);
        if (UpdatedItems.length == 0) {
        $("#lblerrormessage").html("ou do not Any Update");
          $('#WarningMessage').modal('show');
        }
        if (UpdatedItems.length != 0) {

        $.ajax({
            type: "POST",
            url: "/AllocatedItems/UpdateAmendItems?RequestNo=" + RequestNo + "&OrderRef=" + OrderRef,
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                    $("#lblMessage").html(json);
                    $('#SuucssfalesMessage').modal('show');   
            },
            error: function (json) {
                $("#lblerrormessage").html(json);
                $('#WarningMessage').modal('show');
            }
            
        });
        }

    });
