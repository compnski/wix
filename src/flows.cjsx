class App.GameStateController

  constructor: ->
    @currentFlow = null
    @flowStack = []
    
  setNextFlow: (flow) ->
    if @currentFlow?
      @flowStack.push(flow)      
      console.log "Suspending #{@currentFlow}"
      @currentFlow.suspend()
    @currentFlow = flow
    @currentFlow.bind('complete', @flowComplete)
    console.log "starting flow #{flow}"
    @currentFlow.execute()
    
  flowComplete: (evt) =>
    if @flow != @currentFlow
        throw new Error("Only currentFlow can complete. flow= #{flow}  currentFlow=#{@currentFlow}")

    @currentFlow = @flowStack.pop()
    console.log "Restoring #{nextFlow}"
    setTimeout((=> @currentFlow.restored()), 0)

class App.BaseFlow extends App.Events

  @_flowController = new App.GameStateController()

  active: -> @_active

  constructor: ->
    @_active = false
    @nextRestoreCb = false

  execute: ->
    @_active = true

  suspend: ->
    @_active = false

  restored: (evt) ->
    @_active = true
    if @nextRestoreCb?
      cb = @nextRestoreCb
      delete @nextRestoreCb
      @nextRestoreCb(evt)

  delayedComplete: (delayMs, data) ->
    @_active = false
    App.Timer.setTimeout(delayMs, => @complete(data))

  complete: (data) ->
    @_active = false
    @trigger('complete', data)
    @release()

  # If this is called, call this function after being restored.
  # Easy way to chain 
  onRestore: (@nextRestoreCb) ->

  release: ->
    super
    
  @setNextFlow: (flow) ->
    App.BaseFlow._flowController.setNextFlow(flow)
    
  toString: ->
    @constructor.name

# Starter flow, I don't remember why this is important. I think because the first flow replaces itself into a new one, and the game ends if there is now flow?
class App.InitialFlow extends App.BaseFlow
  constructor: (@nextFlow) ->
    super()

  execute: ->
    App.BaseFlow.setNextFlow(@nextFlow);
