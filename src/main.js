// Generated by CoffeeScript 1.9.3
(function() {
  var App, Map, TERRAIN, TERRAIN_NAMES, TILE_SIZE,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  App = (function() {
    function App() {}

    return App;

  })();

  window.App = App;

  window.init = function() {
    return App.BaseFlow.setNextFlow(new App.InitialFlow(new App.SetupFlow()));
  };

  App.ViewData = (function() {
    function ViewData() {
      this.mapData = new App.Map();
    }

    return ViewData;

  })();

  App.draw = function() {
    var body, element;
    if (App.viewData == null) {
      App.viewData = new App.ViewData();
    }
    body = document.getElementById('body');
    element = React.createElement(App.AppFrame, {
      viewData: App.viewData
    });
    return React.render(element, body);
  };

  App.AppFrame = (function(superClass) {
    extend(AppFrame, superClass);

    function AppFrame() {
      return AppFrame.__super__.constructor.apply(this, arguments);
    }

    AppFrame.prototype.render = function() {
      return React.createElement("div", {
        "className": 'app-frame'
      }, React.createElement(App.StatusBarComponent, {
        "viewData": this.props.viewData
      }), React.createElement(App.MapComponent, {
        "viewData": this.props.viewData
      }), React.createElement(App.InfoPanelComponent, {
        "viewData": this.props.viewData
      }));
    };

    return AppFrame;

  })(React.Component);

  App.StatusBarComponent = (function(superClass) {
    extend(StatusBarComponent, superClass);

    function StatusBarComponent() {
      return StatusBarComponent.__super__.constructor.apply(this, arguments);
    }

    StatusBarComponent.prototype.render = function() {
      return React.createElement("div", {
        "className": 'status-bar'
      });
    };

    return StatusBarComponent;

  })(React.Component);

  App.Events = (function() {
    function Events() {}

    Events.prototype.bind = function(ev, callback) {
      var base1, evs, j, len, name;
      evs = ev.split(' ');
      if (!(this.hasOwnProperty('_callbacks') && this._callbacks)) {
        this._callbacks = {};
      }
      for (j = 0, len = evs.length; j < len; j++) {
        name = evs[j];
        (base1 = this._callbacks)[name] || (base1[name] = []);
        this._callbacks[name].push(callback);
      }
      return this;
    };

    Events.prototype.one = function(ev, callback) {
      return this.bind(ev, function() {
        this.unbind(ev, arguments.callee);
        return callback.apply(this, arguments);
      });
    };

    Events.prototype.trigger = function() {
      var args, callback, ev, j, len, list, ref;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      ev = args.shift();
      list = this.hasOwnProperty('_callbacks') && ((ref = this._callbacks) != null ? ref[ev] : void 0);
      if (!list) {
        return;
      }
      for (j = 0, len = list.length; j < len; j++) {
        callback = list[j];
        if (callback.apply(this, args) === false) {
          break;
        }
      }
      return true;
    };

    Events.prototype.bubbles = function(base, ev) {
      base.bind(ev, ((function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return _this.trigger.apply(_this, [ev].concat(args));
        };
      })(this)));
      return this;
    };

    Events.prototype.unbind = function(ev, callback) {
      var cb, i, j, len, list, ref;
      if (!ev) {
        this._callbacks = {};
        return this;
      }
      list = (ref = this._callbacks) != null ? ref[ev] : void 0;
      if (!list) {
        return this;
      }
      if (!callback) {
        delete this._callbacks[ev];
        return this;
      }
      for (i = j = 0, len = list.length; j < len; i = ++j) {
        cb = list[i];
        if (!(cb === callback)) {
          continue;
        }
        list = list.slice();
        list.splice(i, 1);
        this._callbacks[ev] = list;
        break;
      }
      return this;
    };

    return Events;

  })();

  window.E = new App.Events();

  App.GameStateController = (function() {
    function GameStateController() {
      this.flowComplete = bind(this.flowComplete, this);
      this.currentFlow = null;
      this.flowStack = [];
    }

    GameStateController.prototype.setNextFlow = function(flow) {
      if (this.currentFlow != null) {
        this.flowStack.push(flow);
        console.log("Suspending " + this.currentFlow);
        this.currentFlow.suspend();
      }
      this.currentFlow = flow;
      this.currentFlow.bind('complete', this.flowComplete);
      console.log("starting flow " + flow);
      return this.currentFlow.execute();
    };

    GameStateController.prototype.flowComplete = function(evt) {
      if (this.flow !== this.currentFlow) {
        throw new Error("Only currentFlow can complete. flow= " + flow + "  currentFlow=" + this.currentFlow);
      }
      this.currentFlow = this.flowStack.pop();
      console.log("Restoring " + nextFlow);
      return setTimeout(((function(_this) {
        return function() {
          return _this.currentFlow.restored();
        };
      })(this)), 0);
    };

    return GameStateController;

  })();

  App.BaseFlow = (function(superClass) {
    extend(BaseFlow, superClass);

    BaseFlow._flowController = new App.GameStateController();

    BaseFlow.prototype.active = function() {
      return this._active;
    };

    function BaseFlow() {
      this._active = false;
      this.nextRestoreCb = false;
    }

    BaseFlow.prototype.execute = function() {
      return this._active = true;
    };

    BaseFlow.prototype.suspend = function() {
      return this._active = false;
    };

    BaseFlow.prototype.restored = function(evt) {
      var cb;
      this._active = true;
      if (this.nextRestoreCb != null) {
        cb = this.nextRestoreCb;
        delete this.nextRestoreCb;
        return this.nextRestoreCb(evt);
      }
    };

    BaseFlow.prototype.delayedComplete = function(delayMs, data) {
      this._active = false;
      return App.Timer.setTimeout(delayMs, (function(_this) {
        return function() {
          return _this.complete(data);
        };
      })(this));
    };

    BaseFlow.prototype.complete = function(data) {
      this._active = false;
      this.trigger('complete', data);
      return this.release();
    };

    BaseFlow.prototype.onRestore = function(nextRestoreCb) {
      this.nextRestoreCb = nextRestoreCb;
    };

    BaseFlow.prototype.release = function() {
      return BaseFlow.__super__.release.apply(this, arguments);
    };

    BaseFlow.setNextFlow = function(flow) {
      return App.BaseFlow._flowController.setNextFlow(flow);
    };

    BaseFlow.prototype.toString = function() {
      return this.constructor.name;
    };

    return BaseFlow;

  })(App.Events);

  App.InitialFlow = (function(superClass) {
    extend(InitialFlow, superClass);

    function InitialFlow(nextFlow1) {
      this.nextFlow = nextFlow1;
      InitialFlow.__super__.constructor.call(this);
    }

    InitialFlow.prototype.execute = function() {
      return App.BaseFlow.setNextFlow(this.nextFlow);
    };

    return InitialFlow;

  })(App.BaseFlow);

  TILE_SIZE = 64;

  Map = (function() {
    function Map() {}

    return Map;

  })();

  TERRAIN = {
    w: {
      w: 15,
      s: 5,
      d: 0,
      g: 0,
      f: 0
    },
    s: {
      w: 1,
      s: 4,
      d: 7,
      g: 2,
      f: 1
    },
    d: {
      w: 1,
      s: 2,
      d: 5,
      g: 7,
      f: 4
    },
    g: {
      w: 0,
      s: 2,
      d: 3,
      g: 30,
      f: 6
    },
    f: {
      w: 0,
      s: 1,
      d: 3,
      g: 7,
      f: 35
    }
  };

  TERRAIN_NAMES = {
    w: "Water",
    s: "Sand",
    d: "Dirt",
    g: "Grass",
    f: "Forest"
  };

  App.Map = (function() {
    function Map() {
      this.rows = this.genMapData(14, 19);
    }

    Map.prototype.terrainAt = function(r, c) {
      return TERRAIN_NAMES[this.rows[r][c]];
    };

    Map.prototype.pickTile = function(mapData, r, c) {
      var cOff, d, j, k, rOff, ref, ref1, t, val, weights;
      weights = {};
      for (rOff = j = -1; j <= 1; rOff = ++j) {
        for (cOff = k = -1; k <= 1; cOff = ++k) {
          d = (ref = mapData[r - rOff]) != null ? ref[c - cOff] : void 0;
          if (d == null) {
            continue;
          }
          ref1 = TERRAIN[d];
          for (t in ref1) {
            val = ref1[t];
            weights[t] || (weights[t] = 0);
            weights[t] += val;
          }
        }
      }
      return this.pickTileFromWeights(weights);
    };

    Map.prototype.pickTileFromWeights = function(weights) {
      var _, n, pick, total, w;
      total = 0;
      for (_ in weights) {
        n = weights[_];
        total += n;
      }
      pick = parseInt(Math.random() * total);
      for (w in weights) {
        n = weights[w];
        pick -= n;
        if (pick <= 0) {
          return w;
        }
      }
    };

    Map.prototype.genMapData = function(rMax, cMax, mapData) {
      var c, j, mapRow, r, ref, results;
      if (mapData == null) {
        mapData = [];
      }
      results = [];
      for (r = j = 0, ref = rMax; 0 <= ref ? j <= ref : j >= ref; r = 0 <= ref ? ++j : --j) {
        mapRow = [];
        mapData.push(mapRow);
        results.push((function() {
          var k, ref1, results1;
          results1 = [];
          for (c = k = 0, ref1 = cMax; 0 <= ref1 ? k <= ref1 : k >= ref1; c = 0 <= ref1 ? ++k : --k) {
            if (r % rMax === 0 || c % cMax === 0) {
              results1.push(mapRow[c] = 'w');
            } else {
              results1.push(mapRow[c] = this.pickTile(mapData, r, c));
            }
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    return Map;

  })();

  App.MapComponent = (function(superClass) {
    extend(MapComponent, superClass);

    function MapComponent() {
      return MapComponent.__super__.constructor.apply(this, arguments);
    }

    MapComponent.prototype.render = function() {
      return React.createElement(App.GridMap, {
        "viewData": this.props.viewData
      });
    };

    return MapComponent;

  })(React.Component);

  App.GridMap = (function(superClass) {
    extend(GridMap, superClass);

    function GridMap() {
      return GridMap.__super__.constructor.apply(this, arguments);
    }

    GridMap.prototype.gridRows = function() {
      var c, cell, r, ref, results, row;
      ref = this.props.viewData.mapData.rows;
      results = [];
      for (r in ref) {
        row = ref[r];
        results.push((function() {
          var results1;
          results1 = [];
          for (c in row) {
            cell = row[c];
            results1.push(React.createElement(App.Tile, {
              "r": r,
              "c": c,
              "data": cell
            }));
          }
          return results1;
        })());
      }
      return results;
    };

    GridMap.prototype.render = function() {
      return React.createElement("div", {
        "className": 'map'
      }, this.gridRows());
    };

    return GridMap;

  })(React.Component);

  App.Tile = (function(superClass) {
    extend(Tile, superClass);

    function Tile() {
      this.handleMouseOver = bind(this.handleMouseOver, this);
      this.handleClick = bind(this.handleClick, this);
      return Tile.__super__.constructor.apply(this, arguments);
    }

    Tile.prototype.handleClick = function(e) {
      return E.trigger('tile_clicked', {
        r: this.props.r,
        c: this.props.c
      });
    };

    Tile.prototype.handleMouseOver = function(e) {
      return E.trigger('tile_hovered', {
        r: this.props.r,
        c: this.props.c
      });
    };

    Tile.prototype.render = function() {
      var pos;
      pos = {
        left: this.props.c * TILE_SIZE,
        top: this.props.r * TILE_SIZE
      };
      return React.createElement("div", {
        "className": "cell t_" + this.props.data,
        "style": pos,
        "onClick": this.handleClick,
        "onMouseOver": this.handleMouseOver
      });
    };

    return Tile;

  })(React.Component);

  App.OverworldFlow = (function(superClass) {
    extend(OverworldFlow, superClass);

    function OverworldFlow() {
      this.tileHovered = bind(this.tileHovered, this);
      this.tileClicked = bind(this.tileClicked, this);
      OverworldFlow.__super__.constructor.apply(this, arguments);
    }

    OverworldFlow.prototype.execute = function() {
      OverworldFlow.__super__.execute.apply(this, arguments);
      E.bind('key_down', this.keyDown);
      E.bind('key_up', this.keyUp);
      E.bind('tile_clicked', this.tileClicked);
      return E.bind('tile_hovered', this.tileHovered);
    };

    OverworldFlow.prototype.tileClicked = function(data) {
      if (!this.active()) {
        return;
      }
      App.viewData.selectedTile = {
        r: data.r,
        c: data.c
      };
      console.log(data, App.viewData.mapData.rows[data.r][data.c]);
      return App.draw();
    };

    OverworldFlow.prototype.tileHovered = function(data) {
      if (!this.active()) {
        return;
      }
      App.viewData.selectedTile = {
        r: data.r,
        c: data.c
      };
      console.log(data, App.viewData.mapData.rows[data.r][data.c]);
      return App.draw();
    };

    return OverworldFlow;

  })(App.BaseFlow);

  App.SetupFlow = (function(superClass) {
    extend(SetupFlow, superClass);

    function SetupFlow() {
      return SetupFlow.__super__.constructor.apply(this, arguments);
    }

    SetupFlow.prototype.execute = function() {
      SetupFlow.__super__.execute.apply(this, arguments);
      App.draw();
      this.onRestore(this.complete);
      return App.BaseFlow.setNextFlow(new App.OverworldFlow());
    };

    return SetupFlow;

  })(App.BaseFlow);

  App.InfoPanelComponent = (function(superClass) {
    extend(InfoPanelComponent, superClass);

    function InfoPanelComponent() {
      return InfoPanelComponent.__super__.constructor.apply(this, arguments);
    }

    InfoPanelComponent.prototype.contents = function() {
      var c, mapData, r;
      console.log(this.props);
      if (this.props.viewData.selectedTile == null) {
        return "";
      }
      r = this.props.viewData.selectedTile.r;
      c = this.props.viewData.selectedTile.c;
      mapData = this.props.viewData.mapData;
      return r + ", " + c + " = " + (mapData.terrainAt(r, c));
    };

    InfoPanelComponent.prototype.render = function() {
      return React.createElement("div", {
        "className": 'info-panel'
      }, this.contents());
    };

    return InfoPanelComponent;

  })(React.Component);

}).call(this);

//# sourceMappingURL=main.map
