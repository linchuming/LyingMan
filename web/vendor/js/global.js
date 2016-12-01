$(document).ready(function() {
	var width = document.documentElement.clientWidth;
	var height =  document.documentElement.clientHeight;
	if (width < height) {
		//console.log(width + " " + height);
		$screen = $('#screen');
		$screen.width(height);
		$screen.height(width);
		$screen.css('top',  (height-width)/2 );
		$screen.css('left',  0-(height-width)/2 );
		$screen.css('transform' , 'rotate(0deg)');
		$screen.css('transform-origin' , '50% 50%');
	}

	var event = "onorientationchange" in window ? "orientationchange" : "resize";
	window.addEventListener(event, function() {
		//console.log(event);
		var width = document.documentElement.clientWidth;
		var height =  document.documentElement.clientHeight;
		$screen =  $('#screen');
		if (width > height) {
			$screen.width(width);
			$screen.height(height);
			$screen.css('top',  0 );
			$screen.css('left',  0 );
			$screen.css('transform', 'none');
			$screen.css('transform-origin', '50% 50%');
		} else {
			$screen.width(height);
			$screen.height(width);
			$screen.css('top',  (height-width)/2 );
			$screen.css('left',  0-(height-width)/2 );
			$screen.css('transform', 'rotate(90deg)');
			$screen.css('transform-origin', '50% 50%');
		}
	}, false);
});