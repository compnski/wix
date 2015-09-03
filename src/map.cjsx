TILE_SIZE=64
class Map

# water
# sand
# dirt
# grass
# forest

# TODO: Biome / elevation / rainfall?
# Resources
#  Fertile Soil
#  Metals
#  Wood
#  Magic


TERRAIN = 
  w: 
    w: 15
    s: 5
    d: 0
    g: 0
    f: 0
  s: 
    w: 1
    s: 4
    d: 7
    g: 2
    f: 1
  d: 
    w: 1
    s: 2
    d: 5
    g: 7
    f: 4
  g: 
    w: 0
    s: 2
    d: 3
    g: 30
    f: 6
  f: 
    w: 0
    s: 1
    d: 3
    g: 7
    f: 35

TERRAIN_NAMES =
  w: "Water"
  s: "Sand"
  d: "Dirt"
  g: "Grass"
  f: "Forest"

class App.Map
  constructor: -> 
    @rows = @genMapData(14, 19)
#    @mapData = @genMapData(16, 20, @mapData) for i in [0..10]
     # blur
     # perlin noise

  terrainAt: (r,c ) ->
    TERRAIN_NAMES[@rows[r][c]]

  pickTile: (mapData, r, c) ->
    weights = {}
    for rOff in [-1..1]
      for cOff in [-1..1]
        d = mapData[r-rOff]?[c-cOff]
        continue unless d?
        for t, val of TERRAIN[d]
          weights[t] ||= 0
          weights[t] += val
    @pickTileFromWeights(weights)

  pickTileFromWeights: (weights) ->
    total = 0
    for _, n of weights
      total += n
    pick = parseInt(Math.random() * total)
    for w, n of weights
      pick -= n
      if pick <=0 
        return w

  genMapData: (rMax, cMax, mapData=[]) ->
    for r in [0..rMax]
      mapRow = []
      mapData.push(mapRow)
      for c in [0..cMax]
        if r % rMax == 0 or c % cMax == 0
          mapRow[c] = 'w'
        else
          mapRow[c] = @pickTile(mapData, r, c)

class App.MapComponent extends React.Component
  render: ->
    <App.GridMap viewData={@props.viewData}/>

class App.GridMap extends React.Component
  gridRows: ->
    for r, row of @props.viewData.mapData.rows
      for c, cell of row
        <App.Tile r={r} c={c} data={cell}/>

  render: ->
    <div className='map'>{@gridRows()}</div>

class App.Tile extends React.Component

  handleClick: (e) =>
    E.trigger('tile_clicked', {r:@props.r, c:@props.c})

  handleMouseOver: (e) =>
    E.trigger('tile_hovered', {r:@props.r, c:@props.c})

  render: ->
    pos =
      left: @props.c * TILE_SIZE
      top: @props.r * TILE_SIZE
    <div className={"cell t_" + @props.data} style={pos} onClick={@handleClick} onMouseOver={@handleMouseOver}></div>
