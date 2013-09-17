/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var users = require('../app/controllers/users')
    , articles = require('../app/controllers/articles')
    // , auth = require('./middlewares/authorization')

/**
 * Route middlewares
 */

// var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization]

/**
 * Expose routes
 */

module.exports = function (app, passport) {

    // user routes
    app.get('/login', users.login)
    app.get('/signup', users.signup)
    app.get('/logout', users.logout)
    app.post('/users', users.create)
    // app.post('/users/session',
    //     passport.authenticate('local', {
    //         failureRedirect: '/login',
    //         failureFlash: 'Invalid email or password.'
    //     }), users.session)
    app.get('/users/:userId', users.show)

    app.param('userId', users.user)

    // article routes
    app.get('/articles', articles.index)
    // app.get('/articles/new', auth.requiresLogin, articles.new)
    app.get('/articles/new', articles.new)
    // app.post('/articles', auth.requiresLogin, articles.create)
    app.get('/articles/:id', articles.show)
    //grab articles
    app.get('/grab/:sitename', articles.new)
    // app.get('/articles/:id/edit', articleAuth, articles.edit)
    // app.put('/articles/:id', articleAuth, articles.update)
    // app.del('/articles/:id', articleAuth, articles.destroy)

    app.param('id', articles.load)
    app.param('sitename', articles.grabSite)

    // home route
    app.get('/', articles.index)

    // comment routes
    var comments = require('../app/controllers/comments')
    // app.post('/articles/:id/comments', auth.requiresLogin, comments.create)
    // app.get('/articles/:id/comments', auth.requiresLogin, comments.create)

    // tag routes
    var tags = require('../app/controllers/tags')
    app.get('/tags/:tag', tags.index)

}
