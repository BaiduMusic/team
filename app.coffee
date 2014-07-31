process.env.NODE_ENV = 'development'

nobone = require 'nobone'
data = require './data'

port = 8457

nb = nobone {
    proxy: {}
    renderer: {}
    service: {}
}

# Server
nb.service.get '/', (req, res) ->
    nb.renderer.render('index.ejs')
    .done (tpl_func) ->
        res.send tpl_func( { members: data.members } )

nb.service.listen port
nb.kit.log 'Listen port ' + port

nb.service.use nb.renderer.static()