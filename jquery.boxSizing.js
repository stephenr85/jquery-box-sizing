/**
 * jQuery.boxSizing
 * http://github.com/stephenr85/jquery-box-sizing
 * @author Stephen Rushing, eSiteful
**/
(function($, undefined){
	
	$.support.boxSizing = ('boxSizing' in document.createElement('div').style) && (document.documentMode === undefined || document.documentMode > 7);	
	
	$.fn.boxSizing = function(){
		
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
				var val = $el.get(0).currentStyle[property] || '',
					fontSize = Number(($el.get(0).currentStyle['fontSize'] || '').replace('px'));				
				if(val && /px/.test(val)){
					val = Number(val.replace('px', ''));	
				}else if(val && /em/.test(val)){
					val = val.replace('em', '') * fontSize;
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