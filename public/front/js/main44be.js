
$(function() {
	
	$('a[href^="http"]').attr('target','_blank');
	$('a.same-window').attr('target','_self');
	
	var cw = $('#slider').width()*35.83333333333333/100;
	$('#slider').css({'height':cw+'px'});
		
	if (window.matchMedia('(min-width: 991px)').matches) {
		$('[data-toggle="tooltip"]').tooltip();
	}
	
	$('.gallery .thumb a').magnificPopup({ 
	  type : 'image',
	  gallery : {
		enabled:true
	  },
	  image: {
		titleSrc: 'data-title'
	  }
	});
	
	$('#callout-carousel').carousel({
	  interval: 10000
	});
	
	$('div.schedule .scroller-wrap').hover(function(){
		$('.scroller-wrap .overlay a').fadeIn();
		$('div.schedule h3 span').html('Live Streaming');
	}, function(){
		$('.scroller-wrap .overlay a').hide();
		$('div.schedule h3 span').html('Now Showing');
	});
	
	$.get(siteRoot+'ajax.php', { menu: 'email', address: 'email' }, function(data){ $('#e1').html(data).fadeIn('slow'); });
	$.get(siteRoot+'ajax.php', { menu: 'email', address: 'form_email_prayer' }, function(data){ $('#e2').html(data).fadeIn('slow'); });
	$.get(siteRoot+'ajax.php', { menu: 'email', address: 'form_email_partnership' }, function(data){ $('#e3').html(data).fadeIn('slow'); });
	$.get(siteRoot+'ajax.php', { menu: 'email', address: 'email' }, function(data){ $('#e4').html(data).fadeIn('slow'); });
	
	$('a.pop').magnificPopup({ 
		type: 'image',
		gallery:{enabled:true},
		mainClass: 'mfp-with-zoom',
		zoom: {
			enabled: true,
			duration: 300,
			easing: 'ease-in-out'
		}
	});
	
});


$(document).ready(function() {
	
	$.cookieCuttr();
	
	$('.top-five li').addClass("hideit").viewportChecker({
		classToAdd: 'showit animated bounceInUp',
		offset: 50
	});
	
	$('.twitter .tweet').addClass("hideit").viewportChecker({
		classToAdd: 'showit animated bounceInUp',
		offset: 50
	});
	
	$('.cover .overlay').addClass("hideit").viewportChecker({
		classToAdd: 'showit animated pulse',
		offset: 50
	});
	
	$('.has-overlay .overlay').addClass("hideit").viewportChecker({
		classToAdd: 'showit animated pulse',
		offset: 50
	});
	
	$('.event-thumbs a').addClass("hideit").viewportChecker({
		classToAdd: 'showit animated fadeIn',
		offset: 50
	});
	
	$('.row .testimony').addClass("hideit").viewportChecker({
		classToAdd: 'showit animated fadeIn',
		offset: 50
	});
	
});


equalheight = function(container){

var currentTallest = 0,
     currentRowStart = 0,
     rowDivs = new Array(),
     $el,
     topPosition = 0;
 $(container).each(function() {

   $el = $(this);
   $($el).height('auto')
   topPostion = $el.position().top;

   if (currentRowStart != topPostion) {
     for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
       rowDivs[currentDiv].height(currentTallest);
     }
     rowDivs.length = 0; // empty the array
     currentRowStart = topPostion;
     currentTallest = $el.height();
     rowDivs.push($el);
   } else {
     rowDivs.push($el);
     currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
  }
   for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
     rowDivs[currentDiv].height(currentTallest);
   }
 });
}

$(window).load(function() {
	if (window.matchMedia("(min-width: 992px)").matches) {
  		equalheight('.sponsorTBN .side-block');
	}
});


$(window).resize(function(){
	if (window.matchMedia("(min-width: 992px)").matches) {
  		equalheight('.sponsorTBN .side-block');
	}
});


// Homepage Slider
// Load Flexslider
// See options here: http://www.woothemes.com/flexslider/
$(window).load(function() { // after images loaded

	// Enable or disable automatic slideshow based on theme options
	var enable_slideshow = true;

	// If only one slide, add a second slide; otherwise slider will not initialize and video will not work properly (controls will be hidden after initialization)
	var single_slide = false;
	if ($('.flexslider ul li').length == 1) {
		single_slide = true;
		enable_slideshow = false; // disable because only one slide (don't show hidden slide)
		$('.flexslider ul').append('<li></li>');
	}

	// Initialize slider
	$('.flexslider').flexslider({
		slideshow: enable_slideshow,					// Boolean: Animate slider slideshow
		slideshowSpeed: 10000,			// Integer: Set the speed of the slideshow cycling, in milliseconds
		directionNav: false,							// Boolean: Create navigation for previous/next navigation? (true/false)
		start: function(slider) { // when first slide loads

			// Hide controls if only one slide (see "if only only slide" above)
			if (single_slide) {
				$('.flex-control-nav').hide();
			}
			
			// Hover to lower opacity and fade in play button
			var fade_speed = fade_duration(350);
			var fade_opacity = 0.6;
			if (!Modernizr.touch) { // not for mobile devices that cannot hover
				$('.flex-video-slide')
					.hover(function() { // hover in
					
						// fade image and caption out, play button in
						if ($('.flex-image-container', this).is(':visible')) { // don't fade if it was hidden during video playback							
							$('.flex-image-container img, .flex-caption', this).stop().fadeTo(fade_speed, fade_opacity);
							$('.flex-play-overlay', this).stop().fadeIn();									
						}
						

						// fade caption in on hover and return to faded out on mouse out
						$('a.flex-caption', this) // only if it's linked somewhere other than video source
							.hover(function() { // hover in							
								$(this).stop().fadeTo(fade_speed, 1);
							}, function() { // hover out									
								$(this).stop().fadeTo(fade_speed, fade_opacity);
							});								
						
					}, function() { // hover out
					
						// fade image and caption back in, play button out
						if ($('.flex-image-container', this).is(':visible')) { // don't fade if it was hidden during video playback
							$('.flex-image-container img, .flex-caption', this).stop().fadeTo(fade_speed, 1);									
							$('.flex-play-overlay', this).stop().fadeOut();									
						}									

					});
			} else { // for mobile touch devices always show "Play" overlay since cannot hover
				$('.flex-play-overlay').stop().fadeTo(0, fade_opacity);	
			}

			// Play video slide on click (regular)
			$('.flex-play-overlay').click(function(event) { // clicked image of video slide in order to play video
				
				event.preventDefault();
				
				var slide_element = $(this).parents('.flex-video-slide');
				var slide_id = slide_element.attr('id');
				var video_url = $(this).parent('a').attr('href');
				var video_html = '';

				// Vimeo
				if (video_url.indexOf('vimeo') > -1) {
					
					// Extract video ID from Vimeo URL and build HTML for player
					var match = video_url.match(/\d+/);
					if (match && match[0].length) {
						var vimeo_id = match[0];			
						var video_html = '<iframe src="https://player.vimeo.com/video/' + vimeo_id + '?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff&amp;autoplay=1" width="960" height="350" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
					}
						
				}
				
				// YouTube
				else if (video_url.indexOf('youtu') > -1) { // match youtube.com or youtu.be
				
					// Get video ID from YouTube URL and build HTML for player
					// ID extraction from jeffreypriebe, Lasnv, WebDev and Chris Nolet at http://stackoverflow.com/a/8260383
					var match = video_url.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/);
					if (match && match[1].length == 11){
						var youtube_id = match[1];
						var video_html = '<iframe src="https://www.youtube.com/embed/' + youtube_id + '?wmode=transparent&amp;autoplay=1&amp;rel=0&amp;showinfo=0&amp;color=white&amp;modestbranding=1" width="960" height="350" frameborder="0" allowfullscreen></iframe>';					
					}

				}
				
				// Show the video
				if (video_html) {
				
					// Pause slideshow
					slider.pause();
				
					// Hide slide image (contains "play" overlay) and caption
					$('.flex-image-container, .flex-caption', slide_element).hide();
					
					// Inject the video iframe
					$(slide_element).append(video_html);

				}
				
			});
		
		},
		before: function() { // Before slide changes

			// Destroy all video iframes
			$('.flex-video-slide iframe').remove();
			
			// Show image and caption again, make sure faded to 100% as well
			$('.flex-image-container, .flex-image-container img, .flex-caption').show().fadeTo(0, 1); // may be partially faded out from hover on video slide
			
			// Hide play button overlay
			if (!Modernizr.touch) { // except if we're using movile touch - no hover so want "play" overlay to show for clicking
				$('.flex-play-overlay').hide();
			}

		}
	});
	
});


// Old Versions Internet Explorer
var ie = false;
var old_ie = false;
var bad_ie = false;


// No fade effect for IE8 -  things get ugly
function fade_duration(duration) {

	if (!duration) {
		duration = 'fast';
	}

	if (old_ie) {
		duration = 0;
	}

	return duration;
	
}
