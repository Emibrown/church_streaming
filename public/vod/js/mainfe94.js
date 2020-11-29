
$(function() {
	
	$('div#Main').css({'min-height': ($(window).height()-150)});
	
	$('.fsPlayer--controls .highlight-access, .fsPlayer--controls .ctrl-3-x').click(function(e) {
		e.preventDefault();
		$(this).parent().find('p').addClass('active');
	});
	
	$('.toggle-account-panel').click(function(e) {
		e.preventDefault();
		if (!$('#UserPanel').is(':visible')) {
			$('#UserPanel').fadeIn();
		}
	});
	
	$('#UserPanel .closer').click(function() {
		if ($('#UserPanel').is(':visible')) {
			$('#UserPanel').fadeOut();
		}
	});
	
	$('#cb4').on('change', function() {
		var _val = (this.checked?1:0);
		var _uid = $('#apx').data('uid');
		
		$.get(siteRoot+'ajax.php', {
			menu: 'doAutoplay', 
			val: _val,
			uid: _uid
		});
	});
	
	$('.controls .button-blank--playlist').click(function(e) {
		e.preventDefault();
		
		var _this = $(this);
		
		var _oid = $(this).data('oid');
		var _cid = $(this).data('cid');
		var _tid = $(this).data('tid');
		var _uid = $(this).data('uid');
		
		var _plx = $(this).data('on');
		
		if (!$(this).hasClass('active')) {
			/* PLAYLIST ADD */
			$.get(siteRoot+'ajax.php', {
				menu: 'doUserAction', 
				oid: _oid, 
				cid: _cid, 
				tid: _tid, 
				uid: _uid, 
				action: 'playlist' 
			}, function(data){
				$(_this).addClass('active');
				$(_this).find('em').removeClass('fa-plus');
				$(_this).find('em').addClass('fa-check');
				$(_this).find('span').html(_plx);
			});
		} else {
			window.location = siteRoot+'watch-later';
		}
	});
	
	$('a.toggle-menu').click(function(e) {
		e.preventDefault();
		if (!$('div.toggle-menu').is(':visible')) {
			$('div.toggle-menu').show();
		} else {
			$('div.toggle-menu').hide();
		}
	});
	
	$('div.toggle-menu span').click(function() {
		$('div.toggle-menu').hide();
	});
	
	$('.fsPlayer--controls .ctrl-1').click(function(e) {
		e.preventDefault();
		var _this = $(this);
		
		var _vid = $(this).data('vid');
		
		var _likes = parseInt($(this).find('span').html());
		if (!$(this).hasClass('active')) {
			/* FAVORITE */
			$.post('/vod/favourite', {
				vid: _vid, 
				action: 'do' 
			}, function(data){
				$(_this).addClass('active');
				$(_this).find('span').html(_likes+1);
				$(_this).find('i').html('favorite');
			});
		} else {
			/* UN-FAVORITE */
			$.post('/vod/favourite', {
				vid: _vid, 
				action: 'undo' 
			}, function(data){
				$(_this).removeClass('active');
				$(_this).find('span').html(_likes-1);
				$(_this).find('i').html('favorite_border');
			});
		}
	});
	
	$('.fsPlayer--controls .ctrl-2').click(function(e) {
		e.preventDefault();
		var _this = $(this);
		
		
		var _vid = $(this).data('vid');
		
		var _plx = $(this).data('on');
		var _plz = $(this).data('off');
		
		if (!$(this).hasClass('active')) {
			/* PLAYLIST ADD */
			$.post('/vod/watch-later', {
				vid: _vid, 
				action: 'do' 
			}, function(data){
				$(_this).addClass('active');
				$(_this).find('i').html('playlist_add_check');
				$(_this).find('span').html(_plx);
			});
		} else {
			/* PLAYLIST REMOVE */
			$.post('/vod/watch-later', {
				vid: _vid, 
				action: 'undo' 
			}, function(data){
				$(_this).removeClass('active');
				$(_this).find('i').html('playlist_add');
				$(_this).find('span').html(_plz);
			});
		}
	});
	
	$('.fsPlayer--controls .ctrl-3').click(function(e) {
		e.preventDefault();
		if (!$('.fsPlayer .playlist-more').is(':visible')) {
			$('.fsPlayer .playlist-more').slideDown();
			$(this).addClass('active');
			initSlider();
		} else {
			$('.fsPlayer .playlist-more').slideUp();
			$(this).removeClass('active');
		}
	});
	
	$('.playlist-open .playlist-content--slider').slick({
		dots: false,
		infinite: true,
		variableWidth: true,
		slidesToShow: 2,
		slidesToScroll: 1,
		centerMode: true
	});
			
	$('.closer').click(function() {
		var _this = $(this);
		var _oid = $(this).data('oid');
		var _cid = $(this).data('cid');
		var _tid = $(this).data('tid');
		var _uid = $(this).data('uid');
		var _action = $(this).data('action');
		
		/* UNDO USER INTERACTION */
		$.get(siteRoot+'ajax.php', {
			menu: 'undoUserAction', 
			oid: _oid, 
			cid: _cid, 
			tid: _tid, 
			uid: _uid, 
			action: _action 
		}, function(data){
			$(_this).find('em').removeClass('fa-close');
			$(_this).find('em').addClass('fa-circle-o-notch fa-spin');
			$($(_this).data('target')).fadeOut('slow');
		});
	});
	
	$('.collection-rm').click(function(e) {
		e.preventDefault();
		
		var _this = $(this);
		var _oid = $(this).data('oid');
		var _cid = $(this).data('cid');
		var _tid = $(this).data('tid');
		var _uid = $(this).data('uid');
		var _action = $(this).data('action');
		
		/* UNDO USER INTERACTION */
		$.get(siteRoot+'ajax.php', {
			menu: 'undoUserAction', 
			oid: _oid, 
			cid: _cid, 
			tid: _tid, 
			uid: _uid, 
			action: _action 
		}, function(data){
			$(_this).find('em').removeClass('fa-close');
			$(_this).find('em').addClass('fa-circle-o-notch fa-spin');
			$($(_this).data('target')).fadeOut('slow');
		});
	});
	
});



function initSlider() {
	
	$('.playlist-hidden .playlist-content--slider').slick({
		dots: false,
		infinite: true,
		variableWidth: true,
		slidesToShow: 2,
		slidesToScroll: 1,
		centerMode: true
	});
	
}

