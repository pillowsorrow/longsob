$( document ).ready(function() {
    $('.MemberDisplay > span').text(getCookie("cookieProfileRealName"));
    $('.MemberDisplay > img').attr('src', getCookie("cookieProfileAvatar"));
    $('#become_a_modular').attr('href', 'https://aced-bn.nacc.go.th/regisadmin?uid=' + getCookie("cookieProfileID"));
});