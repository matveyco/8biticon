(function ($) {
	"use strict";

	$.fn.pixel = function (option) {
		if (typeof option === 'string') {
			switch (option) {
			case 'selected':
				return this.data('selected')[ this.data('selected_group') ];
			case 'group':
				return this.data('selected_group');
			case 'destroy':
				this.data('selected', null)
					.off('.pixel');

				break;
			}

			return this;
		}

		var options = $.extend({}, $.fn.pixel.defaults, typeof option == 'object' && option);

		return this.each(function () {
			var self = this,
				$this = $(this),
				hash_layers = {},
				selected_group = null,
				groups = $this.find('.groups'),
				tabs = $this.find('.tabs'),
				tab = tabs.find('.tab').remove(),
				carousel = $this.find('.carousel'), // whole carousel thing
				carousel_in = carousel.find('.carousel-inner'), // place of items to rotate
				carousel_item = carousel_in.find('.item') // item in the carousel
					.removeClass('item').remove(),
				layers = $this.find('.layers'), //defining html elements
				layer = layers.find('.layer').remove(),
				layer_tab = layer.find('.tab').remove(),
				layer_item = layer.find('.item').remove();

			function openGroup(name) {
				var layers_list = options.json[name],
					v,
					ld;

				// closing currenlty opened layer
				closeLayer();

				// saving for others to use
				selected_group = name;

				// extenal
				$this.data('selected_group', selected_group);

				// reseting hash for layers
				hash_layers = {};
				for (v = layers_list.length; v--;) {
					ld = layers_list[v];
					hash_layers[ld.name] = ld;
				}

				// hiding everything from other groups
				// show anything within current group
				layers.find('.layer')
					.add(tabs.find('.tab'))
					.add(carousel.find('.layer-item, .item'))
					.addClass('hidden-group')
					.filter('.group-' + name).removeClass('hidden-group');

				// marking link
				groups.find('.group-control').removeClass('active')
					.filter('[data-group=' + name + ']').addClass('active');

				// open first layer from this group
				openLayer(layers_list[ layers_list.length - 1 ].name);

				// callback
				options.onGroupSelect.call(self, name);
			}

			function markLayerActive (name) {
				layers.find('.layer.group-' + selected_group).removeClass('active')
					.filter('.layer-' + name).addClass('active');

				if (tabs.length) {
					tabs.find('.tab.group-' + selected_group).removeClass('active')
						.filter('.tab-' + name).addClass('active');
				}

				var layer = hash_layers[name],
					layer_name = $this.find('.layer-name'),
					layer_next = $this.find('.layer-name-next'),
					layer_prev = $this.find('.layer-name-prev');

				layer_name.text(layer.title);
				layer_next.text(layer.next && layer.next.title);
				layer_prev.text(layer.prev && layer.prev.title);

				$this
					.toggleClass('has-next', !!layer.next)
					.toggleClass('has-prev', !!layer.prev);
			}

			function markItemActive (name, index) {
				layers.find('.layer-' + name + '.group-' + selected_group)
					.find('.item').removeClass('active')
					.eq(index).addClass('active');

				// mark selected at our storage
				// warn: counting from 1
				options.selected[selected_group][name] = hash_layers[name].count - index;
			}

			function markCarouselItemActive (name, index) {
				var cname = isLayerOpened(name) ? 'active' : 'layer-active';

				carousel_in.find('.layer-item-' + name + '.group-' + selected_group).removeClass(cname)
					.eq(index).addClass(cname);
			}

			function openLayer (name) {
				if (isLayerOpened(name)) {
					return;
				}

				carousel_in
					.find('.item.group-' + selected_group + ', .layer-item.layer-item-' + name + '.group-' + selected_group)
					.toggleClass('layer-item item')
					.filter('.active, .layer-active')
					.toggleClass('active layer-active');

				var items = carousel_in.find('.item.group-' + selected_group);

				if (!items.filter('.active').length) {
					items.first().addClass('active');
				}

				carousel.data('carousel', null)
					.carousel({ interval: false });

				markLayerActive(name);

				options.onLayerSelect.call(self, name);
			}

			function closeLayer () {
				carousel_in
					.find('.item')
					.toggleClass('layer-item item')
					.filter('.active')
					.toggleClass('active layer-active');

				layers.find('.layer.active')
					.add(tabs.find('.tab.active'))
					.removeClass('active');
			}

			function isLayerOpened (name) {
				return layers.find('.layer-' + name + '.group-' + selected_group).hasClass('active');
			}

			function initConstructor () {
				var /* group name */ group,
				/* layers list */ layers_list,
				/* layer index */ v,
				/* layer clone */ cl,
				/* layer object */ ld,
				/* previous layer */ p,
				/* item index */ i,
				/* carousel item clone */ icl,
				/* item clone */ il,
				/* item image */ im,
				/* tab clone */ ct,
				/* selected index */ sel,
				/* layers' zIndex */ zIndex = options.zIndex;


				var /* if true, use .find+.text, .text otherwise */ par_tab_text = tab.find('.tab-text').length;

				// random
				if (options.selected === true) {
					options.selected = {};

					for (group in options.json) {
						// don't iterate over inherited or smth
						if (!options.json.hasOwnProperty(group)) {
							continue;
						}

						layers_list = options.json[group];

						options.selected[group] = {};

						for (v = layers_list.length; v--;) {
							ld = layers_list[v];

							if (ld.skeleton) {
								continue;
							}

							options.selected[group][ld.name] = Math.floor(ld.count * Math.random()) + 1;
						}
					}
				}

				// linking object to elements' data
				$this.data('selected', options.selected);

				// filling up all the things
				for (group in options.json) {
					// don't iterate over inherited or smth
					if (!options.json.hasOwnProperty(group)) {
						continue;
					}

					layers_list = options.json[group];

					// do not interlink groups
					p = null;

					for (v = layers_list.length; v--;) {
						ld = layers_list[v];

						zIndex++;

						if (ld.skeleton) {
							// carousel item clone
							icl = carousel_item.clone()
								.addClass('layer-item layer-active layer-item-' + ld.name + ' group-' + group)
								.css('zIndex', ld.zIndex || zIndex);

							// image
							im = $('<img />').attr('src', options.images + group + '/' + ld.name + options.ext);

							// append to carousel
							carousel_in.append(icl.html(im));
						} else {
							// filling hash withh all layers
//							hash_layers[ld.name] = ld;

							// all the linking things
							if (p) {
								ld.prev = p;
								p.next = ld;
							}

							p = ld;

							// sets selected item
							sel = (group in options.selected) &&
								(ld.name in options.selected[group]) ? options.selected[group][ld.name] : -1;

							// cloning layer element
							cl = layer.clone().data({
								name: ld.name
							}).addClass('layer layer-' + ld.name + ' group-' + group);

							// cloning layers' tab element
							if (layer_tab.length) {
								cl.append(layer_tab.clone().text(ld.title));
							}

							// cloning tab element
							if (tab.length) {
								ct = tab.clone().data({
									layer: ld.name
								}).addClass('tab-' + ld.name + ' group-' + group);

								if (par_tab_text) {
									ct.find('.tab-text').text(ld.title);
								}
								else {
									ct.text(ld.title);
								}

								tabs.append(ct);
							}

							// generating items
							for (i = ld.count; i; i--) {
								// item clone
								il = layer_item.clone().data('index', i);

								// carousel item clone
								icl = carousel_item.clone()
									.addClass('layer-item layer-item-' + ld.name + ' group-' + group)
									.data('layer', ld.name)
									.css('zIndex', ld.zIndex || zIndex);

								if (sel == i) {
									il.addClass('active');
									icl.addClass('layer-active');
								}

								// image
								im = $('<img />').attr('src', options.images + group + '/' + ld.name + i + options.ext);

								// append to layer
								cl.append(il.append(im));

								// append to carousel
								carousel_in.append(icl.html(im.clone()));
							}

							// append layer to layers' element
							layers.append(cl);
						}
					}
				}

				carousel_in.append($('<div class="mask" />').css('zIndex', ++zIndex));

				$this
					.on('click.pixel', '.layers .item',
					function (e) {
						var target = $(e.currentTarget),
							layer = target.closest('.layer'),
							name = layer.data('name'),
							index = layer.find('.item').index(target);

						openLayer(name);
						carousel.carousel(index);
					})
					.on('click.pixel', '.layers .tab',
					function (e) {
						var target = $(e.currentTarget),
							layer = target.closest('.layer'),
							name = layer.data('name');

						openLayer(name);
					})
					.on('click.pixel', '.tabs .tab',
					function (e) {
						var target = $(e.currentTarget),
							name = target.data('layer');

						openLayer(name);
					})
					.on('slid.pixel',
					function (e) {
						var items = carousel_in.find('.item.group-' + selected_group),
							active = items.filter('.active'),
							name = active.data('layer');

						markLayerActive(name);
						markItemActive(name, items.index(active));
					})
					.on('click.pixel', '.layer-control',
					function (e) {
						var target = $(e.currentTarget),
							active = layers.find('.layer.active'),
							type = target.data('direction'),
							next = active[type]('.layer.group-' + selected_group),
							fallback = type == 'next' ? 'first' : 'last';

						if (!next.length) {
							next = layers.find('.layer.group-' + selected_group)[fallback]();
						}

						openLayer(next.data('name'));
					})
					.on('click.pixel', '.item-control',
					function (e) {
						var target = $(e.currentTarget);

						carousel.carousel(target.data('direction'));
					})
					.on('click.pixel', '.group-control',
					function (e) {
						var target = $(e.currentTarget);

						openGroup(target.data('group'));
					})
					.on('click.pixel', '.layers-regenerate',
					function (e) {
						var layer, index;

						// find out
						var opened;
						for (layer in hash_layers) {
							if (isLayerOpened(layer)) {
								opened = layer;
								break;
							}
						}

						for (layer in hash_layers) {
							index = Math.floor(hash_layers[layer].count * Math.random());

							markItemActive(layer, index);
							markCarouselItemActive(layer, index);
						}

						openLayer(opened);
					})
					.on('click.pixel', '.layer-regenerate',
					function () {
						// regenerate selected for currently active layer
					});
			}

			$.get(options.json, function (groups) {
				options.json = groups;

				initConstructor();

				$this.waitForImages(function () {
					options.onLoaded.call(self, groups);

					if (options.startup.group in options.json) {
						openGroup(options.startup.group);
					}

					if (options.startup.layer in hash_layers) {
						openLayer(options.startup.layer);
					}
				}, options.onLoading);
			}, 'json');
		});
	};

	$.fn.pixel.defaults = {
		json: null,
		images: null,
		selected: {},
		ext: '.png',
		zIndex: 1,
		onLoaded: $.noop,
		onLoading: $.noop,
		onGroupSelect: $.noop,
		onLayerSelect: $.noop
	};

})(jQuery);