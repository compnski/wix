class App.InfoPanelComponent extends React.Component

  contents: ->
    console.log @props
    return "" unless @props.viewData.selectedTile?
    r = @props.viewData.selectedTile.r
    c = @props.viewData.selectedTile.c
    mapData = @props.viewData.mapData
    "#{r}, #{c} = #{mapData.terrainAt(r,c)}"


  render: ->
    <div className='info-panel'>
      {@contents()}
    </div>
