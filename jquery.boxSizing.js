
(function($, undefined){
	var testStyle = document.createElement('div').style;
	$.support.boxSizing = (('boxSizing' in testStyle) || ('MozBoxSizing' in testStyle)) && (document.documentMode === undefined || document.documentMode > 7);	

	/**
	 * jQuery.emPx - Get the px value of an em unit in a certain context. Only relevant for IE, or browsers without getComputedStyle().
	 * http://github.com/stephenr85/jquery-box-sizing
	 * @author Stephen Rushing, eSiteful
	**/
	$.fn.emPx = function(){
		var $scope = $(this).first(),
			unit, px, size, adjust;
		while($scope.length){
			size = $scope.css('font-size') || '';
			unit = size.match(/px|em|%/)[0];
			size = size.replace(/px|em|%/, '') * 1;
			
			if(unit === '%'){
				adjust = adjust * (size / 100);	
			}else if(unit === 'em'){
				adjust = adjust * size;
			}else if(unit === 'px'){
				break;	
			}
			//check the parent
			$scope = $scope.parent();	
		}
		console.log(px + " " + (adjust) +" "+ (px * adjust));
		px = px * adjust;
		
		return px;
	};
	
	
	/**
	 * jQuery.boxSizing
	 * http://github.com/stephenr85/jquery-box-sizing
	 * @author Stephen Rushing, eSiteful
	**/
	$.fn.boxSizing = function(){
		
		if($.support.boxSizing) return; //bail
		
		var I = this,
			deferred = $.Deferred();	
			
		if($.support.boxSizing){
			deferred.resolveWith(I);
			return deferred;	
		}
		
		var size = function(el){
			var $el = $(el),
				singleDeferred = $.Deferred(),
				styles = {},
				origStyles = {};
				
			$.each(['width', 'minWidth', 'maxWidth', 'height', 'minHeight', 'maxHeight'], function(i, property){
				var val = $el.get(0).currentStyle[property] || '';	
				if(val && /px/.test(val)){
					val = Number(val.replace('px', ''));	
				}else if(val && /em/.test(val)){
					val = val.replace('em', '') * $el.emPx();
				}else if(val && /%/.test(val)){
					val = $el.parent()[/width/i.test(property) ? 'width' : 'height']() * (val.replace('%','') / 100);	
				}
				styles[property] = typeof val === 'number' ? val : null;
				//origStyles[property] = Number(($el.get(0).style[property] || '').replace(/\D/g, ''));
			});
			
			var width = $el.width(),
				outerWidth = $el.outerWidth();
			
			if(styles.minWidth && outerWidth < styles.minWidth){
				//console.log('minWidth');
				$el.css('width', styles.minWidth);	
			}else if(styles.maxWidth && outerWidth > styles.maxWidth){
				//console.log('maxWidth');
				$el.css('width', styles.maxWidth);	
			}else if(styles.width && width != outerWidth){
				//console.log('width');
				$el.css('width', width - (outerWidth - width));	
			}
			
			setTimeout(function(){
				var height = $el.height(),
					outerHeight = $el.outerHeight();
				
				if(styles.minHeight && outerHeight < styles.minHeight){
					$el.css('height', styles.minHeight);	
					
				}else if(styles.maxHeight && outerHeight > styles.maxHeight){
					$el.css('height', styles.maxHeight);	
					
				}else if(styles.height && height != outerHeight){
					$el.css('height', height - (outerHeight - height));	
					
				}
				
				//Deferred progress
				deferred.notifyWith(I, $el, styles, {
					width: width,
					outerWidth: outerWidth,
					height:height, 
					outerHeight: outerHeight,
					final: $el.css('height')					
				});
				
				singleDeferred.resolve();
				
				//Resolve the deferred obj if this is the last element
				if($el.get(0) == I.last().get(0)){
					deferred.resolveWith(I);	
				}
				
			}, 0);
			
			
			$el.data('origStyles', origStyles);	
			
			return singleDeferred;
		};
		
		this.each(function(){
			if(this.nodeName == 'IMG' && !this.complete){
				$(this).on('load', function(){
					deferred.then(size(this));
				});
			}else{
				deferred.then(size(this));
			}
		});
		
		//$(window).on('resize orientationchange load', this.boxSizing);
		return deferred.promise();
	};
	
	$.fn.boxSizing.defaults = {};
	
	
})(jQuery);