(function() {
    var Particle, Sphere, __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments)
        }
    };
    Sphere = function() {
        function Sphere(canvas, background_color, link_threshold, density, particles, effect_on) {
            this.background_color = background_color != null ? background_color : {
                h: 0,
                s: 0,
                l: 100,
                a: 0
            };
            this.link_threshold = link_threshold != null ? link_threshold : 300;
            this.density = density != null ? density : 20;
            this.particles = particles != null ? particles : null;
            this.canvas = canvas != null ? canvas : null;
            this.effect_on = effect_on != null ? effect_on : true;
            this.animate = __bind(this.animate, this);
            if (!this.is_canvas_supported()) {
                return
            }
            this.init_effect_control();
            this.init_canvas();
            this.init_size();
            this.init_particles();
            this.init_label();
            jQuery(window).resize(function(_this) {
                return function() {
                    _this.init_size();
                    return _this.init_particles()
                }
            }(this));
            this.init_mouse_event()
        }
        Sphere.prototype.animate = function() {
            if (!this.effect_on) {
                this.canvas.width = this.canvas.width;
                this.$label.css({
                    visibility: "hidden"
                });
                return
            }
            this.clear_bg();
            this.update_link();
            this.update_particles();
            return requestAnimationFrame(this.animate)
        };
        Sphere.prototype.is_canvas_supported = function() {
            var elem;
            elem = document.createElement("canvas");
            return !!elem.getContext("2d")
        };
        Sphere.prototype.init_effect_control = function() {
            var $effect_toggle;
            $effect_toggle = jQuery(".effect_toggle");
            if (this.get_cookie("sphere_effect_on") === void 0 || this.get_cookie("sphere_effect_on") === "true") {
                this.effect_on = true;
                $effect_toggle.attr("checked", true)
            } else {
                this.effect_on = false;
                $effect_toggle.removeAttr("checked")
            }
            return $effect_toggle.click(function(_this) {
                return function() {
                    _this.effect_on = !_this.effect_on;
                    _this.set_cookie("sphere_effect_on", _this.effect_on, 24 * 3600 * 30);
                    if (_this.effect_on) {
                        return _this.animate()
                    }
                }
            }(this))
        };
        Sphere.prototype.init_canvas = function() {
            window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
                return window.setTimeout(callback, 1e3 / 60)
            };
            if(this.canvas) {
                this.$canvas = jQuery(this.canvas).css({
                    position: 'absolute',
                    'z-index': 10,
                    top: 0,
                    'pointer-events': 'none',
                    left: 0
                })
            } else {
                this.$canvas = jQuery('<canvas style="position: fixed; z-index: -10000; top: 0; left:0;"></canvas>');
                jQuery("body").prepend(this.$canvas);
                this.canvas = this.$canvas[0];
            }
            this.context = this.canvas.getContext("2d")
        };
        Sphere.prototype.init_size = function() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            return this.canvas.height = this.height
            // this.width = $(this.canvas).width();
            // this.height = $(this.canvas).height();
        };
        Sphere.prototype.init_mouse_event = function() {
            var $document;
            this.mouse = {
                x: Infinity,
                y: Infinity
            };
            $document = jQuery(document);
            $document.mousemove(function(_this) {
                return function(e) {
                    _this.mouse.x = e.clientX;
                    _this.mouse.y = e.clientY;
                    _this.mouse.sx = e.pageX;
                    return _this.mouse.sy = e.pageY
                }
            }(this));
            return $document.mouseleave(function(_this) {
                return function() {
                    _this.mouse.x = Infinity;
                    return _this.mouse.y = Infinity
                }
            }(this))
        };
        Sphere.prototype.init_particles = function() {
            var count, i, p, r, v_max, _i;
            this.particles = [];
            this.particle_pairs = [];
            count = this.width * this.height * (this.density / Math.pow(1e3, 2));
            r = 3;
            v_max = .3;
            for (i = _i = 0; 0 <= count ? _i <= count : _i >= count; i = 0 <= count ? ++_i : --_i) {
                p = new Particle(this, this.random(r, this.width - r), this.random(r, this.height - r), this.random(-v_max, v_max), this.random(-v_max, v_max), {
                    h: this.random(0, 360),
                    s: 30,
                    // l: 20,
                    l: 100,
                    o: 1
                // }, this.random(1, 3), ys.words[i < ys.words.length ? i : 0]);
                }, this.random(1, 3), '');
                this.particles.push(p)
            }
            this.combinate(this.particles, 2, function(_this) {
                return function(c) {
                    return _this.particle_pairs.push([c[0], c[1]])
                }
            }(this));
            return console.log("" + count + " particles created.")
        };
        Sphere.prototype.init_label = function() {
            this.$label = jQuery("<div></div>").css({
                fontSize: "12px",
                lineHeight: "150%",
                color: "#777",
                maxWidth: "400px",
                visibility: "hidden",
                opacity: .9,
                background: "#fff",
                borderRadius: "3px",
                position: "absolute"
            });
            return this.$canvas.after(this.$label)
        };
        Sphere.prototype.clear_bg = function() {
            this.context.fillStyle = this.hsla_str(this.background_color);
            // return this.context.fillRect(0, 0, this.width, this.height)
            return this.context.clearRect(0, 0, this.width, this.height)
        };
        Sphere.prototype.update_particles = function() {
            var d, is_text, p, _i, _len, _ref;
            is_text = false;
            _ref = this.particles;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                p = _ref[_i];
                d = this.distance(p, this.mouse);
                p.move(d);
                p.draw(d);
                if (p.is_text) {
                    is_text = true
                }
            }
            if (!is_text) {
                return this.$label.css({
                    visibility: "hidden"
                })
            }
        };
        Sphere.prototype.update_link = function() {
            var ctx, d, pairs, _i, _len, _ref, _results;
            ctx = this.context;
            _ref = this.particle_pairs;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                pairs = _ref[_i];
                d = this.distance(pairs[0], pairs[1]);
                if (d < this.link_threshold) {
                    this.link_color = pairs[0].color;
                    this.link_color.a = (1 - d / this.link_threshold) * .2;
                    ctx.beginPath();
                    ctx.strokeStyle = this.hsla_str(this.link_color);
                    ctx.lineWidth = 1;
                    ctx.moveTo(pairs[0].x, pairs[0].y);
                    ctx.lineTo(pairs[1].x, pairs[1].y);
                    _results.push(ctx.stroke())
                } else {
                    _results.push(void 0)
                }
            }
            return _results
        };
        Sphere.prototype.hsla_str = function(c) {
            return "hsla(" + c.h + ", " + c.s + "%, " + c.l + "%, " + c.a + ")"
        };
        Sphere.prototype.distance = function(p0, p1) {
            var d, dx, dy;
            dx = p0.x - p1.x;
            dy = p0.y - p1.y;
            d = Math.sqrt(dx * dx + dy * dy);
            if (d === NaN) {
                return 0
            } else {
                return d
            }
        };
        Sphere.prototype.random = function(min, max, is_int) {
            if (min == null) {
                min = 0
            }
            if (max == null) {
                max = 1
            }
            if (is_int == null) {
                is_int = false
            }
            if (is_int) {
                return Math.round(Math.random() * (max - min) + min)
            } else {
                return Math.random() * (max - min) + min
            }
        };
        Sphere.prototype.combinate = function(numArr, choose, callback) {
            var n = numArr.length;
            var c = [];
            var inner = function(start, choose_) {
                if (choose_ == 0) {
                    callback(c)
                } else {
                    for (var i = start; i <= n - choose_; ++i) {
                        c.push(numArr[i]);
                        inner(i + 1, choose_ - 1);
                        c.pop()
                    }
                }
            };
            inner(0, choose)
        };
        Sphere.prototype.set_cookie = function(name, value, duration) {
            var date = new Date;
            if (duration === undefined) duration = 0;
            date.setTime(date.getTime() + duration * 1e3);
            document.cookie = name + "=" + escape(value) + ";expires=" + date.toGMTString()
        };
        Sphere.prototype.get_cookie = function(name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr !== null) return unescape(arr[2]);
            else return
        };
        return Sphere
    }();
    Particle = function() {
        function Particle(sphere, x, y, vx, vy, color, radius, quote) {
            this.sphere = sphere;
            this.x = x != null ? x : 0;
            this.y = y != null ? y : 0;
            this.vx = vx != null ? vx : 1;
            this.vy = vy != null ? vy : 1;
            this.color = color != null ? color : {
                h: 255,
                s: 255,
                l: 255,
                o: 1
            };
            this.radius = radius != null ? radius : 3;
            this.quote = quote != null ? quote : ""
        }
        Particle.prototype.move = function(distance) {
            this.make_sure_in_boundary();
            if (distance > 30) {
                this.x += this.vx;
                return this.y += this.vy
            }
        };
        Particle.prototype.draw = function(distance) {
            var r;
            this.is_text = false;
            this.color.a = .2;
            this.draw_circle(this.x, this.y, this.radius, this.color);
            if (distance < 30) {
                this.color.a = .1;
                r = this.radius * 4;
                this.draw_text(this.quote);
                this.is_text = true
            } else {
                this.color.a = .15;
                r = this.radius * 3
            }
            return this.draw_circle(this.x, this.y, r, this.color)
        };
        Particle.prototype.make_sure_in_boundary = function() {
            if (this.x + this.radius > this.sphere.width || this.x - this.radius < 0) {
                this.vx = -this.vx
            }
            if (this.y + this.radius > this.sphere.height || this.y - this.radius < 0) {
                return this.vy = -this.vy
            }
        };
        Particle.prototype.draw_circle = function(x, y, r, color) {
            var ctx;
            ctx = this.sphere.context;
            ctx.fillStyle = this.sphere.hsla_str(color);
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            return ctx.fill()
        };
        Particle.prototype.draw_text = function(text, x, y) {
            var lb, pos, w;
            if (x == null) {
                x = this.sphere.mouse.sx + 20
            }
            if (y == null) {
                y = this.sphere.mouse.sy + 10
            }
            lb = this.sphere.$label;
            pos = lb.offset();
            if (Math.abs(pos.left - x) < 1 || Math.abs(pos.top - y) < 1) {
                return
            }
            w = lb.width();
            if (w + x > this.sphere.width) {
                x -= w + 20
            }
            lb.offset({
                left: x,
                top: y
            }).html(this.quote);
            return lb.css({
                visibility: "visible"
            })
        };
        return Particle
    }();
    // jQuery.getJSON("http://ysmood.org:7013/words80", function(words) {
    //     var sphere;
    //     window.ys = {};
    //     // ys.words = words.map(function(el) {
    //     //     return el.replace("\n", "<br>")
    //     // });
    //     sphere = new Sphere;
    //     sphere.animate();
    //     return ys.sphere = sphere
    // })

    var sphere;
        window.mfe = {};
        // ys.words = words.map(function(el) {
        //     return el.replace("\n", "<br>")
        // });
        sphere = new Sphere(document.querySelector('#sphere-bg'));
        sphere.animate();
        return mfe.sphere = sphere

}).call(this);