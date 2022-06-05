function CreateExcuse() {
    var EmpCode = $("#txtEXEmpCode");
    var ExDate = $("#txtexDate");
    var Startin = $("#txttimein");
    var Endin = $("#txttimeout");
    var Duration = $("#drpDuration");
    var Mession = $('#checkMessions');

    $.ajax({
        type: "POST",
        url: "/EmployeeData/CreateExcuse?EmpCode=" + EmpCode.val() + "&drpDuration=" + Duration.val() + "&TimeFrom=" + Startin.val() + "&TimeTo=" + Endin.val() + "&ExcuseType=" + Mession.val() + "&EXDate=" + ExDate.val(),
        success: function (json) {
            if (json == "Data Saved Successfully") {
                swal({
                    title: "Done",
                    text: json,
                    type: "success",
                    confirmButtonClass: "btn-primary",
                    confirmButtonText: "OK",
                    closeOnConfirm: false
                },
                    function () {
                        window.location.reload();
                    });
            }
            if (json != "Data Saved Successfully") {
                swal("Warning", json, "error")
            }
        }
    });
}

$(document).ready(function () {
    var TotalReslutFinal = 0;
    $("#tblEvaluation TBODY TR").each(function () {
        var row = $(this);
        var Weight = parseInt(row.find("TD").eq(4).find("input").val());
        var Score = parseInt(row.find("TD").eq(3).find("input").val());
        var Evaulation = parseInt(row.find("TD").eq(5).find("input").val());
        var Reslut = (Evaulation / Score) * Weight;
        TotalReslutFinal += Reslut;
    });
    $("#txtResult").val(TotalReslutFinal);
    $("#EvaluationResult").text(TotalReslutFinal);


    $("input").change(function () {
        // var G = Total;
        //$("input[name=Gtotal]").val(Total);
        $(".txtMult input").keyup(multInputs);
        function multInputs() {
            var mult = 0;
            // for each row:
            $("tr.txtMult").each(function () {
                // get the values from this row:
                var $val1 = $('.val1', this).val();
                var $val2 = $('.val2', this).val();
                var $val3 = $('.val3', this).val();
                var $total = (($val1) / ($val2)) * $val3;
                // set total for the row
                // $('.multTotal', this).text($total);
                mult += $total;
            });
            $("#txtResult").val(parseInt(mult));
        }
    });
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
$("body").on("click", "#btnSaveKpiEvaluation", function () {
    var checkWeight = 0;
    var NEVDE = new Array();
    var ResultEv = $("#txtResult").val();
    var EvalCode = $("#EvalCode").val();
    var EmpCode = $("#txtEmpCodeEval").val();
    $("#tblEvaluation TBODY TR").each(function () {
        var Error = false
        var row = $(this);
        var Data = {};
        var EV = parseInt(row.find("TD").eq(4).find("input").val());
        var Score = parseInt(row.find("TD").eq(3).find("input").val());
        Data.DECode = row.find("TD").eq(6).html();
        Data.Evaulation = parseInt(row.find("TD").eq(5).find("input").val());
        Data.Weigh = parseInt(row.find("TD").eq(4).find("input").val());
        Data.Score = parseInt(row.find("TD").eq(3).find("input").val());
        checkWeight += EV;
        NEVDE.push(Data);
    });
    console.log(checkWeight);
    if (parseInt(checkWeight) != 100) {
        swal("Oops", "The sum of Weight must equale 100", "error")
    }
    else {

        var error = false;
        for (var i = 0; i < NEVDE.length; i++) {
            if (NEVDE[i].Score < NEVDE[i].Evaulation) {
                error = true
            }
        }
        if (error == false) {
            console.log(NEVDE);
            var Data = { NEVDE };
            $.ajax({
                type: "POST",
                url: "/EmployeeData/Evaluation?TotalEV=" + ResultEv + "&EmpCode=" + EmpCode + "&EvalCode=" + EvalCode,
                data: JSON.stringify(Data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    if (json == "Evaluation Updated Successfully") {
                        //error = false
                        $("#lblMessage").html("Evaluation Done Successfully");
                        $('#SuucssfalesMessage').modal('show');
                    }
                    if (json != "Evaluation Updated Successfully") {
                        $("#lblMessage").html(json);
                        $('#MessageModel').modal('show');
                    }
                }
            });
        } else {
            swal("Error!", "Pleasdaer", "error")
        }

    }
});

function ExcusesActions(ExNo, EmpCode, Type) {
    $.ajax({
        type: "POST",
        url: "/EmployeeData/ExcusesActions?EXCode=" + ExNo + "&EmCode=" + EmpCode + "&Etype=" + Type ,
        success: function (json) {
            if (json == "Data Saved Successfully") {
                swal({
                    title: "Done",
                    text: json,
                    type: "success",
                    confirmButtonClass: "btn-primary",
                    confirmButtonText: "OK",
                    closeOnConfirm: false,
                    allowOutsideClick: false
                },
                    function () {
                        window.location.reload();
                    });
            }
            if (json != "Data Saved Successfully") {
                swal("Warning", json, "error")
            }
        }
    });
}

function PendingVacations(TransNO, VType, Vaction) {
    $.ajax({
        type: "POST",
        url: "/EmployeeData/PendingVacations?TransNo=" + TransNO + "&Vtype=" + VType + "&Vaction=" + Vaction,
        success: function (json) {
            if (json == "Data Saved Successfully") {
                swal({
                    title: "Done",
                    text: json,
                    type: "success",
                    confirmButtonClass: "btn-primary",
                    confirmButtonText: "OK",
                    closeOnConfirm: false,
                    allowOutsideClick: false
                },
                    function () {
                        window.location.reload();
                    });
            }
            if (json != "Data Saved Successfully") {
                swal("Warning", json, "error")
            }
        }
    });
}


$("body").on("click", "#btnsaveVacaion", function () {
    var EmpCode = $("#txtVacEmpCode");
    var Manager = $("#txtManger");
    var StartDate = $("#txtVStartDate");
    var EndDate = $("#txtVEndDate");
    var BackToWork = $("#txtVBackDate");
    var LastBalance = $("#txtVBalanace");
    var VType = $("#drpVtype");
    var Note = $("#txtVnotes");
    if (EndDate.val() < StartDate.val()) {
        $("#lblerrormessage").html("The StartDate must be less than EndDate ");
        $('#WarningMessage').modal('show');
    }
    if (EndDate.val() > BackToWork.val()) {

        $("#lblerrormessage").html("The EndDate must be less than Back To Work Date ");
        $('#WarningMessage').modal('show');
    }
    if (VType.val() == 0) {
        $("#lblerrormessage").html("You Must Select Vacation Type ");
        $('#WarningMessage').modal('show');
    }
    if (VType.val() != 0 && EndDate.val() >= StartDate.val() && EndDate.val() <= BackToWork.val()) {
        var EMPVA = {};
        EMPVA.Manager = Manager.val();
        EMPVA.StartDate = StartDate.val();
        EMPVA.EndDate = EndDate.val();
        EMPVA.BackToWork = BackToWork.val();
        EMPVA.LastBalance = LastBalance.val();
        EMPVA.VType = VType.val();
        EMPVA.Note = Note.val();
        var Data = { EMPVA };
        $.ajax({
            type: "POST",
            url: "/EmployeeData/CreateVacations?EmpCode=" + EmpCode.val(),
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json == "Data Updated Done") {
                    swal({
                        title: "Done",
                        text: json,
                        type: "success",
                        confirmButtonClass: "btn-primary",
                        confirmButtonText: "OK",
                        closeOnConfirm: false,
                        allowOutsideClick: false
                    },
                        function () {
                            window.location.reload();
                        });
                }
                if (json != "Data Updated Done") {
                    swal("Warning", json, "error")
                }
            }
        });
    }
});