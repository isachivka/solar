do monkey_patch = ->
  if d3.version != "2.9.2"
    alert('Monkey patch warning')
  d3.selection.prototype.attrs = (as) ->
    this.attr key, value for key, value of as
    this
addChainedAttributeAccessor = (obj, propertyAttr, attr) ->
  obj[attr] = (newValues...) ->
    if newValues.length == 0
      obj[propertyAttr][attr]
    else
      obj[propertyAttr][attr] = newValues[0]
      obj
delay = (ms, func) -> setTimeout func, ms


solar_data = [
  {
    id: 3
    nodes: [
      {
        action: 'back'
        radius: 0
        degree: 0
        circle: 
          radius: 44.5
      }, {
        action: 'next'
        node_href: 2
        radius: 200
        degree: 0
        circle: 
          radius: 44.5
      }, {
        action: 'next'
        node_href: 2
        radius: 200
        degree: 120
        circle: 
          radius: 44.5
      }, {
        action: 'next'
        node_href: 2
        radius: 200
        degree: 240
        circle: 
          radius: 44.5
      }
    ]
    orbits: [
      { 
        radius: 200
      }
    ]
  }, {
    id: 2
    nodes: [
      {
        action: 'back'
        radius: 0
        degree: 0
        circle: 
          radius: 44.5
      }, {
        action: 'next'
        node_href: 3
        radius: 200
        degree: 30
        circle: 
          radius: 44.5
      }, {
        action: 'next'
        node_href: 3
        radius: 200
        degree: 150
        circle: 
          radius: 44.5
      }, {
        action: 'next'
        node_href: 3
        radius: 200
        degree: 270
        circle: 
          radius: 44.5
      }
    ]
    orbits: [
      { 
        radius: 200
      }
    ]
  }, {
    id: 1
    nodes: [
      {
        action: 'down'
        radius: 0
        degree: 0
        circle: 
          radius: 44.5
      }, {
        action: 'next'
        node_href: 2
        radius: 200
        degree: 0
        circle: 
          radius: 44.5
      }, {
        action: 'next'
        node_href: 2
        radius: 200
        degree: 120
        circle: 
          radius: 44.5
      }, {
        action: 'next'
        node_href: 2
        radius: 200
        degree: 240
        circle: 
          radius: 44.5
      }
    ]
  }, {
    id: 0
    nodes: [
      {
        radius: 0
        degree: 0
        circle: 
          radius: 44.5
          class: 'user_node'
        image:
          width: 99
          height: 99
          src: 'img/user.png'
      }, {
        radius: 250
        degree: 150
        action: 'next'
        node_href: 2
        after_text: "Тестовый текст"
        circle: 
          radius: 44.5
          class: ''
      }, {
        action: 'up'
        node_href: 1
        radius: 145
        degree: 90
        circle: 
          radius: 35
        image:
          width: 28
          height: 28
          src: 'img/plus.png'
      }
    ]
    orbits: [
      {
        radius: 145
        class: 'inner_orbit'
      }, {
        radius: 250
        text: 'Образование'
      }, { 
        radius: 360
        text: 'Стаж 1 год'
      }, { 
        radius: 470
        text: '2'
      }, { 
        radius: 580
        text: '3'
      }, { 
        radius: 690
      }
    ]
  }
]

getSlideData = (id) ->
  a = ''
  $(solar_data).each (d, v) ->
    if v.id == id
      a = v
  return a