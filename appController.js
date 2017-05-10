app.controller('mainController', function($state, $scope, $http, userSer) {
    // 默认跳转到状态 tab1
    //$state.go('indexI.indexMainI');


    let flg = userSer.checkCookie();
    // console.log(flg);
    if (flg == true) {
        $state.go('indexI.indexMainI');
    } else {
        $state.go('loginMainI.loginI');
    }

    // $scope.$on("$ionicView.enter", function(event, data) {
    //     if (userSer.checkCookie() == false) {
    //         $state.go('loginMainI.loginI');
    //     }
    // });
    $scope.$on("$ionicView.enter", function(event, data) {
        if (userSer.checkCookie() == true) {
            if (appData.content == null) {
                userSer.getIndexData();
                // console.log("getIndexData")
            }
        }
    });
});
app.controller('loginController', function($state, $scope, $http, $ionicLoading, $timeout, $ionicViewSwitcher, $ionicPopup, $ionicScrollDelegate, userSer) {
    $scope.login = true;
    $scope.loginnext = true;
    $scope.loginregister = true;

    // 点击输入框时，输入框向上弹起100px;
    $scope.scollbottom = function() {
        document.getElementById("loginViewContent").childNodes[0].style.cssText = "transform: translate3d(0px, -100px, 0px) scale(1);"
    }
    $scope.login = function(loginPhone, loginPwd) {
        let postData = "";
        let timestamp = new Date().getTime();
        postData = "event=login&&" + "tel=" + loginPhone + "&&psw=" + loginPwd + "&&timestamp=" + timestamp;
        // console.log(postData);
        userSer.showloading();
        $http({
            method: 'post',
            url: appData.postUrl,
            data: postData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then(function successCallback(response) {
            let tempobj = response.data;
            if (tempobj) {
                if (tempobj.state == 1) {
                    appData.user.phone = loginPhone;
                    appData.user.nickName = tempobj.nickname;
                    appData.user.userId = tempobj.userid;
                    appData.user.logourl = tempobj.logo;
                    appData.user.timestamp = timestamp;
                    appData.user.session = tempobj.session;
                    $ionicViewSwitcher.nextDirection("exit");
                    $state.go('indexI.indexMainI', { id: "asdqwe123" });
                    userSer.loginCookie();
                    userSer.writeObj(appData.user);
                    // console.log(hex_md5(appData.user.userId + appData.user.timestamp));
                } else {
                    userSer.showalert("登录失败", "手机号或密码错误"); //203
                }
            } else {
                userSer.showalert("登录失败", "网络错误 202");
            }
        }, function errorCallback(response) {
            userSer.showalert("登录失败", "网络错误 201");
        });
        userSer.hideloading();
    }

    $scope.loginNext = function(registerPhone, registerPawa, registerPawb) {
        if (registerPhone == null) {
            userSer.showalert("错误", "手机号码不能为空");
            return;
        }
        if (registerPawa == null) {
            userSer.showalert("错误", "密码不能为空");
            return;
        }
        if (registerPawb == null) {
            userSer.showalert("错误", "请再输一遍密码");
            return;
        }
        if (registerPawa != registerPawb) {
            userSer.showalert("错误", "两个密码不一致");
            return;
        } else if (registerPawa.length > 20 || registerPawa.length < 6) {
            userSer.showalert("错误", "密码长度不合法");
            return;
        }
        // data.registerData.uesrPic = null;
        appData.registerData.phone = registerPhone;
        appData.registerData.passworda = registerPawa;
        $ionicViewSwitcher.nextDirection("exit");
        $state.go('loginMainI.loginRegisterI');
    };
    $scope.register = function(registerNickName) {
        // console.log(registerNickName)
        if (registerNickName == null) {
            userSer.showalert("错误", "昵称不能为空");
            return;
        }
        if (appData.registerData.uesrPic == null) {
            userSer.showalert("错误", "头像不能为空");
            return;
        }
        if (registerNickName.length > 10) {
            userSer.showalert("错误", "昵称长度不合法");
            return;
        }
        appData.registerData.nickName = registerNickName;
        userSer.showloading("注册中");
        //userSer.uploadPic(data.registerData.uesrPic);
        let postData = userSer.packageUploadPic(appData.registerData.uesrPic);
        let FileController = "http://up.imgapi.com/";
        // XMLHttpRequest 对象
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("post", FileController, true);
        xmlhttp.onload = function() {
            // console.log(xmlhttp.responseText)
            let tempobj = userSer.getJsonFromString(xmlhttp.responseText);
            if (tempobj) {
                if (tempobj.s_url != "" && tempobj.s_url != null) {
                    appData.registerData.userPicUrl = tempobj.s_url;
                    postData = "event=register&&tel=" + appData.registerData.phone +
                        "&&psw=" + appData.registerData.passworda +
                        "&&nickname=" + appData.registerData.nickName +
                        "&&logo=" + appData.registerData.userPicUrl;
                    // console.log(postData);
                    $http({
                        method: 'post',
                        url: appData.postUrl,
                        data: postData,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    }).then(function successCallback(response) {
                        let tempobj = response.data;
                        if (tempobj.state == 1) {
                            // console.log(response.data);
                            userSer.clearRegisterData();
                            userSer.showalert("注册成功", "");
                            userSer.hideloading();
                            //$ionicViewSwitcher.nextDirection("exit");
                            $state.go('loginMainI.loginI');
                            return;
                        } else {
                            userSer.showalert("注册失败", "该手机已被注册 103");
                        }
                    }, function errorCallback(response) {
                        userSer.showalert("注册失败", "网络错误 102");
                    });
                } else {
                    userSer.showalert("注册失败", "网络错误 101");
                }
            } else {
                userSer.showalert("注册失败", "网络错误 100");
            }
            userSer.hideloading();
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                //this.writeObj(xmlhttp.responseText);
            }
        }
        xmlhttp.send(postData);

    };
    $scope.img_upload = function(files) {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var domElemId = document.getElementById("uploaduserpic");
        var fileObj = files[0]; // js 获取文件对象
        if (((fileObj.size / 1024) / 1024) > 10) {
            userSer.showalert("提示", "图片不得大于10M！");
            return;
        }
        appData.registerData.uesrPic = fileObj;

        if (fileObj) {

        } else {
            $ionicLoading.hide();
            return;
        }

        var reader = html5Reader(fileObj);
        reader.onload = function(e) {
            domElemId.style.backgroundImage = "url('" + this.result + "')";
            $ionicLoading.hide();
        }

        function html5Reader(file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            return reader;
        }
    }

});
app.controller("indexController", function($state, $scope, $stateParams, $http, userSer) {
    // if (userSer.checkCookie() == false) { $state.go('loginMainI.loginI'); }
    // console.log("id" + $stateParams.id);
    userSer.writeObj($stateParams);
    $scope.goBack = function() {
        history.back(-1);
    };
    $scope.type = appData.type;
    $scope.indexContent;
    $scope.$on("$ionicView.enter", function(event, datas) {

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
            $scope.indexContent = appData.content;
            // let a = 0;
            // let b = 0;
            // let c = 0;
            // for (let i = 0; i < $scope.indexContent.length; i++) {
            //     if ($scope.indexContent[i].type == 1) {
            //         $scope.indexContent[i]["index"] = a;
            //         a++;
            //     } else if ($scope.indexContent[i].type == 2) {
            //         $scope.indexContent[i]["index"] = b;
            //         b++;
            //     } else if ($scope.indexContent[i].type == 3) {
            //         $scope.indexContent[i]["index"] = c;
            //         c++;
            //     }
            // }
            $scope.indexContent2 = [];
            for (let j = 0; j < appData.type.length; j++) {
                appData.type[j].count = 0;
            }
            for (let i = 0; i < $scope.indexContent.length; i++) {
                for (let j = 0; j < appData.type.length; j++) {
                    if ($scope.indexContent[i].type == appData.type[j].number) {
                        $scope.indexContent[i]["index"] = appData.type[j].count;
                        appData.type[j].count++;
                    }
                }
                for (let k = 0; k < appData.homePage.length; k++) {
                    // console.log($scope.indexContent[i].publishid + "  " + appData.homePage[k].publishid)
                    if ($scope.indexContent[i].publishid == appData.homePage[k].publishid) {
                        $scope.indexContent2[k] = $scope.indexContent[i];
                        $scope.indexContent2[k]["image"] = appData.homePage[k].image;
                        break;
                    }
                }
            }
            // console.log($scope.indexContent)
            // console.log($scope.indexContent2)

            // console.log(tempobj)
        }, function errorCallback(response) {
            userSer.showalert("首页", "网络错误 201");
        });

    });
    $scope.gotoQuestins = function(index, type) {
        // console.log(index + " " + type);
        $state.go('questionsI', { index: index, type: type, publishid: -99 });
    }
});
app.controller("searchController", function($state, $scope, $stateParams, $http, userSer) {
    // if (userSer.checkCookie() == false) { $state.go('loginMainI.loginI'); }

    $scope.goBack = function() {
        history.back(-1);
    };
    $scope.searchKeyup = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.searchResult = null;
            // console.log("searchKeyup")
            // console.log($scope.searchText)
            let postData = "event=search&&userid=" + appData.user.userId +
                "&&timestamp=" + appData.user.timestamp +
                "&&session=" + appData.user.session +
                "&&keyword=" + $scope.searchText;
            // console.log(postData)
            $http({
                method: 'post',
                url: appData.postUrl,
                data: postData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }).then(function successCallback(response) {
                let tempobj = response.data;
                // console.log(tempobj);
                $scope.searchResult = tempobj.content;
            }, function errorCallback(response) {
                //userSer.showalert("失败", "网络错误 201");
            });

        }
    }
    $scope.gotoQuestins = function(publishid, type) {

        $state.go('questionsI', { index: -88, type: type, publishid: publishid });
    }
});
app.controller("askingquestionsController", function($state, $scope, $ionicLoading, userSer) {
    $scope.goBack = function() {
        history.back(-1);
    };
    $scope.img_upload = function(files, flg) {
        // console.log(flg);
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        // console.log(flg);
        if (flg == 1) {
            var domElemId = document.getElementById("uploadpica");
            var fileObj = files[0]; // js 获取文件对象
            if (((fileObj.size / 1024) / 1024) > 10) {
                userSer.showalert("提示", "图片不得大于10M！");
                return;
            }
            appData.uploadData.optionaPic = fileObj;
        } else if (flg == 2) {
            var domElemId = document.getElementById("uploadpicb");
            var fileObj = files[0]; // js 获取文件对象
            if (((fileObj.size / 1024) / 1024) > 10) {
                userSer.showalert("提示", "图片不得大于10M！");
                return;
            }
            appData.uploadData.optionbPic = fileObj;
        }


        // console.log(files)
        // console.log(fileObj)
        if (fileObj) {

        } else {
            $ionicLoading.hide();
            return;
        }

        var reader = html5Reader(fileObj);
        reader.onload = function(e) {
            domElemId.style.backgroundImage = "url('" + this.result + "')";
            $ionicLoading.hide();
        }

        function html5Reader(file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            return reader;
        }
    }

    $scope.userLogo = appData.user.logourl;

    var watch = $scope.$watch('askQuestionTitle', function(newValue, oldValue, scope) {

        // console.log(newValue);

        // console.log(oldValue);

    });


    $scope.gotoaskQuesClass = function(askQuestionTitle, askQuestionContent, askQuestionOptionA, askQuestionOptionB) {

        if ($scope.$$childHead.askQuestionTitle == null || $scope.$$childHead.askQuestionTitle == "") {
            userSer.showalert("提示", "标题不能为空");
            return;
        }
        if ($scope.$$childHead.askQuestionContent == null || $scope.$$childHead.askQuestionContent == "") {
            userSer.showalert("提示", "内容不能为空");
            return;
        }
        if ($scope.$$childHead.askQuestionOptionA == null || $scope.$$childHead.askQuestionOptionA == "") {
            userSer.showalert("提示", "选项不能为空");
            return;
        }
        if ($scope.$$childHead.askQuestionOptionB == null || $scope.$$childHead.askQuestionOptionB == "") {
            userSer.showalert("提示", "选项不能为空");
            return;
        }
        if (appData.uploadData.optionaPic == null || appData.uploadData.optionbPic == null) {
            userSer.showalert("提示", "图片不能为空");
            return;
        }
        appData.uploadData.title = $scope.$$childHead.askQuestionTitle;
        appData.uploadData.content = $scope.$$childHead.askQuestionContent;
        appData.uploadData.optionaTitle = $scope.$$childHead.askQuestionOptionA;
        appData.uploadData.optionbTitle = $scope.$$childHead.askQuestionOptionB;
        $state.go('askingquestionsclassI');
    }
});
app.controller("askingquestionsclassController", function($state, $scope, $http, userSer) {
    $scope.goBack = function() {
        history.back(-1);
    };
    $scope.choseQuestionClassText = "选择问题分类";
    let typec = 0;
    $scope.choosetitle;
    // $scope.choosetitle = "choosetitle";
    $scope.choseQuestionClass = function(typeNumber, typeText) {

        // if (type == 1) {
        //     $scope.choseQuestionClassText = "生活";
        // } else if (type == 2) {
        //     $scope.choseQuestionClassText = "娱乐";
        // } else if (type == 3) {
        //     $scope.choseQuestionClassText = "情感";
        // } else if (type == 4) {
        //     $scope.choseQuestionClassText = "哲学";
        // } else if (type == 5) {
        //     $scope.choseQuestionClassText = "社会";
        // } else if (type == 6) {
        //     $scope.choseQuestionClassText = "奇葩";
        // }
        typec = typeNumber;
        $scope.choseQuestionClassText = typeText;
        $scope.choosetitle = "choosetitle";
    }

    $scope.type = [];
    let j = 0;
    for (let i = 0; i < appData.type.length; i++) {
        if (appData.type[i] == null || appData.type[i] == "") break;
        if ($scope.type[j] == null || $scope.type[j] == "") $scope.type[j] = [];
        // console.log(i % 2 == 0)
        if (i % 2 == 0) {
            $scope.type[j].push(appData.type[i]);
        } else {
            $scope.type[j].push(appData.type[i]);
            j++;
        }
    }
    // console.log($scope.type)
    $scope.gotosuedsuccessfully = function() {
        // console.log($scope.choseQuestionClassText);
        // console.log(typec);
        if (typec == 0) {
            userSer.showalert("提示", "请选择类别");
            return;
        }
        appData.uploadData.type = typec;
        let cot = 1;
        userSer.showloading("发布中");
        // console.log(appData)
        uploadpic(appData.uploadData.optionaPic);

        function uploadpic(picobj) {
            let postData = userSer.packageUploadPic(picobj);
            let FileController = "http://up.imgapi.com/";
            // XMLHttpRequest 对象
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("post", FileController, true);
            xmlhttp.onload = function() {

                let tempobj = userSer.getJsonFromString(xmlhttp.responseText);
                if (tempobj) {
                    if (tempobj.s_url != "" && tempobj.s_url != null) {
                        // console.log(tempobj.s_url)
                        if (cot == 1) {
                            appData.uploadData.optionaPicUrl = tempobj.s_url;
                            cot--;
                            uploadpic(appData.uploadData.optionbPic);
                        } else {
                            appData.uploadData.optionbPicUrl = tempobj.s_url;
                            let postData = "event=publish&&userid=" + appData.user.userId +
                                "&&timetamp=" + appData.user.timestamp +
                                "&&session=" + appData.user.session +
                                "&&nickname=" + appData.user.nickName +
                                "&&tittle=" + appData.uploadData.title +
                                "&&content=" + appData.uploadData.content +
                                "&&optionA=" + appData.uploadData.optionaTitle +
                                "&&optionB=" + appData.uploadData.optionbTitle +
                                "&&imageA=" + appData.uploadData.optionaPicUrl +
                                "&&imageB=" + appData.uploadData.optionbPicUrl +
                                "&&type=" + appData.uploadData.type;
                            $http({
                                method: 'post',
                                url: appData.postUrl,
                                data: postData,
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            }).then(function successCallback(response) {
                                let tempobj = response.data;
                                // console.log(tempobj);
                                userSer.hideloading();
                                $state.go('issuedsuccessfullyI');
                            }, function errorCallback(response) {
                                userSer.showalert("发布失败", "网络错误 201");
                                userSer.hideloading();
                            });
                        }
                    } else {
                        userSer.showalert("发布失败", "网络错误 302");
                    }
                } else {
                    userSer.showalert("发布失败", "网络错误 301");
                }
            }
            xmlhttp.send(postData);
        }
    }
});
app.controller("issuedsuccessfullyController", function($state, $scope) {
    $scope.goBack = function() {
        history.back(-1);
    };
});
app.controller("questionsController", function($state, $scope, $http, $stateParams, $ionicSlideBoxDelegate, $ionicScrollDelegate) {

    // 进入页面时，确认问题分类，以及问题索引
    $scope.$on("$ionicView.beforeEnter", function(event, data) {

        if ($stateParams.publishid == -99 && $stateParams.type < 0) {
            $scope.qucontent = appData.content;

            $scope.indexContent = $scope.qucontent;

            $scope.myActiveSlide = $stateParams.index;
            $scope.slindex = $stateParams.index;
        } else if ($stateParams.publishid == -99 && $stateParams.type > 0) {

            $scope.qucontent = [];
            let count = 0;
            for (let i = 0; i < appData.content.length; i++) {
                if (appData.content[i].type == $stateParams.type) {
                    $scope.qucontent[count] = appData.content[i];
                    count++;
                }
            }

            $scope.indexContent = $scope.qucontent;
            $scope.myActiveSlide = $stateParams.index;
            $scope.slindex = $stateParams.index;
        } else {
            for (let i = 0; i < appData.content.length; i++) {
                if (appData.content[i].publishid == $stateParams.publishid) {

                    $scope.qucontent = [];
                    $scope.qucontent[0] = appData.content[i];
                    $scope.slindex = 0;
                    $scope.indexContent = $scope.qucontent;
                }
            }
        }
        // console.log("beforeEnter");
        console.log($scope.indexContent)
        $stateParams.index;


        if ($stateParams.type > 0) {
            for (let i = 0; i < appData.type.length; i++) {
                if ($stateParams.type == appData.type[i].number) {
                    $scope.type = appData.type[i].text;
                    $scope.types = appData.type[i].number;
                    $scope.backgroundImage = appData.type[i].background;
                }
            }
            // if ($stateParams.type == 1) {
            //     $scope.type = "生活";
            //     $scope.types = 1;
            // } else if ($stateParams.type == 2) {
            //     $scope.type = "娱乐";
            //     $scope.types = 2;
            // } else if ($stateParams.type == 3) {
            //     $scope.type = "情感";
            //     $scope.types = 3;
            // } else if ($stateParams.type == 4) {
            //     $scope.type = "哲学";
            //     $scope.types = 4;
            // } else if ($stateParams.type == 5) {
            //     $scope.type = "社会";
            //     $scope.types = 5;
            // } else if ($stateParams.type == 6) {
            //     $scope.type = "奇葩";
            //     $scope.types = 6;
            // }
        } else {
            $scope.type = "最新";
            $scope.types = "-1";
            $scope.backgroundImage = "http://i4.buimg.com/501024/ee1ca180300381e9s.png";
        }
        $scope.questionsTest = true;
        $ionicSlideBoxDelegate.update();
    });

    $scope.$on("$ionicView.enter", function(event, data) {

    });


    // 进入页面是确认点赞按钮的状态
    $scope.$on("$ionicParentView.afterEnter", function(event, data) {
        // 调整卡片高度
        document.getElementById("questioncontent").childNodes[0].style.height = "100%";
        // 确认点赞按钮的状态
        if ($scope.qucontent[$scope.slindex].islikes == 0) {
            $scope.outlinelike = true;
            $scope.inlinelike = false;
        } else {
            $scope.outlinelike = false;
            $scope.inlinelike = true;
        }
    });


    $scope.gotoQuestionsdetailI = function(publishid) {
        $state.go('questionsdetailI', { publishid: publishid, slindex: $scope.slindex });
    }

    // 离开页面事，更新全局变量appData
    $scope.$on("$ionicParentView.beforeLeave", function(event, data) {
        // console.log("beforeLeave");
        $scope.indexContent = null;
        // console.log($scope.indexContent);
        // appData.content = $scope.qucontent;
    });


    // 评论输入框
    $scope.share = true;
    $scope.ngreply = false;
    $scope.replytext = null;
    $scope.onreply = function() {
        $scope.share = false;
        $scope.ngreply = true;
    };
    $scope.sendbuttontext = "取消";
    $scope.sendreply = function() {
        if ($scope.replytext == null || $scope.replytext == "") {
            $scope.share = true;
            $scope.ngreply = false;
        } else {
            let postData = "event=comment&&userid=" + appData.user.userId +
                "&&timestamp=" + appData.user.timestamp +
                "&&session=" + appData.user.session +
                "&&publishid=" + $scope.qucontent[$scope.slindex].publishid +
                "&&content=" + $scope.replytext +
                "&&mynickname=" + appData.user.nickName;
            // console.log(postData);
            $http({
                method: 'post',
                url: appData.postUrl,
                data: postData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }).then(function successCallback(response) {
                let tempobj = response.data;
                // console.log(tempobj);
                document.getElementById("questionreplyid").value = "";
                $state.go('questionsdetailI', { publishid: $scope.qucontent[$scope.slindex].publishid });

            }, function errorCallback(response) {
                //userSer.showalert("失败", "网络错误 201");
            });
        }
    };
    $scope.$watch('replytext ', function(newValue, oldValue) {
        if ($scope.replytext == null || $scope.replytext == "") {
            $scope.sendbuttontext = "取消";
        } else {
            $scope.sendbuttontext = "发送";
        }
    });

    // 点赞按钮
    $scope.slindex;

    $scope.outlinelike = true;
    $scope.inlinelike = false;
    $scope.like = function() {
        $scope.outlinelike = !$scope.outlinelike;
        $scope.inlinelike = !$scope.inlinelike;

        let event;
        console.log($scope.qucontent[$scope.slindex])
        if ($scope.qucontent[$scope.slindex].islikes == 0) event = "likes";
        if ($scope.qucontent[$scope.slindex].islikes == 1) event = "dislikes";
        let postData = "event=" + event + "&&userid=" + appData.user.userId +
            "&&timestamp=" + appData.user.timestamp +
            "&&session=" + appData.user.session +
            "&&publishid=" + $scope.qucontent[$scope.slindex].publishid;
        // console.log(postData);
        $http({
            method: 'post',
            url: appData.postUrl,
            data: postData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then(function successCallback(response) {
            let tempobj = response.data;
            if ($scope.qucontent[$scope.slindex].islikes == 1) {
                $scope.qucontent[$scope.slindex].islikes = 0;
            } else {
                $scope.qucontent[$scope.slindex].islikes = 1;
            }
            // console.log(tempobj);
        }, function errorCallback(response) {
            //userSer.showalert("失败", "网络错误 201");
        });

    };
    // 滑动页面是，切换点赞按钮的状态
    $scope.sltest = function(index) {

        /*1、$ionicSlideBoxDelegate.update(); 就是当容器尺寸发生变化时，需要调用update()方法重绘幻灯片，更新滑动框（例如，用带有ng-repeat的Angular，调整它里面的元素）。*/

        $ionicSlideBoxDelegate.update();

        $scope.slindex = index;

        let length = $scope.qucontent.length;

        if ($scope.qucontent[index].islikes == 0) {
            $scope.outlinelike = true;
            $scope.inlinelike = false;
        }
        if ($scope.qucontent[index].islikes == 1) {
            $scope.outlinelike = false;
            $scope.inlinelike = true;
        }
    }

    // 选择答案
    $scope.chose = function(c, ab) {

        let publishid = c.getAttribute("publishid");
        let authorid = c.getAttribute("authorid");
        let ischoose = c.getAttribute("ischoose");
        if (ischoose == 0) {
            let choseA;
            let choseB;
            for (let i = 0; i < $scope.qucontent.length; i++) {
                if ($scope.qucontent[i].publishid == publishid) {
                    choseA = $scope.qucontent[i].choose.optionA;
                    choseB = $scope.qucontent[i].choose.optionB;
                    console.log($scope.qucontent[i].choose)
                }
            }
            let postData;
            let optionB = document.getElementById(publishid + authorid + "b");
            let optionA = document.getElementById(publishid + authorid + "a");
            if (ab == 1) {
                c.innerHTML = "<div class=\"back-opacity\"></div><span>" + choseA + "人</br>和您选择一样</span>";
                c.setAttribute('class', 'option-img option-A chosen');

                optionB.innerHTML = "<div class=\"back-opacity\"></div><span>" + choseB + "人</br>和您选择不同</span>";
                optionB.setAttribute('class', 'option-img option-B chosend');
                postData = "event=choose&&userid=" + appData.user.userId +
                    "&&timestamp=" + appData.user.timestamp +
                    "&&session=" + appData.user.session +
                    "&&publishid=" + publishid +
                    "&&option=" + "A" +
                    "&&authorid=" + authorid;
            } else if (ab == 2) {
                c.innerHTML = "<div class=\"back-opacity\"></div><span>" + choseB + "人</br>和您选择一样</span>";
                c.setAttribute('class', 'option-img option-B chosen');

                optionA.innerHTML = "<div class=\"back-opacity\"></div><span>" + choseA + "人</br>和您选择不同</span>";
                optionA.setAttribute('class', 'option-img option-A chosend');
                postData = "event=choose&&userid=" + appData.user.userId +
                    "&&timestamp=" + appData.user.timestamp +
                    "&&session=" + appData.user.session +
                    "&&publishid=" + publishid +
                    "&&option=" + "B" +
                    "&&authorid=" + authorid;
            }

            $http({
                method: 'post',
                url: appData.postUrl,
                data: postData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }).then(function successCallback(response) {
                let tempobj = response.data;
                // console.log(tempobj);
                optionA.setAttribute('ischoose', '1');
                optionB.setAttribute('ischoose', '1');
            }, function errorCallback(response) {
                //userSer.showalert("失败", "网络错误 201");
            });
        }
    }

    // 动态隐藏顶部菜单
    $scope.getScrollPosition = function() {
        var position = $ionicScrollDelegate.getScrollPosition().top; //取滑动TOP值  
        let questionsheaderid = document.getElementById("questionsheader");
        // console.log(position)
        if (position > 20) //小于等于40像素时隐藏标题  
        {
            questionsheaderid.style.display = "none";
        }
        if (position == 0)
            questionsheaderid.style.display = "flex";

    }
});
app.controller("personalController", function($state, $scope, $http, $ionicScrollDelegate, userSer) {

    let myquestions = document.getElementById("myquestions");
    let mychecked = document.getElementById("mychecked");
    $scope.myquestions = true;
    $scope.mychecked = false;
    $scope.goBack = function() {
        history.back(-1);
    };
    $scope.switchCheck = function($event) {
        if ($event == 0) {
            $scope.myquestions = true;
            $scope.mychecked = false;
            myquestions.className = "tab-item a-checked";
            mychecked.className = "tab-item";
        } else {
            $scope.myquestions = false;
            $scope.mychecked = true;
            myquestions.className = "tab-item";
            mychecked.className = "tab-item a-checked";
        }
    };

    $scope.myQuestions;
    $scope.myChoose;
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $scope.userLogo = appData.user.logourl;
        $scope.userNickName = appData.user.nickName;
        // console.log(appData.user)
        let postData = "event=personal&&userid=" + appData.user.userId +
            "&&timestamp=" + appData.user.timestamp +
            "&&session=" + appData.user.session;
        $http({
            method: 'post',
            url: appData.postUrl,
            data: postData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then(function successCallback(response) {
            let tempobj = response.data;
            console.log(tempobj);
            $scope.myQuestions = tempobj.content.mypublish;
            console.log(tempobj.content.mychoose);
            $scope.myChoose = getNoRepeat(tempobj.content.mychoose);

            console.log($scope.myChoose);
        }, function errorCallback(response) {
            //userSer.showalert("失败", "网络错误 201");
        });
    });

    // 去除我的选择里重复的选择
    function getNoRepeat(obj) {
        let noRepeat = [];
        let flg = 0;
        let temp;
        let count = 1;

        temp = obj[0];

        noRepeat[0] = temp;

        for (let i = 0; i < obj.length; i++) {
            for (let j = 0; j < noRepeat.length; j++) {
                if (noRepeat[j].publishid == obj[i].publishid) {
                    flg = 1;
                    break;
                }
            }
            if (flg == 0) {
                temp = obj[i];
                noRepeat[count] = temp;
                count++;
            }
            flg = 0;
        }
        return noRepeat;
    }

    $scope.gotoQuestins = function(publishid, type) {
        $state.go('questionsI', { index: -88, type: type, publishid: publishid });
    }

});
app.controller("setController", function($state, $scope, $ionicViewSwitcher, userSer) {
    $scope.goBack = function() {
        history.back(-1);
    };
    // 退出登录
    $scope.outLogin = function() {
        userSer.clearCookie();
        appData.user.phone = null;
        appData.user.nickName = null;
        appData.user.userId = null;
        appData.user.logourl = null;
        appData.user.timestamp = null;
        appData.user.session = null;

        $ionicViewSwitcher.nextDirection("exit");
        $state.go('loginMainI.loginI');
    }
});
app.controller("questionsdetailController", function($state, $scope, $stateParams, $http, $ionicScrollDelegate, userSer) {
    $scope.goBack = function() {
        // if ($stateParams.slindex >= 0 && $stateParams.slindex != null && $stateParams.slindex != "") {
        //     let url = location.pathname + "#/questions/" + $stateParams.slindex + "/" + $scope.quesdetail.type + "/-99";
        //     console.log(url)
        //     history.replaceState({}, null, url);
        // }
        window.history.back();
        // test()
    };

    // function test() {
    //     if ($stateParams.slindex >= 0 && $stateParams.slindex != null && $stateParams.slindex != "") {
    //         let url = location.pathname + "#/questions/" + $stateParams.slindex + "/" + $scope.quesdetail.type + "/-99";
    //         console.log(url)
    //         history.replaceState({}, null, url);
    //     }
    // }
    // 回复评论
    let relycommentid;
    let relytoid;
    let relytouser;
    let questiondetailreplyreplyid = document.getElementById("questiondetailreplyreplyid");
    $scope.sendreplybuttontext = "取消";
    $scope.replyreply = function(commentid, toid, touser) {
        relycommentid = commentid;
        relytoid = toid;
        relytouser = touser;
        $scope.share = false;
        $scope.ngreplyreply = true;
        $scope.ngreply = false;
        questiondetailreplyreplyid.focus();
        questiondetailreplyreplyid.setAttribute('placeholder', '回复' + touser);

    }
    $scope.$watch('replyreplytext ', function(newValue, oldValue) {
        if ($scope.replyreplytext == null || $scope.replyreplytext == "") {
            $scope.sendreplybuttontext = "取消";
        } else {
            $scope.sendreplybuttontext = "发送";
        }
    });
    $scope.sendreplyreply = function() {
        $scope.ngreplyreply = false;
        $scope.share = true;
        $scope.ngreply = false;
        questiondetailreplyreplyid.value = "";
        if ($scope.replyreplytext == null || $scope.replyreplytext == "") {
            $scope.ngreplyreply = false;
            $scope.share = true;
            $scope.ngreply = false;
        } else {
            let postData = "event=rely&&userid=" + appData.user.userId +
                "&&timestamp=" + appData.user.timestamp +
                "&&session=" + appData.user.session +
                "&&publishid=" + $scope.quesdetail.publishid +
                "&&content=" + $scope.replyreplytext +
                "&&mynickname=" + appData.user.nickName +
                "&&commentid=" + relycommentid +
                "&&toid=" + relytoid +
                "&&touser=" + relytouser;
            // console.log(postData);
            $http({
                method: 'post',
                url: appData.postUrl,
                data: postData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }).then(function successCallback(response) {
                let tempobj = response.data;
                // console.log(tempobj);
                $scope.comment = tempobj.content.comment;
                document.getElementById("questiondetailreplyid").value = "";
            }, function errorCallback(response) {
                //userSer.showalert("失败", "网络错误 201");
            });
        }
    }



    // 评论输入框
    $scope.share = true;
    $scope.ngreply = false;
    $scope.replytext = null;
    $scope.onreply = function() {
        $scope.share = false;
        $scope.ngreply = true;
    };
    $scope.sendbuttontext = "取消";
    $scope.sendreply = function() {
        if ($scope.replytext == null || $scope.replytext == "") {
            $scope.share = true;
            $scope.ngreply = false;
        } else {
            let postData = "event=comment&&userid=" + appData.user.userId +
                "&&timestamp=" + appData.user.timestamp +
                "&&session=" + appData.user.session +
                "&&publishid=" + $scope.quesdetail.publishid +
                "&&content=" + $scope.replytext +
                "&&mynickname=" + appData.user.nickName;
            // console.log(postData);
            $http({
                method: 'post',
                url: appData.postUrl,
                data: postData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }).then(function successCallback(response) {
                let tempobj = response.data;
                // console.log(tempobj);
                $scope.comment = tempobj.content.comment;
                document.getElementById("questiondetailreplyid").value = "";
            }, function errorCallback(response) {
                //userSer.showalert("失败", "网络错误 201");
            });
        }
    };
    $scope.$watch('replytext ', function(newValue, oldValue) {
        if ($scope.replytext == null || $scope.replytext == "") {
            $scope.sendbuttontext = "取消";
        } else {
            $scope.sendbuttontext = "发送";
        }
    });



    $scope.outlinelike = true;
    $scope.inlinelike = false;

    $scope.quesdetail;
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $stateParams.publishid;
        // console.log($stateParams.publishid)
        for (let i = 0; i < appData.content.length; i++) {
            if (appData.content[i].publishid == $stateParams.publishid) {
                $scope.quesdetail = appData.content[i];

                for (let i = 0; i < appData.type.length; i++) {
                    if ($scope.quesdetail.type == appData.type[i].number) {
                        $scope.type = appData.type[i].text;
                        $scope.backgroundImage = appData.type[i].background;
                    }
                }

                // if ($scope.quesdetail.type == 1) {
                //     $scope.type = "生活";
                // } else if ($scope.quesdetail.type == 2) {
                //     $scope.type = "娱乐";
                // } else if ($scope.quesdetail.type == 3) {
                //     $scope.type = "情感";
                // } else if ($scope.quesdetail.type == 4) {
                //     $scope.type = "哲学";
                // } else if ($scope.quesdetail.type == 5) {
                //     $scope.type = "社会";
                // } else if ($scope.quesdetail.type == 6) {
                //     $scope.type = "奇葩";
                // }
                // console.log($scope.quesdetail)
            }
        }

        // 获取评论
        let postData = "event=content&&userid=" + appData.user.userId +
            "&&session=" + appData.user.session +
            "&&publishid=" + $scope.quesdetail.publishid;
        // console.log(postData)
        $http({
            method: 'post',
            url: appData.postUrl,
            data: postData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then(function successCallback(response) {
            let tempobj = response.data;
            // console.log(tempobj);
            $scope.comment = tempobj.content.comment;
            // console.log($scope.comment);
        }, function errorCallback(response) {
            //userSer.showalert("失败", "网络错误 201");
        });

    });
    // 进入页面前确认点赞按钮的状态
    $scope.$on("$ionicParentView.afterEnter", function(event, data) {
        console.log($scope.quesdetail);
        if ($scope.quesdetail.islikes == 0) {
            $scope.outlinelike = true;
            $scope.inlinelike = false;
        } else {
            $scope.outlinelike = false;
            $scope.inlinelike = true;
        }
    });


    // 设置后退的页面
    $scope.$on("$ionicView.beforeEnter", function(event, data) {

        // if ($stateParams.slindex >= 0 && $stateParams.slindex != null && $stateParams.slindex != "") {
        //     let url = location.pathname + "#/questions/" + $stateParams.slindex + "/" + $scope.quesdetail.type + "/-99";
        //     console.log(url)
        //     window.history.replaceState({}, null, url);

        // }
    });

    // 点赞按钮
    $scope.like = function() {
        $scope.outlinelike = !$scope.outlinelike;
        $scope.inlinelike = !$scope.inlinelike;

        let event;
        if ($scope.quesdetail.islikes == 0) event = "likes";
        if ($scope.quesdetail.islikes == 1) event = "dislikes";
        let postData = "event=" + event + "&&userid=" + appData.user.userId +
            "&&timestamp=" + appData.user.timestamp +
            "&&session=" + appData.user.session +
            "&&publishid=" + $scope.quesdetail.publishid;
        // console.log(postData);
        $http({
            method: 'post',
            url: appData.postUrl,
            data: postData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then(function successCallback(response) {
            let tempobj = response.data;
            if ($scope.quesdetail.islikes == 1) {
                $scope.quesdetail.islikes = 0;
            } else {
                $scope.quesdetail.islikes = 1;
            }
            // console.log(tempobj);
        }, function errorCallback(response) {
            //userSer.showalert("失败", "网络错误 201");
        });
    };


    // 动态隐藏顶部菜单
    $scope.getScrollPositions = function() {
        var position = $ionicScrollDelegate.getScrollPosition().top; //取滑动TOP值  
        let questionsdetailheaderid = document.getElementById("questionsdetailheader")
            // console.log(position)
        if (position > 20) //小于等于40像素时隐藏标题  
        {
            questionsdetailheaderid.style.display = "none";
        }
        if (position == 0)
            questionsdetailheaderid.style.display = "flex";
    }


    // 离开页面时，更新全局变量appData
    $scope.$on("$ionicParentView.beforeLeave", function(event, data) {
        for (let i = 0; i < appData.content.length; i++) {
            if (appData.content[i].publishid == $stateParams.publishid) {
                appData.content[i] = $scope.quesdetail;
                // console.log($scope.quesdetail)
            }
        }
    });
});
app.controller("messageController", function($state, $scope, $http, userSer) {
    $scope.$on("$ionicParentView.beforeEnter", function(event, data) {
        $scope.userLogo = appData.user.logourl;
        // console.log(111)
        let postData = "event=news&&userid=" + appData.user.userId +
            "&&session=" + appData.user.session;
        // console.log(postData)
        $http({
            method: 'post',
            url: appData.postUrl,
            data: postData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then(function successCallback(response) {
            let tempobj = response.data;
            console.log(tempobj);
            if (tempobj.content != null && tempobj.content != "") {
                $scope.comment = [];
                let j = 0;
                for (let i = 0; i < tempobj.content.length; i++) {
                    if (tempobj.content[i].content.comment) {
                        let msgUserList = getMsgUserList(tempobj.content[i].content.comment);

                        $scope.comment[j] = {
                            msgUserList: msgUserList,
                            content: tempobj.content[i].content.comment,
                            publishid: tempobj.content[i].publishid,
                            tittle: tempobj.content[i].tittle,
                            type: tempobj.content[i].type,
                            newstype: 2,
                            text: "评论了你的提问",
                        };
                        j++;

                    } else if (tempobj.content[i].content.rely) {

                        let msgUserList = getMsgUserList(tempobj.content[i].content.rely);

                        $scope.comment[j] = {
                            msgUserList: msgUserList,
                            content: tempobj.content[i].content.rely,
                            publishid: tempobj.content[i].publishid,
                            tittle: tempobj.content[i].tittle,
                            type: tempobj.content[i].type,
                            newstype: 2,
                            text: "回复了你的评论",
                        };
                        j++;
                    }
                }
                // console.log($scope.comment);
            }
        }, function errorCallback(response) {
            //userSer.showalert("失败", "网络错误 201");
        });
    });

    // 去除重复用户
    function getMsgUserList(obj) {
        let all;
        let noRepeat = [];
        let flg = 0;
        let count = 1;
        noRepeat[0] = obj[0];
        for (let i = 0; i < obj.length; i++) {
            for (let j = 0; j < noRepeat.length; j++) {
                if (noRepeat[j].fromid == obj[i].fromid) {
                    flg = 1;
                    break;
                }
            }
            if (flg == 0) {
                noRepeat[count] = obj[i];
                count++;
            }
            flg = 0;
        }
        return noRepeat;
    }


    $scope.gotoQuestionsdetailI = function(publishid) {
        $state.go('questionsdetailI', { publishid: publishid });
    }
});
// app.controller("classification", function($state, $scope, $http, userSer) {
//     $scope.gotoQuestins = function(type) {
//         $state.go('questionsI', { index: 0, type: type, publishid: -99 });
//     }
// });