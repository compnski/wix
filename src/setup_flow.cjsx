class App.SetupFlow extends App.BaseFlow

  execute: ->
    super
    App.draw()
    @onRestore(@complete)
    App.BaseFlow.setNextFlow(new App.OverworldFlow())
