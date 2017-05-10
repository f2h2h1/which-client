app.service('userSer', function($http, $ionicLoading, $ionicPopup) {
    this.myFunc = function(x) {
        return x.toString(16);
    }
    this.aa = function() {
        let a;
        $http.get("welcome.htm").then(function(response) {
            alert(1)
            alert(response.data)
            a = response.data;
            return a;
        });
    }
    this.getCookie = function(c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1
                c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    }
    this.setCookie = function(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        var s = "; expires=" + exdate.toGMTString();
        var temp = c_name + "=" + escape(value) + s
        document.cookie = temp;
    }
    this.deleteCookie = function(name) { this.setCookie(name, "", -1); }
    this.clearCookie = function() {
        this.deleteCookie("userId");
        this.deleteCookie("timestamp");
        this.deleteCookie("session");
        this.deleteCookie("phone");
        this.deleteCookie("nickName");
        this.deleteCookie("logourl");
    }
    this.checkCookie = function() {
        let userId = this.getCookie("userId");
        let timestamp = this.getCookie("timestamp");
        let session = this.getCookie("session");
        let phone = this.getCookie("phone");
        let nickName = this.getCookie("nickName");
        let logourl = this.getCookie("logourl");
        if (userId != "" && timestamp != "" && session != "" && hex_md5(userId + timestamp) == session) {
            appData.user.userId = userId;
            appData.user.timestamp = timestamp;
            appData.user.session = session;
            appData.user.phone = phone;
            appData.user.nickName = nickName;
            appData.user.logourl = logourl;
            return true;
        } else {
            return false;
        }
    }
    this.loginCookie = function() {
        this.setCookie("userId", appData.user.userId, 30);
        this.setCookie("timestamp", appData.user.timestamp, 30);
        this.setCookie("session", appData.user.session, 30);
        this.setCookie("phone", appData.user.phone, 30);
        this.setCookie("nickName", appData.user.nickName, 30);
        this.setCookie("logourl", appData.user.logourl, 30);
    }
    this.showloading = function(tp) {
        if (tp == "") tp = "Loading...";
        $ionicLoading.show({
            template: tp,
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    }
    this.hideloading = function() {
        $ionicLoading.hide();
    }
    this.showalert = function(title, content) {
        //  alert（警告） 对话框
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: content
        });
        alertPopup.then(function(res) {
            //console.log('Thank you for not eating my delicious ice cream cone');
        });
    }
    this.uploadPic = function(fileObj) {
        var FileController = "http://up.imgapi.com/"; // 接收上传文件的后台地址 

        // FormData 对象
        var form = new FormData();
        var token = appData.tietukuToken;

        form.append("Token", token);
        form.append("file", fileObj); // 文件对象
        form.append("from", "file");
        form.append("httptype", "2");

        // XMLHttpRequest 对象
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.open("post", FileController, true);

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                //this.writeObj(xmlhttp.responseText);
                console.log(xmlhttp.responseText)
                let tempobj = this.getJsonFromString(xmlhttp.responseText);
                if (tempobj) {
                    if (tempobj.s_url != "") {
                        appData.registerData.userPicUrl = tempobj.s_url;
                    } else {

                    }
                } else {

                }

            }
        }
        xmlhttp.send(form);
    };
    this.packageUploadPic = function(fileObj) {
        var form = new FormData();
        var token = appData.tietukuToken;

        form.append("Token", token);
        form.append("file", fileObj); // 文件对象
        form.append("from", "file");
        form.append("httptype", "2");
        return form;
    }

    this.clearRegisterData = function() {
        appData.registerData.phone = null;
        appData.registerData.passworda = null;
        appData.registerData.passwordb = null;
        appData.registerData.nickName = null;
        appData.registerData.userPic = null;
        appData.registerData.userPicUrl = null;
    }
    this.getIndexData = function() {
        let postData = "event=index&&userid=" + appData.user.userId +
            "&&timestamp=" + appData.user.timestamp +
            "&&session=" + appData.user.session;
        $http({
            method: 'post',
            url: appData.postUrl,
            data: postData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then(function successCallback(response) {
            let tempobj = response.data;
            appData.content = tempobj.content;
            // console.log(tempobj)
        }, function errorCallback(response) {
            // userSer.showalert("首页", "网络错误 201");
        });
    }
    this.getJsonFromString = function(str) {
            try {
                return JSON.parse(str);
            } catch (err) {
                return false;
            }
        }
        // 打印变量
    this.writeObj = function(obj) {
        var description = "";
        for (var i in obj) {
            var property = obj[i];
            description += i + " = " + property + "\n";
        }
        console.log(description);
    }

    this.setCookie2 = function() {
        this.setCookie("userId", "123", 30);
        this.setCookie("timestamp", "123456789", 30);
        this.setCookie("session", "215212eff2c4b47779ebdcff95cc2d96", 30);
    }
    this.showCookie = function() {
        let userId = this.getCookie("userId");
        let timestamp = this.getCookie("timestamp");
        let session = this.getCookie("session");
        console.log("userId=" + userId + "\n" + "timestamp=" + timestamp + "\n" + "session=" + session);
    }


});