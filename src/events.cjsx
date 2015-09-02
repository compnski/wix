class App.Events
  bind: (ev, callback) ->
    evs   = ev.split(' ')
    @_callbacks = {} unless @hasOwnProperty('_callbacks') and @_callbacks

    for name in evs
      @_callbacks[name] or= []
      @_callbacks[name].push(callback)
    this

  one: (ev, callback) ->
    @bind ev, ->
      @unbind(ev, arguments.callee)
      callback.apply(this, arguments)

  trigger: (args...) ->
    ev = args.shift()

    list = @hasOwnProperty('_callbacks') and @_callbacks?[ev]
    return unless list

    for callback in list
      if callback.apply(this, args) is false
        break
    true

  bubbles: (base, ev) ->
    base.bind(ev, ( (args...) => @trigger.apply(@,[ev].concat(args))))
    this

  unbind: (ev, callback) ->
    unless ev
      @_callbacks = {}
      return this

    list = @_callbacks?[ev]
    return this unless list

    unless callback
      delete @_callbacks[ev]
      return this

    for cb, i in list when cb is callback
      list = list.slice()
      list.splice(i, 1)
      @_callbacks[ev] = list
      break
    this

window.E = new App.Events()
