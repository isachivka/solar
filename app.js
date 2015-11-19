var Node, Orbit, Slide, Solar, init;

Node = (function() {
  Node.prototype.properties = {
    radius: 0,
    degree: 0,
    after_text: '',
    circle: {
      radius: 50,
      "class": ''
    },
    image: {
      src: '',
      width: 0,
      height: 0
    }
  };

  Node.prototype.slide = '';

  Node.prototype.elem = '';

  function Node(o, slide) {
    var attr;
    this.properties = o;
    this.slide = slide;
    for (attr in this.properties) {
      addChainedAttributeAccessor(this, 'properties', attr);
    }
  }

  Node.prototype.position = function() {
    var x, y;
    x = (Math.cos(this.properties.degree * Math.PI / 180)) * this.properties.radius;
    y = (Math.sin(this.properties.degree * Math.PI / 180)) * this.properties.radius;
    return [x, y];
  };

  Node.prototype.animate_position = function(degree, radius) {
    var x, y;
    x = (Math.cos(degree * Math.PI / 180)) * radius;
    y = (Math.sin(degree * Math.PI / 180)) * radius;
    return [x, y];
  };

  Node.prototype.click = function() {
    var slide;
    if (this.properties.action) {
      switch (this.properties.action) {
        case 'up':
          this.slide.animate_main_out();
          slide = this.slide.solar.addSlide(getSlideData(this.properties.node_href));
          return slide.animate_up_in().parent_slide = this.slide;
        case 'down':
          this.slide.animate_up_out();
          return this.slide.parent_slide.animate_main_in(500);
        case 'next':
          this.slide.animate_prev_out(this);
          slide = this.slide.solar.addSlide(getSlideData(this.properties.node_href));
          return slide.animate_next_in(500).parent_slide = this.slide;
        case 'back':
          this.slide.animate_next_out();
          return this.slide.parent_slide.animate_prev_in(500);
      }
    }
  };

  Node.prototype.draw = function(container) {
    this.elem = container.append('g').attrs({
      "class": "solar__item",
      transform: "translate(" + (this.position()[0]) + ", " + (this.position()[1]) + ")"
    });
    this.elem.on('click', (function(_this) {
      return function() {
        return _this.click();
      };
    })(this));
    if (this.properties.circle) {
      this.circle = this.elem.append('circle').attrs({
        "class": "solar__item_circle " + this.properties.circle["class"],
        r: this.properties.circle.radius,
        filter: "url(#drop-shadow)"
      });
    }
    if (this.properties.after_text) {
      this.text = this.elem.append('text').text(this.properties.after_text).attrs({
        "class": "solar__item_text_after",
        x: 0,
        y: this.properties.circle.radius + 30
      });
    }
    if (this.properties.image) {
      this.image = this.elem.append('image').attrs({
        'xlink:href': this.properties.image.src,
        height: this.properties.image.height,
        width: this.properties.image.width,
        x: this.properties.image.width / 2 * -1,
        y: this.properties.image.height / 2 * -1
      });
    }
    return this;
  };

  Node.prototype.main_in = function(i) {
    this.elem.attr('opacity', 0);
    if (i === 0) {
      return this.elem.transition().duration(500).attr('opacity', 1);
    } else {
      return this.elem.transition().delay(300).duration(500).tween('blah', (function(_this) {
        return function() {
          return function(t) {
            var params;
            params = _this.animate_position(_this.properties.degree + ((t - 1) * 30), _this.properties.radius * t);
            return _this.elem.attrs({
              transform: "translate(" + params[0] + ", " + params[1] + ") scale(" + t + ")",
              opacity: t
            });
          };
        };
      })(this));
    }
  };

  Node.prototype.main_out = function(i) {
    if (i === 0) {
      return this.elem.transition().delay(300).duration(500).attr('opacity', 0);
    } else {
      return this.elem.transition().duration(500).tween('blah', (function(_this) {
        return function() {
          return function(t) {
            var params;
            t = t * -1 + 1;
            params = _this.animate_position(_this.properties.degree + ((t - 1) * 30), _this.properties.radius * t);
            return _this.elem.attrs({
              transform: "translate(" + params[0] + ", " + params[1] + ") scale(" + t + ")",
              opacity: t
            });
          };
        };
      })(this));
    }
  };

  Node.prototype.up_in = function(i) {
    return this.elem.transition().delay(1000).duration(500).tween('blah', (function(_this) {
      return function() {
        return function(t) {
          var params;
          params = _this.animate_position(_this.properties.degree + ((t - 1) * 30), _this.properties.radius + (t * -1 + 1) * 1000);
          return _this.elem.attrs({
            transform: "translate(" + params[0] + ", " + params[1] + ") scale(" + (((t - 1) / -1) * 4 + 1) + ")",
            opacity: t
          });
        };
      };
    })(this));
  };

  Node.prototype.up_out = function(i) {
    return this.elem.transition().duration(500).tween('blah', (function(_this) {
      return function() {
        return function(t) {
          var params;
          t = t * -1 + 1;
          params = _this.animate_position(_this.properties.degree + ((t - 1) * 30), _this.properties.radius + (t * -1 + 1) * 1000);
          return _this.elem.attrs({
            transform: "translate(" + params[0] + ", " + params[1] + ") scale(" + (((t - 1) / -1) * 4 + 1) + ")",
            opacity: t
          });
        };
      };
    })(this));
  };

  return Node;

})();

Orbit = (function() {
  Orbit.prototype.properties = {
    radius: 10,
    text: '',
    "class": ''
  };

  Orbit.prototype.elem = '';

  function Orbit(o) {
    var attr;
    this.properties = o;
    for (attr in this.properties) {
      addChainedAttributeAccessor(this, 'properties', attr);
    }
  }

  Orbit.prototype.draw = function(container) {
    this.elem = container.append('g').attrs({
      "class": 'solar__orbit'
    });
    this.circle = this.elem.append('circle').attrs({
      "class": "solar__orbit_circle " + this.properties["class"],
      r: this.properties.radius
    });
    if (this.properties.text) {
      this.text = this.elem.append('text').text(this.properties.text).attrs({
        x: this.properties.radius - 20,
        y: 0,
        "class": "solar__orbit_text"
      });
    }
    return this;
  };

  Orbit.prototype.main_in = function(i) {
    this.circle.attrs({
      r: this.properties.radius - 100,
      opacity: 0
    });
    if (this.text) {
      this.text.attrs({
        opacity: 0
      });
    }
    return delay(300 + i * 70, (function(_this) {
      return function() {
        _this.circle.transition().duration(200).attr('r', _this.properties.radius).attr('opacity', 1);
        if (_this.text) {
          return delay(300, function() {
            return _this.text.transition().duration(50).attr('opacity', 1);
          });
        }
      };
    })(this));
  };

  Orbit.prototype.main_out = function(i) {
    return delay(300 + i * 70, (function(_this) {
      return function() {
        _this.circle.transition().duration(200).attr('r', _this.properties.radius - 100).attr('opacity', 0);
        if (_this.text) {
          return delay(300, function() {
            return _this.text.transition().duration(50).attr('opacity', 0);
          });
        }
      };
    })(this));
  };

  return Orbit;

})();

Slide = (function() {
  Slide.prototype.properties = {
    orbits: [],
    nodes: []
  };

  function Slide(o, solar) {
    this.properties.orbits = o.orbits;
    this.properties.nodes = o.nodes;
    console.log('construct slide: ', this.properties.nodes, this.properties.orbits);
    this.nodes = [];
    this.orbits = [];
    this.parent_slide = '';
    this.solar = '';
    this.elem = '';
    this.solar = solar;
  }

  Slide.prototype.draw = function(container) {
    var d, _i, _j, _len, _len1, _ref, _ref1;
    this.elem = container.append('g').attrs({
      "class": 'solar__slide',
      opacity: 0
    });
    this.orbits_wrap = this.elem.append('g').attrs({
      "class": "solar__orbits"
    });
    this.items_wrap = this.elem.append('g').attrs({
      "class": "solar__items"
    });
    if (this.properties.orbits) {
      _ref = this.properties.orbits;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        this.orbits.push(new Orbit(d).draw(this.orbits_wrap));
      }
    }
    if (this.properties.nodes) {
      _ref1 = this.properties.nodes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        d = _ref1[_j];
        this.nodes.push(new Node(d, this).draw(this.items_wrap));
      }
    }
    return this;
  };

  Slide.prototype.show = function() {
    this.elem.transition().attr('opacity', 1);
    return this;
  };

  Slide.prototype.hide = function() {
    this.elem.transition().attr('opacity', 0);
    return this;
  };

  Slide.prototype.remove = function() {
    this.elem.remove();
    return this;
  };

  Slide.prototype.animate_main_in = function(d) {
    if (d == null) {
      d = 0;
    }
    delay(d, (function(_this) {
      return function() {
        var i, node, orbit, _i, _j, _len, _len1, _ref, _ref1, _results;
        _this.elem.transition().attr('opacity', 1);
        _ref = _this.orbits;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          orbit = _ref[i];
          orbit.main_in(i);
        }
        _ref1 = _this.nodes;
        _results = [];
        for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
          node = _ref1[i];
          _results.push(node.main_in(i));
        }
        return _results;
      };
    })(this));
    return this;
  };

  Slide.prototype.animate_main_out = function() {
    var i, node, orbit, _i, _j, _len, _len1, _ref, _ref1;
    _ref = this.orbits.reverse();
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      orbit = _ref[i];
      orbit.main_out(i);
    }
    _ref1 = this.nodes;
    for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
      node = _ref1[i];
      node.main_out(i);
    }
    this.orbits.reverse();
    return this;
  };

  Slide.prototype.animate_up_in = function() {
    var i, node, _i, _len, _ref;
    this.elem.transition().delay(1000).attr('opacity', 1);
    _ref = this.nodes;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      node = _ref[i];
      node.up_in(i);
    }
    return this;
  };

  Slide.prototype.animate_up_out = function() {
    var i, node, _i, _len, _ref;
    _ref = this.nodes;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      node = _ref[i];
      node.up_out(i);
    }
    return this;
  };

  Slide.prototype.animate_prev_in = function(d) {
    console.log('prev in start');
    this.elem.attr('style', 'visibility:visible');
    this.elem.transition().delay(d).duration(1000).tween('blah', (function(_this) {
      return function() {
        return function(t) {
          var p;
          t = (t - 1) * -1;
          p = _this.p_node.animate_position(_this.p_node.properties.degree + 30 * t, _this.p_node.properties.radius);
          return _this.elem.attrs({
            transform: "translate(" + (p[0] * t * -1 * 6) + ", " + (p[1] * t * -1 * 6) + ") scale(" + (t * 5 + 1) + ") rotate(" + (30 * t) + ")",
            opacity: (t - 1) * -1
          });
        };
      };
    })(this));
    return this;
  };

  Slide.prototype.animate_prev_out = function(node) {
    console.log('prev out start');
    this.p_node = node;
    this.elem.transition().duration(1000).tween('blah', (function(_this) {
      return function() {
        return function(t) {
          var p;
          p = node.animate_position(node.properties.degree + 30 * t, node.properties.radius);
          return _this.elem.attrs({
            transform: "translate(" + (p[0] * t * -1 * 6) + ", " + (p[1] * t * -1 * 6) + ") scale(" + (t * 5 + 1) + ") rotate(" + (30 * t) + ")",
            opacity: (t - 1) * -1
          });
        };
      };
    })(this)).each('end', (function(_this) {
      return function() {
        return _this.elem.attr('style', 'visibility:hidden');
      };
    })(this));
    return this;
  };

  Slide.prototype.animate_next_in = function(d) {
    if (d == null) {
      d = 0;
    }
    delay(d, (function(_this) {
      return function() {
        var i, node, orbit, _i, _j, _len, _len1, _ref, _ref1, _results;
        _this.elem.transition().attr('opacity', 1);
        _ref = _this.orbits;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          orbit = _ref[i];
          orbit.main_in(i);
        }
        _ref1 = _this.nodes;
        _results = [];
        for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
          node = _ref1[i];
          _results.push(node.main_in(i));
        }
        return _results;
      };
    })(this));
    return this;
  };

  Slide.prototype.animate_next_out = function() {
    var i, node, orbit, _i, _j, _len, _len1, _ref, _ref1;
    _ref = this.orbits.reverse();
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      orbit = _ref[i];
      orbit.main_out(i);
    }
    _ref1 = this.nodes;
    for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
      node = _ref1[i];
      node.main_out(i);
    }
    this.orbits.reverse();
    this.elem.transition().duration(1500).remove();
    return this;
  };

  return Slide;

})();

Solar = (function() {
  function Solar(svg) {
    this.e = d3.select('svg').append('g').attrs({
      "class": "solar__main_g"
    });
    this.position();
    $(window).on('resize', (function(_this) {
      return function() {
        return _this.position();
      };
    })(this));
  }

  Solar.prototype.position = function() {
    return this.e.attr('transform', "translate(" + ($(window).width() / 2) + ", " + ($(window).height() / 2) + ")");
  };

  Solar.prototype.addSlide = function(data) {
    var slide;
    slide = new Slide(data, this);
    console.log('add slide with data: ', data, slide);
    slide.draw(this.e);
    return slide;
  };

  return Solar;

})();

(init = function() {
  var s, slide;
  s = new Solar('#solar-system svg');
  slide = s.addSlide(getSlideData(0));
  return slide.animate_main_in();
})();
