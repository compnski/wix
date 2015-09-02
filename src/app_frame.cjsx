class App.AppFrame extends React.Component
  render:->
    <div className='app-frame'>
      <App.StatusBarComponent/>
      <App.MapComponent mapData={@props.mapData}/>
      <App.InfoPanelComponent mapData={@props.mapData}/>
    </div>

class App.StatusBarComponent extends React.Component
  render: ->
    <div className='status-bar'>
    </div>

class App.InfoPanelComponent extends React.Component
  render: ->
    <div className='info-panel'>
    </div>
