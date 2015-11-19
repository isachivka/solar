class Node

  properties:
    #action: ''
    #node_href: 0
    radius: 0
    degree: 0
    after_text: ''
    circle:
      radius: 50
      class: ''
    image:
      src: ''
      width: 0
      height: 0
  slide: ''
  elem: ''

  constructor: (o, slide) ->
    @properties = o
    @slide = slide
    addChainedAttributeAccessor(this, 'properties', attr) for attr of @properties

  position: () ->
    x = ( Math.cos @properties.degree * Math.PI / 180 ) * @properties.radius
    y = ( Math.sin @properties.degree * Math.PI / 180 ) * @properties.radius
    [x, y]

  animate_position: (degree, radius) ->
    x = ( Math.cos degree * Math.PI / 180 ) * radius
    y = ( Math.sin degree * Math.PI / 180 ) * radius
    [x, y]

  click: () ->
    if @properties.action
      switch @properties.action
        when 'up'
          @slide.animate_main_out()
          slide = @slide.solar.addSlide(getSlideData(@properties.node_href))
          slide.animate_up_in().parent_slide = @slide
        when 'down'
          @.slide.animate_up_out()
          @.slide.parent_slide.animate_main_in(500)
        when 'next'
          @slide.animate_prev_out(@)
          slide = @slide.solar.addSlide getSlideData(@properties.node_href)
          slide.animate_next_in(500).parent_slide = @slide
        when 'back'
          @.slide.animate_next_out()
          @.slide.parent_slide.animate_prev_in(500)

  draw: (container) ->
    @elem = container.append('g').attrs
      class: "solar__item"
      transform: "translate(#{@position()[0]}, #{@position()[1]})"
    @elem.on 'click', () =>
      @click()
    # Круг
    if @properties.circle
      @circle = @elem.append('circle').attrs
        class: "solar__item_circle #{@properties.circle.class}"
        r: @properties.circle.radius
        filter: "url(#drop-shadow)"
    # Текст под
    if @properties.after_text
      @text = @elem.append('text').text(@properties.after_text).attrs
        class: "solar__item_text_after"
        x: 0
        y: @properties.circle.radius + 30
    # Картинка внутри
    if @properties.image
      @image = @elem.append('image').attrs
        'xlink:href': @properties.image.src
        height: @properties.image.height
        width: @properties.image.width
        x: @properties.image.width / 2 * -1
        y: @properties.image.height / 2 * -1
    @

  main_in: (i) ->
    @elem.attr('opacity', 0)
    if i is 0
      @elem.transition().duration(500).attr('opacity', 1)
    else
      @elem.transition().delay(300).duration(500).tween 'blah', () =>
        (t) =>
          params = @animate_position(@properties.degree + ((t - 1) * 30), @properties.radius * t)
          @elem.attrs
            transform: "translate(#{params[0]}, #{params[1]}) scale(#{t})"
            opacity: t

  main_out: (i) ->
    if i is 0
      @elem.transition().delay(300).duration(500).attr('opacity', 0)
    else
      @elem.transition().duration(500).tween 'blah', () =>
        (t) =>
          t = t * -1 + 1
          params = @animate_position(@properties.degree + ((t - 1) * 30), @properties.radius * t)
          @elem.attrs
            transform: "translate(#{params[0]}, #{params[1]}) scale(#{t})"
            opacity: t

  up_in: (i) ->
    @elem.transition().delay(1000).duration(500).tween 'blah', () =>
      (t) =>
        params = @animate_position(@properties.degree + ((t - 1) * 30), @properties.radius + (t * -1 + 1) * 1000)
        @elem.attrs
          transform: "translate(#{params[0]}, #{params[1]}) scale(#{((t - 1) / -1) * 4 + 1})"
          opacity: t

  up_out: (i) ->
    @elem.transition().duration(500).tween 'blah', () =>
      (t) =>
        t = t * -1 + 1
        params = @animate_position(@properties.degree + ((t - 1) * 30), @properties.radius + (t * -1 + 1) * 1000)
        @elem.attrs
          transform: "translate(#{params[0]}, #{params[1]}) scale(#{((t - 1) / -1) * 4 + 1})"
          opacity: t

class Orbit

  properties:
    radius: 10
    text: ''
    class: ''
  elem: ''

  constructor: (o) ->
    @properties = o
    addChainedAttributeAccessor(this, 'properties', attr) for attr of @properties

  draw: (container) ->
    @elem = container.append('g').attrs
      class: 'solar__orbit'
    @circle = @elem.append('circle').attrs
      class: "solar__orbit_circle #{@properties.class}"
      r: @properties.radius
    if @properties.text
      @text = @elem.append('text').text(@properties.text).attrs 
        x: @properties.radius - 20
        y: 0
        class: "solar__orbit_text"
    @

  main_in: (i) ->
    @circle.attrs
      r: @properties.radius - 100
      opacity: 0
    if @text
      @text.attrs
        opacity: 0
    delay 300 + i * 70, =>
      @circle.transition().duration(200).attr('r', @properties.radius).attr('opacity', 1)
      if @text
        delay 300, =>
          @text.transition().duration(50).attr('opacity', 1)

  main_out: (i) ->
    delay 300 + i * 70, =>
      @circle.transition().duration(200).attr('r', @properties.radius - 100).attr('opacity', 0)
      if @text
        delay 300, =>
          @text.transition().duration(50).attr('opacity', 0)

class Slide

  properties:
    orbits: []
    nodes: []

  constructor: (o, solar) ->
    @properties.orbits = o.orbits
    @properties.nodes = o.nodes
    console.log 'construct slide: ', @properties.nodes, @properties.orbits
    @nodes = []
    @orbits = []
    @parent_slide = ''
    @solar = ''
    @elem = ''
    @solar = solar

  draw: (container) ->
    @elem = container.append('g').attrs
      class: 'solar__slide'
      opacity: 0
    @orbits_wrap = @elem.append('g').attrs
      class: "solar__orbits"
    @items_wrap = @elem.append('g').attrs
      class: "solar__items"
    if @properties.orbits
      @orbits.push(new Orbit(d).draw(@orbits_wrap)) for d in @properties.orbits
    if @properties.nodes
      @nodes.push(new Node(d, this).draw(@items_wrap)) for d in @properties.nodes
    @

  show: () ->
    @elem.transition().attr('opacity', 1)
    @

  hide: () ->
    @elem.transition().attr('opacity', 0)
    @

  remove: () ->
    @elem.remove()
    @

  animate_main_in: (d = 0) ->
    delay d, () =>
      @elem.transition().attr('opacity', 1)
      # должны быть правильно отсортированы
      orbit.main_in(i) for orbit, i in @orbits
      # аналогично (
      node.main_in(i) for node, i in @nodes
    @

  animate_main_out: () ->
    # должны быть правильно отсортированы
    orbit.main_out(i) for orbit, i in @orbits.reverse()
    # аналогично (
    node.main_out(i) for node, i in @nodes
    @orbits.reverse()
    @

  animate_up_in: () ->
    @elem.transition().delay(1000).attr('opacity', 1)
    node.up_in(i) for node, i in @nodes
    @

  animate_up_out: () ->
    node.up_out(i) for node, i in @nodes
    @

  animate_prev_in: (d) ->
    console.log 'prev in start'
    @elem.attr('style', 'visibility:visible')
    @elem.transition().delay(d).duration(1000).tween('blah', () =>
      (t) =>
        t = (t - 1) * -1
        p = @p_node.animate_position(@p_node.properties.degree + 30 * t, @p_node.properties.radius)
        @elem.attrs
          transform: "translate(#{p[0] * t * -1 * 6}, #{p[1] * t * -1 * 6}) scale(#{t * 5 + 1}) rotate(#{30 * t})"
          opacity: (t - 1) * -1
    )
    @

  animate_prev_out: (node) ->
    console.log 'prev out start'
    @p_node = node
    @elem.transition().duration(1000).tween('blah', () =>
      (t) =>
        p = node.animate_position(node.properties.degree + 30 * t, node.properties.radius)
        @elem.attrs
          transform: "translate(#{p[0] * t * -1 * 6}, #{p[1] * t * -1 * 6}) scale(#{t * 5 + 1}) rotate(#{30 * t})"
          opacity: (t - 1) * -1
    ).each 'end', =>
      @elem.attr('style', 'visibility:hidden')
    @

  animate_next_in: (d = 0) ->
    delay d, () =>
      @elem.transition().attr('opacity', 1)
      orbit.main_in(i) for orbit, i in @orbits
      node.main_in(i) for node, i in @nodes
    @

  animate_next_out: () ->
    orbit.main_out(i) for orbit, i in @orbits.reverse()
    node.main_out(i) for node, i in @nodes
    @orbits.reverse()
    @elem.transition().duration(1500).remove()
    @
    


class Solar

  constructor: (svg) ->
    @e = d3.select('svg').append('g').attrs
      class: "solar__main_g"
    @position()
    $(window).on 'resize', () =>
      @position()

  position: () ->
    @e.attr('transform', "translate(#{$(window).width() / 2}, #{$(window).height() / 2})")

  addSlide: (data) ->
    slide = new Slide(data, @)
    console.log 'add slide with data: ', data, slide
    slide.draw(@e)
    slide



do init = ->
  s = new Solar('#solar-system svg')
  slide = s.addSlide(getSlideData(0))
  slide.animate_main_in()
