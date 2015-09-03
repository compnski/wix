 class App.OverworldFlow extends App.BaseFlow

  constructor: () ->
    super

  execute: ->
    super
    
    E.bind('key_down', @keyDown)
    E.bind('key_up', @keyUp)
    E.bind('tile_clicked', @tileClicked)
    E.bind('tile_hovered', @tileHovered)

  tileClicked: (data) =>
    return unless @active()
    App.viewData.selectedTile = {r:data.r, c:data.c}
    console.log data, App.viewData.mapData.rows[data.r][data.c]
    App.draw()

  tileHovered: (data) =>
    return unless @active()
    App.viewData.selectedTile = {r:data.r, c:data.c}
    console.log data, App.viewData.mapData.rows[data.r][data.c]
    App.draw()

    #@showTileInfo(evt.dest)
    
    # private function keyUp(evt:KeyboardEvent):void {
    #   //trace("up", evt)
    #   //MOVE PLAYER 
    # }
    
    # private function keyDown(evt:KeyboardEvent):void {
    #   //trace("down",evt)
    #   //move player
    # }
