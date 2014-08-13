process.env.NODE_ENV = 'production'

data = require './data'
nobone = require 'nobone'
_ = require 'lodash'

nb = nobone {
    proxy: {}
    renderer: {}
    service: {}
}

log = nb.kit.log
render = nb.renderer.render
write = nb.kit.outputFile

# # complie md
# weekly = []
# nb.kit.readdir('weekly')
#     .done (rs) ->
#         weekly =  _.without(rs, 'img').reverse()
#         write 'weekly.json', JSON.stringify(weekly)

# complie html
render('index.ejs')
    .done (tpl_func) ->
        html = tpl_func( { members: data.members } )
        write 'index.html', html
            .done () ->
                log 'complie html done.'.green

# complie stylus
nb.kit.readdir 'css'
    .done (files) ->
        files.forEach (file) ->
            if file.indexOf('.styl') > -1
                file = 'css/' + file
                render file
                    .done (rs) ->
                        write file.replace('.styl', '.css'), rs
                            .done () ->
                                log ('complie ' + file + ' done.').green


