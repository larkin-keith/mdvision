$(document).ready(function() {

	// SyntaxHighlighter.all();
	$('.flexslider').flexslider({
		animation: "slide",
		start: function(slider){
			$('body').removeClass('loading');
		}
	});

	$(".scroll").click(function(event){		
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top},1000);
	});

	$('.gallery-bottom a').Chocolat();

	$("span.menu").click(function(){
		$(" ul.navig").slideToggle("slow" , function(){});
	});
	/*
	var defaults = {
		containerID: 'toTop', // fading element id
		containerHoverID: 'toTopHover', // fading element hover id
		scrollSpeed: 1200,
		easingType: 'linear' 
		};
	*/
	
	$().UItoTop({ easingType: 'easeOutQuart' });
});