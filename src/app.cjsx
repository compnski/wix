class App
  



window.App = App
#function init() {
window.init = ->
  App.BaseFlow.setNextFlow(new App.InitialFlow(new App.SetupFlow()))

