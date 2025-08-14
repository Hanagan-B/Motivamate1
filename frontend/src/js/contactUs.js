var nameError = document.getElementById("name-error");

var phoneError = document.getElementById("phone-error");

var emailError = document.getElementById("email-error");

var messageError = document.getElementById("message-error");

var submitError = document.getElementById("submit-error");

var email2Error = document.getElementById("email2-error");


function validateName(){
    var name = document.getElementById("sub-name").value;

    if (name.length == 0){
        nameError.innerHTML = "Name is required";
        return false;
    }

    if(!name.match(/^[A-Za-z]*\s{1}[A-Za-z]*$/)){
        nameError.innerHTML = "Full name is required";
        return false;
    }

    nameError.innerHTML = '<i class="fa-solid fa-check-double"> </i>';
    return true;
}

function validatePhone(){
    var phone = document.getElementById("sub-phone").value;

    if (phone.length == 0){
        phoneError.innerHTML = "Please enter phone number";
        return false;
    }

    if(phone.length !==10){
        phoneError.innerHTML = "Please enter a 10 digits phone";
        return false;
    }
    if(!phone.match(/^[0-9]{10}$/)){
        phoneError.innerHTML = "Please enter digits";
        return false;
    }

    phoneError.innerHTML = '<i class="fa-solid fa-check-double"> </i>';
    return true;
}

function validateEmail(){ 
    var email = document.getElementById("sub-email").value;

    if(email.length == 0){
        emailError.innerHTML = 'Please enter email'
        return false;

    }
    if(!email.match(/^[A-Za-z\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
        emailError.innerHTML = 'Please enter a valid email'
        return false;
    }
    emailError.innerHTML = '<i class="fa-solid fa-check-double"> </i>';
    return true;
}

function validateMessage(){
    var message = document.getElementById("sub-message").value;
    var size = 30;
    var left = size - message.length;

    if (left>0){
        messageError.innerHTML = left + "more characters needed";
        return false;
    }

    messageError.innerHTML = '<i class="fa-solid fa-check-double"> </i>';
    return true;
 }

 function validateForm(){
    if (!validateName()|| !validatePhone() || !validateEmail() || !validateMessage()){
        submitError.style.display = "block";
        submitError.innerHTML = "Please fix error to submit";
        setTimeout(function(){submitError.style.display = "none";}, 3000);
        return false;
    }
    submitError.innerHTML = alert('Thank you for your message')
 }
 
 function validateEmail2(){ 
    var email2 = document.getElementById("sub-email2").value;

    if(email2.length == 0){
        email2Error.innerHTML = 'Please enter email'
        return false;

    }
    if(!email2.match(/^[A-Za-z\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
        email2Error.innerHTML = 'Please enter a valid email'
        return false;
    }
    email2Error.innerHTML = '<i class="fa-solid fa-check-double"> </i>';
    return true;
}