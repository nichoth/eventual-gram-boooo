var Server = require('ssb-server')
var config = require('ssb-config')
var fs = require('fs')
var path = require('path')
var pull = require('pull-stream')

config.path = config.path + '-booooooo'
console.log('path', config.path)

// add plugins
Server
  .use(require('ssb-master'))
  .use(require('ssb-gossip'))
  .use(require('ssb-replicate'))
  .use(require('ssb-backlinks'))

var server = Server(config)

// save an updated list of methods this server has made public
// in a location that ssb-client will know to check
var manifest = server.getManifest()
fs.writeFileSync(
  path.join(config.path, 'manifest.json'), // ~/.ssb/manifest.json
  JSON.stringify(manifest)
)

server.whoami(function (err, data) {
  console.log('my id', data.id) //your id
})

server.publish({ type: 'post', text: 'My First Post!' }, function (err, msg) {
  if (err) throw err

  // the message as it appears in the database:
  console.log('msg: ', msg)

  // and its hash:
  console.log('key: ', msg.key)

  arr()
  history()
})

function arr () {
  pull(
    server.createLogStream(),
    pull.collect(function (err, messagesArray) {
      console.log('arrrr', messagesArray)
    })
  )
}

function history () {
  pull(
    server.createHistoryStream({id: server.id}),
    pull.collect(function (err, messagesArray) {
      console.log('history arrr', messagesArray)
    })
  )
}
