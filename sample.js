var appy = require(__dirname + '/appy.js');

appy.bootstrap({

  // Prefix all URLs with /test
  // prefix: '/test',

  // Hardcode some users. Will also look for users in the users collection by default
  auth: {
    strategy: 'local',
    options: {
      users: {
        admin: {
          username: 'admin',
          password: 'demo'
        }
      }
    }
  },
  // An alternative: Twitter auth
  // auth: {
  //   strategy: 'twitter',
  //   options: {
  //     consumerKey: 'xxxx',
  //     consumerSecret: 'xxxx',
  //     callbackURL: 'http://my.example.com:3000/twitter-auth'
  //   }
  // },

  // Serve static files
  static: __dirname + '/sample-public',

  // Compile LESS to CSS automatically
  less: true,

  // Lock all URLs beginning with this prefix to require login. You can lock
  // an array of prefixes if you wish . Prefixes must be followed by / or . or
  // be matched exactly. To lock everything except the login mechanism itself,
  // use locked: true
  locked: '/new',

  // If you're using locked: true you can make exceptions here
  // unlocked: [ '/welcome' ]

  // Choose your own please
  sessionSecret: 'whatever',

  sessions: {
    // You can pass options directly to connect-mongo here to customize sessions
  },

  // Redirects to this host if accessed by another name
  // (canonicalization). This is pretty hard to undo once
  // the browser gets the redirect, so use it in production only
  // host: 'my.example.com:3000',

  // Database configuration
  db: {
    // MongoDB URL to connect to
    uri: 'mongodb://localhost:27017/example',

    // These collections become available as appy.posts, etc.
    collections: [ 'posts' ]

    // If I need indexes I specify that collection in more detail:
    // [ { name: 'posts', index: { fields: { { title: 1 } }, unique: true } } ]
    // Or more than one index:
    // [ { name: 'posts', indexes: [ { fields: { { title: 1 } } }, ... ] } ]
  },
  address: process.env.ADDRESS || null,
  port: process.env.PORT || null,

  // This is where your code goes! Add routes, do anything else you want to do,
  // then call appy.listen
  ready: function(app, db) {
    app.get('/', function(req, res) {
      appy.posts.find().sort({created: -1}).toArray(function(err, posts) {
        res.send('messages: ' + posts.map(function(post) { return post.message; }).join());
      });
    });
    app.get('/new/:message', function(req, res) {
      var post = { 'message': req.params.message, 'createdAt': new Date() };
      appy.posts.insert(post, function(err) {
        res.send('added');
      });
    });
    appy.listen();
  }
});

