 class App.OverworldFlow extends App.BaseFlow

  constructor: (@map) ->
    super

  execute: ->
    super
    
    E.bind('key_down', @keyDown)
    E.bind('key_up', @keyUp)
    E.bind('tile_clicked', @tileClicked)

  tileClicked: (data) =>
    return unless @active()
    console.log data, @map.mapData[data.r][data.c]

    #@showTileInfo(evt.dest)
    
    # private function keyUp(evt:KeyboardEvent):void {
    #   //trace("up", evt)
    #   //MOVE PLAYER 
    # }
    
    # private function keyDown(evt:KeyboardEvent):void {
    #   //trace("down",evt)
    #   //move player
    # }
