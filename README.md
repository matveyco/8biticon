8biticon
========

Pixel art picture generator. Create your own funny profile pics!

### Tabs
```html
<div class="tabs">
  <div class="tab">
    <span class="tab-text"></span> <!-- .tab-text may be ommited, in that case layer name will be written directly to .tab -->
  </div>
</div>
```

### Groups
```html
<a href="javascript://" class="group-control" data-group="myGroup">Group Name</a> <!-- [data-group] contains the name of any group
```
To change group 

### Navigation links
```html
<a href="javascript://" class="layer-control" data-direction="prev">Go back</a> <!-- [data-direction] contains either "prev" or "next" -->
```

### Generate random picture link
```html
<a href="javascript://" class="layers-regenerate">Generate random picture</a>
```

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
		<div class="item"><span></span></div>
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
