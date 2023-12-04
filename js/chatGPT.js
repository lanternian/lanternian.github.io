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
    // 获取要复制的内容
    var content = document.getElementById("contentToCopy1").innerText;
  
    // 创建一个临时的 textarea 元素来选择文本
    var tempElement = document.createElement("textarea");
    tempElement.value = content;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand("copy"); // 执行复制操作
    document.body.removeChild(tempElement); // 移除临时元素
    alert("内容已复制到剪贴板"); // 可选：提供反馈
}

function copyToClipboard2() {
    // 获取要复制的内容
    var content = document.getElementById("contentToCopy2").innerText;
  
    // 创建一个临时的 textarea 元素来选择文本
    var tempElement = document.createElement("textarea");
    tempElement.value = content;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand("copy"); // 执行复制操作
    document.body.removeChild(tempElement); // 移除临时元素
    alert("内容已复制到剪贴板"); // 可选：提供反馈
  }