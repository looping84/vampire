
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , Article = mongoose.model('Article')
    , utils = require('../../lib/utils')
    , _ = require('underscore')
    , Grab = require('../util/grab')

/**
 * Load
 */

exports.load = function(req, res, next, id){
    var User = mongoose.model('User')

    Article.load(id, function (err, article) {
        if (err) return next(err)
        if (!article) return next(new Error('not found'))
        req.article = article
        next()
    })
}

/**
 * grab website by sitename 
 * @author looping
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.grabSite = function(req, res) {
    var siteName = req.params.sitename;
    
    Grab.init(function(ar) {
        var article = new Article({
            title: ar.title,
            body: ar.description,
            createdAt: ar.date,
            viewsCount: ar.viewCounts,
            comments: {
                count: ar.commentCount
            },
            author: ar.author,
            author_en: ar.author_en,
            url: ar.url
        });
        Article.findOne({ url: ar.url },"url", function (err, result) {
            if(!err && !result) {//说明没找到记录，则入库
                article.save();
            }
        });
        // if(lastArticleCount === ar.total) {
        //     console.log("总共抓取" + ar.total);
        //     res.redirect('/articles');
        // }
    });
   
}   
/**
 * List
 */

exports.index = function(req, res){
    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
    var perPage = 30
    var options = {
        perPage: perPage,
        page: page
    }

    Article.list(options, function(err, articles) {
        if (err) return res.render('500')
        Article.count().exec(function (err, count) {
            res.render('articles/index', {
                title: 'Articles',
                articles: articles,
                page: page + 1,
                pages: Math.ceil(count / perPage)
            })
        })
    })    
}

/**
 * New article
 */

exports.new = function(req, res){
    res.render('articles/new', {
        title: 'New Article',
        article: new Article({})
    })
        
}

/**
 * Create an article
 */

exports.create = function (req, res) {
    var article = new Article(req.body)
    article.user = req.user

    article.uploadAndSave(req.files.image, function (err) {
        if (!err) {
            // req.flash('success', 'Successfully created article!')
            return res.redirect('/articles/'+article._id)
        }

        res.render('articles/new', {
            title: 'New Article',
            article: article,
            errors: utils.errors(err.errors || err)
        })
    })
}

/**
 * Edit an article
 */

exports.edit = function (req, res) {
    res.render('articles/edit', {
        title: 'Edit ' + req.article.title,
        article: req.article
    })
}

/**
 * Update article
 */

exports.update = function(req, res){
    var article = req.article
    article = _.extend(article, req.body)

    article.uploadAndSave(req.files.image, function(err) {
        if (!err) {
            return res.redirect('/articles/' + article._id)
        }

        res.render('articles/edit', {
            title: 'Edit Article',
            article: article,
            errors: err.errors
        })
    })
}

/**
 * Show
 */

exports.show = function(req, res){
    res.render('articles/show', {
        title: req.article.title,
        article: req.article
    })
}

/**
 * Delete an article
 */

exports.destroy = function(req, res){
    var article = req.article
    article.remove(function(err){
        // req.flash('info', 'Deleted successfully')
        res.redirect('/articles')
    })
}
