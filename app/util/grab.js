'use strict'

var request = require('request'),
    fs = require('fs'),
    path = require('path'),
    jqueryUrl = path.resolve(__dirname, "..","..","lib","jquery.js");

var jquery = fs.readFileSync(jqueryUrl, "utf-8");
var jsdom = require("jsdom");


var Grab = {
    init: function(opts) {
        this._opts = opts = opts || {};
        this.getPages(opts.callback);
    },
    article: {
        title: [],
        description: []
    },
    getPages: function () {
        var arr = [],
            baseUrl = "http://www.cnblogs.com/rubylouvre/default.html?page=";
        for(var i = 1; i <= 2; i++) {
            this.getArticle(baseUrl + i);
            console.log(baseUrl +i);
        }
    },
    getArticle: function(url) {
        var me = this;
        jsdom.env({
            url: url,
            src: [jquery],
            done: function (errors, window) {
                var $ = window.$ ,
                    len = $(".post").length;
                $(".post").each(function (i) {

                    var title =  $(this).find("a:first"),
                        description = $(this).find(".c_b_p_desc"),
                        //posted @ 2013-09-11 16:02 司徒正美 阅读(110) 评论(0) 编辑
                        otherInfo = $(this).find(".postfoot").text(),
                        arr = otherInfo.split(" ");

                    // me.article.title.push(title);
                    // me.article.description.push(description);
                    me._opts.callback && me._opts.callback({
                        title: title.text(),
                        description: description.html(),
                        date: new Date(/\b[-:\d\s]+(?=\s)/.exec(otherInfo)[0]).getTime(),
                        viewCounts: /阅读\((\d+)\)/.exec(otherInfo)[1],
                        commentCount: /评论\((\d+)\)/.exec(otherInfo)[1],
                        author: "司徒正美",
                        bFinish: i === len - 1 ? true : false
                    });
                });
            }
        });
    }
}

exports.init = function(cb) {
    Grab.init({
        callback: cb
    });
    
}


