process.env.NODE_ENV = 'development'

nobone = require 'nobone'

data = require './data'

port = 8457



# All modules use default options to init.
# If you want don't init a specific module,
# for example 'db' and 'service' module, just exclude it:
#    nobone {
#        renderer: {}
#    }
# By default it load two module: service, renderer
nb = nobone {
    proxy: {}
    renderer: {}
    service: {}
}

# Server
nb.service.get '/', (req, res) ->
    # Renderer
    # You can also render coffee, stylus, less, markdown, or define custom handlers.
    nb.renderer.render('index.ejs')
    .done (tpl_func) ->
        res.send tpl_func( { members: data.members } )

# Launch socket.io and express.js
nb.service.listen port

# Kit
# Print out time, log message, time span between two log.
nb.kit.log 'Listen port ' + port

# Static folder to automatically serve coffeescript and stylus.
nb.service.use nb.renderer.static()