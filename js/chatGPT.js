function checkPassword1() {
    var password = document.getElementById("passwordInput1").value;
    var secretContent = document.getElementById("secretContent1");

    if(password === "530827") { // 这里设置你的密码
        secretContent.style.display = "block";
    } else {
        alert("密码错误！");
    }
}

function checkPassword2() {
    var password = document.getElementById("passwordInput2").value;
    var secretContent = document.getElementById("secretContent2");

    if(password === "123456") { // 这里设置你的密码
        secretContent.style.display = "block";
    } else {
        alert("密码错误！");
    }
}

function copyToClipboard1() {
    var content = document.getElementById("contentToCopy1").innerText;
    var tempInput = document.createElement("input");
    document.body.appendChild(tempInput);
    tempInput.value = content;
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert("内容已复制到剪贴板");
}

function copyToClipboard2() {
    var content = document.getElementById("contentToCopy2").innerText;
    var tempInput = document.createElement("input");
    document.body.appendChild(tempInput);
    tempInput.value = content;
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert("内容已复制到剪贴板");
  }