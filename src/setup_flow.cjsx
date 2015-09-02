class App.SetupFlow extends App.BaseFlow

  execute: ->
    super
    body = document.getElementById('body')
    mapData = new App.Map()
    element = React.createElement(App.AppFrame, {mapData: mapData.mapData})
    React.render(element, body)
    @onRestore(@complete)
    App.BaseFlow.setNextFlow(new App.OverworldFlow(mapData))
