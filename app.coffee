process.env.NODE_ENV = 'development'

nobone = require 'nobone'
data = require './data'

port = 8457

{ kit, proxy, renderer, service  } = nobone {
    proxy: {}
    renderer: {}
    service: {}
}

# weekly = require './weekly'
# service.get '/', (req, res) ->
#     renderer.render('index.ejs')
#     .done (tpl_func) ->
#         res.send tpl_func( { members: data.members, weekly: weekly } )

# service.get '/weekly/:title', (req, res) ->
# 	md = 'weekly/' + req.params['title']
# 	kit.fileExists(md)
# 		.done (rs) ->
# 			if rs
# 				renderer.render(md)
# 				.done (rs) ->
# 					res.send {error: '200', post: rs}
# 			else
# 				res.send {error: '404'}

service.get '/', (req, res) ->
    renderer.render('index.ejs')
    .done (tpl_func) ->
        res.send tpl_func( { members: data.members } )

service.listen port
kit.log 'Listen port ' + port

service.use renderer.static()