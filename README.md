8biticon
========

Pixel art picture generator. Create your own funny profile pics!

How to use?
========

<a href="http://twitter.github.com/bootstrap/index.html">Twitter Bootstrap</a> is required.

However, you can attach only things related to Carousel plugin (these files can be found along with others in 8bit-client directory).

#### Attention
You will need patched version of bootsrap-carousel.js.
You can find patched version in 8bit-client/js/ or use 8bit-client/js/bootstrap-carousel.patch file to create your own.

```html
<link type="text/css" href="8bit-client/css/8biticon.css" rel="stylesheet" />
<script src="8bit-client/js/bootstrap-carousel.patched.js"></script>
```

```html
<link type="text/css" href="8bit-client/css/8biticon.css" rel="stylesheet" />

<script src="8bit-client/js/waitForImages.js"></script>
<script src="8bit-client/js/8biticon.js"></script>
```

### Tabs
```html
<div class="tabs"> <!-- .tabs will contain the list of generated .tab elements -->
  <div class="tab">
    <span class="tab-text"></span> <!-- .tab-text may be ommited, in that case layer name will be written directly to .tab -->
  </div>
</div>
```

### Groups
```html
<a href="javascript://" class="group-control" data-group="myGroup">Group Name</a> <!-- [data-group] contains the name of any group
```
To change the group user must emmit "click" event on one of .group-control elements.
No generations for group lists is supported now. 

### Navigation links
```html
<!-- [data-direction] contains either "prev" or "next" -->
<a href="javascript://" class="layer-control" data-direction="prev">Go back</a> 
<a href="javascript://" class="layer-control" data-direction="prev">Go ahead</a>
```

### Generate random picture link
```html
<a href="javascript://" class="layers-regenerate">Generate random picture</a>
```
Regeneration will pick random item from the every layer of the current group.

### Avatar viewport
```html
<div class="carousel slide">
	<div class="carousel-inner">
		<div class="item"></div>
	</div>
</div>
```

### Layer items list
```html
<div class="layers">
	<div class="layer">
		<div class="item"></div>
	</div>
</div>
```

## Full example
```html
<div id="constructor" class="pixel">
  <div class="tabs">
		<div class="groups"><a href="javascript://" class="group-control" data-group="male"><img src="/static/img/dashboard/male.png" /></a> <a href="javascript://" class="group-control" data-group="female"><img src="/static/img/dashboard/female.png" /></a></div>

		<div class="tab"><div class="tab-bar"><span class="left"></span><span class="tab-text"></span><span class="right"></span></div></div>
	</div>

	<div class="navigation b">
		<span class="left layer-control" data-direction="prev"><a href="javascript://">Go back</a></span>
		<span class="right layer-control" data-direction="next"><a href="javascript://">Select <span class="layer-name-next"></span></a></span>
	</div>

	<div class="viewport">
		<div class="modal">
			<div class="carousel slide">
				<a href="javascript://" class="layers-regenerate">Generate random picture</a>

				<div class="carousel-inner">
					<div class="item"></div>
				</div>
			</div>
		</div>
		<div class="scrollee">

			<div class="layers">
				<div class="layer">
					<div class="item"><span></span></div>
				</div>
			</div>

		</div>
	</div>
</div>
```
