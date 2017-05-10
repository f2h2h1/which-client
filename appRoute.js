app.config(function($stateProvider) {
    // 定义了一个名为“tabs”的状态，但只配置了要使用的模板文件，却没有配置要渲染在哪个 ion-nav-view。因为它不是直接渲染在页面上，而是随着其子状态一起渲染。
    $stateProvider.state('loginMainI', {
        url: '/login',
        views: {
            'main': {
                templateUrl: 'template/loginMainT.html',
            },
        }
    }).state('loginMainI.loginI', {
        url: '/loginMain',
        views: {
            'loginMainV': {
                templateUrl: 'template/loginT.html',
            },
        }
    }).state('loginMainI.loginNextI', {
        url: '/loginNext',
        views: {
            'loginMainV': {
                templateUrl: 'template/loginNextT.html',
            },
        }
    }).state('loginMainI.loginRegisterI', {
        url: '/loginRegister',
        views: {
            'loginMainV': {
                templateUrl: 'template/loginRegisterT.html',
            },
        }
    }).state('indexI', {
        url: '/index/:id',
        views: {
            'main': {
                templateUrl: 'template/indexT.html',
            },
        },
        onEnter: function() {
            //alert(2)
            //angular.element(document.querySelector('[ng-controller=indexController]')).scope().test();
            // console.log(angular.element(document.querySelector('[ng-controller=indexController]')).scope());
            // console.log(data)
        },
    }).state('indexI.indexMainI', {
        url: '/indexMain',
        views: {
            'indexMainV': {
                templateUrl: 'template/indexMainT.html',
            }
        },
        onEnter: function() {
            //alert(2)
            //angular.element(document.querySelector('[ng-controller=indexController]')).scope().test();
            // console.log(angular.element(document.querySelector('[ng-controller=indexController]')).scope());
            // console.log(data)
        },
    }).state('indexI.indexClassI', {
        url: '/indexClass',
        views: {
            'indexMainV': {
                templateUrl: 'template/indexClassT.html',
            }
        }
    }).state('messageI', {
        url: '/message',
        views: {
            'main': {
                templateUrl: 'template/messageT.html',
                ontroller: 'messageController',
            }
        }
    }).state('searchI', {
        url: '/search',
        views: {
            'main': {
                templateUrl: 'template/searchT.html',
                ontroller: 'searchController',
            }
        }
    }).state('askingquestionsI', {
        url: '/askingquestions',
        views: {
            'main': {
                templateUrl: 'template/askingquestionsT.html',
                ontroller: 'askingquestionsController',
            }
        }
    }).state('askingquestionsclassI', {
        url: '/askingquestionsclass',
        views: {
            'main': {
                templateUrl: 'template/askingquestionsclassT.html',
                controller: 'askingquestionsclassController',
            }
        }
    }).state('issuedsuccessfullyI', {
        url: '/issuedsuccessfully',
        views: {
            'main': {
                templateUrl: 'template/issuedsuccessfullyT.html',
                controller: 'issuedsuccessfullyController',
            }
        }
    }).state('questionsI', {
        url: '/questions/:index/:type/:publishid',
        views: {
            'main': {
                templateUrl: 'template/questionsT.html',
                controller: 'questionsController',
            }
        },
    }).state('personalI', {
        url: '/personal',
        views: {
            'main': {
                templateUrl: 'template/personalT.html',
                controller: 'personalController',
            }
        }
    }).state('setI', {
        url: '/set',
        views: {
            'main': {
                templateUrl: 'template/setT.html',
            }
        }
    }).state('questionsdetailI', {
        url: '/questionsdetail/:publishid/:slindex',
        views: {
            'main': {
                templateUrl: 'template/questionsdetailT.html',
                controller: 'questionsdetailController',
            }
        },
    }).state('template2I', {
        url: '/template2',
        views: {
            'main': {
                templateUrl: 'template/template2.html',
            }
        },
    });;
});