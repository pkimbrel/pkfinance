/**
 * Created by pkimbrel on 3/26/14.
 */
$(document).ready(function () {

    $('.sidebar').affix();
    $.fn.editable.defaults.mode = "inline";
    $.fn.editable.defaults.inputclass = "";
    $.fn.editable.defaults.ajaxOptions = {
        type: "GET"
    };

    var categories = ["Life Insurance","cat2"];
    var updateUrl = "controller/transactions/" + $("#account").val() + "-" + $("#month option:selected").text() + "/update";

    $(".transactions .date").editable({
        type: "text",
        validate: function (value) {
            if (!moment(value).isValid()) {
                return "Please format date YYYY-MM-DD";
            }

        },
        url: updateUrl,
        success: function () {
            readTransactions();
        }
    });

    $(".transactions .amount").editable({
        url: updateUrl,
        success: function () {
            readTransactions();
        }
    });

    $(".transactions .description").editable({
        url: updateUrl,
        success: function () {
            readTransactions();
        }
    });

    $(".transactions .category").editable({
        "type": "select",
        "source": categories,
        url: updateUrl,
        success: function () {
            readTransactions();
        }
    });

    $(".transactions .transactionType").editable({
        "type": "select",
        "source": [{
            "text": "Debit",
            "value": "Debit"
        }, {
            "text": "Credit",
            "value": "Credit"
        }],
        url: updateUrl,
        success: function () {
            readTransactions();
        }
    });

    $(".transactions .transactionCleared input").change(function () {
        $.ajax(updateUrl, {
            data: "pk=" + $(this).attr("data-pk") + "&name=cleared&value=" + $(this).is(":checked"),
            success: function () {
                readTransactions();
            }
        });
    });

    $(".trash").click(function () {
        if (confirm("Are you sure?")) {
            var removeURL = "controller/transactions/" + $("#account").val() + "-" + $("#month option:selected").text() + "/remove";
            $.ajax(removeURL, {
                data: "tranid=" + $(this).attr("data-pk"),
                success: function () {
                    readTransactions();
                }
            });
        }
    });

});
