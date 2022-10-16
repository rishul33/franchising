function closeModel() {
    setVisible('#myModal', false);
    setVisible('#loading', false);
    $('#modal-content').html("");
    setModelHeight("auto");
    $("body").css("overflow", "");
}

function openModel() {
    var isProductPage = $(".hasProduct").length > 0;
    var thisFranchiseId = isProductPage ? JSON.parse($(".hasProduct").attr("data-franchiseInfo")).franchiseId : "";
    var franchiseIdSubmittedArr = JSON.parse(localStorage.getItem('franchiseIdsSubmittedArr'));

    //Scroll to page on fdd ranking pages
    if($('.scrollToForm').length > 0) {
        var franchiseIds = JSON.parse(localStorage.getItem("franchiseIdsArr"));
        var requestLeadBtn = $('.fancyLeadForm.clickEventAttached.block.orange');
        var requestFddForm = $('div.fddFormAnchor');
        if (franchiseIds.length === 0 && requestLeadBtn.length === 0 && requestFddForm.length === 0) {
            $('#requestBar').hide();
        }
        if (requestLeadBtn.length === 0) {
            if (franchiseIds.length === 0) {
                    var offset = $('div.fddFormAnchor').offset();
                    var scrollTo = offset.top - 70;
                    $('body, html').animate({
                        scrollTop: scrollTo
                    }, 'slow');
                    return false;
            }
        }
    }

    if (isProductPage && thisFranchiseId && $('.scrollToForm').length == 0) {
        if (franchiseIdSubmittedArr.indexOf(thisFranchiseId) >= 0) {
            alert(fd.leadFormInformationAlreadyRequested);
            return false;
        }
        var currentIds = JSON.parse(localStorage.getItem('franchiseIdsArr'));
        localStorage.setItem('franchiseIdsArr', JSON.stringify(fd.concat(currentIds, [thisFranchiseId])));
    }
    setVisible('#myModal', true);
    setVisible('#loading', true);

    var franchiseIdsArr = JSON.parse(fd.store.get('franchiseIdsArr'));
    var requestListSourceIdsStruct = JSON.parse(fd.store.get('requestListSourceIdsStruct'));
    $.ajax({
        url: "/lead/two/stage/form/init/",
        type: "GET",
        data: {
            franchiseIdsArr: franchiseIdsArr,
            requestListSourceIdsStruct: requestListSourceIdsStruct,
            fddRequest: false
        },
        success: function (data) {
            $('#modal-content').html(data);
            if (getSavedEmail()) {
                setVisible('#step1', false);
                setVisible('#step2', true);
                setModelHeight("75%");
                $('#two_stage_lead_email').val(getSavedEmail());
                //Second time it should be checked as per request
                localStorage.setItem("TwoStageJoiningList", true);
            } else {
                setVisible('#step2', false);
                setVisible('#step1', true);
                setModelHeight("auto");
                setValues();
            }
            fd.updateFranchises(true);
            fd.initLeadForm("#lf_requestInformationForm");
            setTimeout(function () {
                setValues()
            }, 2000);
            $('#loading').hide();
            copyButtonAndInfoToLeft();
            $('#emailstep1').on('keydown',function(e) {
                var keycode = e.keyCode || e.which;
                if(keycode == 13) {
                    step2();
                    e.preventDefault();
                    return false;
                }
            });
            addStowStageGclid();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Failed to render Lead Form')
        }
    });
}

function copyButtonAndInfoToLeft(){
    $('.right_items').html("");
    $('.lead_footer_to_left').each(function(e,a){
      $('.right_items').append($(a).html());
    });
}

function isValidEmail(){
    if(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( document.getElementById('emailstep1').value)){
        $('#emailstep1-error').hide();
        return true;
    } else {
        $('#emailstep1-error').show();
        $('#emailstep1-error').html($('#emailInputErrorText').val());
        return false;
    }
}

function step2() {
    if (isValidEmail()) {
        var franchiseIdsArr = JSON.parse(fd.store.get('franchiseIdsArr'));
        setVisible('#loading', true);
        $.ajax({
            url: "/lead/two/stage/email/activecampaign/",
            type: "GET",
            data: {
                franchiseIdsArr: franchiseIdsArr,
                email: document.getElementById('emailstep1').value,
                lf_joinMailingList: $('#JoinMailingList_step1:checked').length > 0,
                isBrightVeryfyEnabled: $('#isBrightVeryfyEnabled').val()
            },
            success: function (data) {
                setVisible('#loading', false);
                if(data['result'] === 'failure'){
                        $('#emailstep1-error').show();
                        $('#emailstep1-error').html($('#emailInputErrorText').val());
                } else {
                    setVisible('#step1', false);
                    setVisible('#step2', true);
                    localStorage.setItem("TwoStageEmail", document.getElementById('emailstep1').value);
                    localStorage.setItem("TwoStageJoiningList", $('#JoinMailingList_step1:checked').length > 0);
                    setValues();
                    $('#two_stage_lead_email').val(document.getElementById('emailstep1').value);
                    setModelHeight("75%");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Failed to send request');
            }
        });
    }
}

function setValues() {
    var data = localStorage.getItem('requestInformationFormStruct');
    if (data) {
        var fromdata = JSON.parse(data);
        fromdata['lf_email'] = localStorage.getItem('TwoStageEmail') ? localStorage.getItem('TwoStageEmail') : null;
        localStorage.setItem('requestInformationFormStruct', JSON.stringify(fromdata));
    }
    $('#lf_email').val(getSavedEmail());
    if (localStorage.getItem('TwoStageJoiningList') && (localStorage.getItem('TwoStageJoiningList') === 'true' || localStorage.getItem('TwoStageJoiningList') === true)) {
        $('[name="lf_joinMailingList"]').prop('checked', true);
        $("[name='lf_joinMailingList_label']").addClass("sel");
    } else {
        $('[name="lf_joinMailingList"]').prop('checked', false);
        $("[name='lf_joinMailingList_label']").removeClass("sel");
    }
    try {
        let phone = $('#lf_phone'), lPadd = phone.prev('.iti__flag-container').width() + 6;
        phone.css('padding-left', lPadd);
    } catch (e) {
    }
}

function setModelHeight(height) {
   // document.getElementById("modal-body").style.height = height;
}

function setVisible(id, visible) {
    visible ? $(id).show() : $(id).hide()
}

function getSavedEmail() {
    var savedEmail = "";
    "undefined" != localStorage.getItem("TwoStageEmail") && null != localStorage.getItem("TwoStageEmail") && localStorage.getItem("TwoStageEmail").length > 0 ? savedEmail = localStorage.getItem("TwoStageEmail") : "";
    return savedEmail;
}

//Change button action in floating pending box
setTimeout(function () {
    $('.side_bar_button').removeAttr("href");
    $('.side_bar_button').attr("onclick", "openModel();");
}, 2000);

//Adding OCT scripts here as all.js functions are not accessible here
function addStowStageGclid() {
    try{
        if(localStorage.getItem('gclid')) {
            var gclid = JSON.parse(localStorage.getItem('gclid'));
            var isGclidValid = gclid && new Date().getTime() < gclid.expiryDate;
            var currGclidFormField = document.getElementById('gclid_field');
            if (isGclidValid && currGclidFormField) {
                currGclidFormField.value = gclid.value;
            }
        }
    }catch (e) {
        console.log(e);
    }
}