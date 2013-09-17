'use strict'

var request = require('request');
var fs = require('fs');
var jquery = fs.readFileSync("lib/jquery.js", "utf-8");

var jsdom = require("jsdom");


var ZhengMei = {
    init: function() {
        this.getPages();
    },
    article: {
        title: []
    },
    getPages: function () {
        var arr = [],
            baseUrl = "http://www.cnblogs.com/rubylouvre/default.html?page=";
        for(var i = 1; i <= 95; i++) {
            this.getTitle(baseUrl + i);
        }
    },
    getTitle: function(url) {
        var me = this;
        jsdom.env({
            url: url,
            src: [jquery],
            done: function (errors, window) {
                var $ = window.$;
                $(".post").each(function () {
                    var title =  $(this).find("a:first");
                    // me.article.push(title.text());
                    console.log(title.text());
                });
            }
        });
    }
}

ZhengMei.init();
// jsdom.env({
//         url: "http://www.cnblogs.com/rubylouvre/",
//         src: [jquery],
//         done: function (errors, window) {
//             var $ = window.$;
//             $(".post").each(function () {
//                 var title =  $(this).find("a:first");
//                 console.log(" -", title.text());
//             });
//         }
//     }
// );

