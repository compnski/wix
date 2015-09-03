class App.AppFrame extends React.Component
  render:->
    <div className='app-frame'>
      <App.StatusBarComponent viewData={@props.viewData}/>
      <App.MapComponent viewData={@props.viewData}/>
      <App.InfoPanelComponent viewData={@props.viewData}/>
    </div>

class App.StatusBarComponent extends React.Component
  render: ->
    <div className='status-bar'>
    </div>
