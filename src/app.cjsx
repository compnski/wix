class App
  



window.App = App
#function init() {
window.init = ->
  App.BaseFlow.setNextFlow(new App.InitialFlow(new App.SetupFlow()))

class App.ViewData
  constructor: ->
    @mapData = new App.Map()

App.draw = ->
    App.viewData ?= new App.ViewData()
    body = document.getElementById('body')
    element = React.createElement(App.AppFrame, {viewData: App.viewData})
    React.render(element, body)


