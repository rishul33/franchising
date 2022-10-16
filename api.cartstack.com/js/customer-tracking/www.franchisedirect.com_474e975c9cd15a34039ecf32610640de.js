var _cartstack = _cartstack || [];
_cartstack.push(['setSiteID', 'k5VbXFdK']); /* required */

var cartstack_cartPageURL = '';
var cartstack_checkoutPageURLs = ['','',''];
var cartstack_successPageURL = '/confirmation';
var cartstack_isconfirmation = 0;
var cartstack_debug = 0;
var cartstack_trackVisitor = 0;

var cartstack_pageurl = window.location.href.toLowerCase();

var cartstack_cartitems_cartRow = "div#lf_requestInformationFormFranchiseContainer div|class=cs_c:leadFormItems";
var cartstack_cartitems_quantity = "";
var cartstack_cartitems_productID = "";
var cartstack_cartitems_productName = "label div";
var cartstack_cartitems_productDesc = "";
var cartstack_cartitems_productURL = "";
var cartstack_cartitems_productURLPrefix = '';
var cartstack_allowEmptyURL = 1;
var cartstack_cartitems_productImageURL = "label div|style";
var cartstack_cartitems_productImageURLPrefix = '';
var cartstack_allowEmptyImageURL = 0;
var cartstack_cartitems_productPrice = "";
var cartstack_cartitems_productImageWidth = "100";
var cartstack_debugCartItems = 0;
var cartstack_cartItems = 0;

var cartstack_cartTotal = '';
var cartstack_dataItems = [];
var cartstack_tracking = 1;

if (cartstack_cartPageURL.length > 0 && cartstack_pageurl.indexOf(cartstack_cartPageURL.toLowerCase()) >= 0)
{
	_cartstack.push(['setAPI', 'tracking']);
	cartstack_cartTotal = '';
	if (cartstack_debug) { console.log('cs: track-cart'); }
}
else if (cartstack_successPageURL.length > 0 && cartstack_pageurl.indexOf(cartstack_successPageURL.toLowerCase()) >= 0)
{
	_cartstack.push(['setAPI', 'confirmation']);
	cartstack_isconfirmation = 1;
	if (cartstack_debug) { console.log('cs: confirmation'); }
}
else
{
	var cartstack_checkoutURLExists = 0;
	for (var i=0; i<cartstack_checkoutPageURLs.length; i++)
	{
		var cartstack_checkoutPageURL = cartstack_checkoutPageURLs[i].toLowerCase();
		if (cartstack_checkoutPageURL.length > 0 && cartstack_pageurl.indexOf(cartstack_checkoutPageURL) >= 0)
		{
			cartstack_checkoutURLExists = 1;
		}
	}

	if (cartstack_checkoutURLExists)
	{
		_cartstack.push(['setAPI', 'tracking']);
		if (cartstack_debug) { console.log('cs: track-checkout'); }
	}
	else
	{
		_cartstack.push(['setAPI', 'capture']);
		if (cartstack_debug) { console.log('cs: capture'); }
	}
}

function cartstack_getTracking()
{
    (function(){
		
		if (typeof cartstack_regex != 'undefined' && typeof cartstack_getCartItems_RealTime != 'undefined' && typeof cartstack_updatecart != 'undefined' && typeof cartstack_livecallback != 'undefined')
		{
			var _emailValue = '';
			var _interval = setInterval(function(){
				
				var _input = document.getElementById('lf_email');
				if (_input && cartstack_regex.test(_input.value))
				{
					clearInterval(_interval);
					
					_emailValue = _input.value;
					
					var _update = [];
					_update.push(['setSiteID', 'k5VbXFdK']);
					_update.push(['setEmail', _emailValue]);
					
					_cartItems = cartstack_getCartItems_RealTime();
					for(var i=0; i<_cartItems.length; i++)
					{
						_cartItems[i][1].productName = _cartItems[i][1].productName.replace(new RegExp("\t", "g"), '').replace(new RegExp("\n", "g"), '').trim();
						
						var _imageURL = "";
						var _imageURLPieces = _cartItems[i][1].productImageURL.split('url(');
						if (_imageURLPieces.length > 1)
						{
							_imageURLPieces = _imageURLPieces[1].split(')');
							_imageURL = _imageURLPieces[0];
							
							_cartItems[i][1].productImageURL = _imageURL;
						}
						
						_update.push(_cartItems[i]);
					}
					cartstack_cartitems_cartRow = "div#lf_requestInformationFormFranchiseContainer div|class=cs_c:leadFormItems";
					
					cartstack_updatecart(_update);
				}
				
			}, 1500);
			
			cartstack_livecallback("blur", "input", "id", "lf_email", function (event) {
				if (cartstack_regex.test(this.value) && _emailValue != this.value)
				{
					_emailValue = this.value;
					
					var _update = [];
					_update.push(['setSiteID', 'k5VbXFdK']);
					_update.push(['setEmail', _emailValue]);
					
					_cartItems = cartstack_getCartItems_RealTime();
					for(var i=0; i<_cartItems.length; i++)
					{
						_cartItems[i][1].productName = _cartItems[i][1].productName.replace(new RegExp("\t", "g"), '').replace(new RegExp("\n", "g"), '').trim();
						
						var _imageURL = "";
						var _imageURLPieces = _cartItems[i][1].productImageURL.split('url(');
						if (_imageURLPieces.length > 1)
						{
							_imageURLPieces = _imageURLPieces[1].split(')');
							_imageURL = _imageURLPieces[0];
							
							_cartItems[i][1].productImageURL = _imageURL;
						}
						
						_update.push(_cartItems[i]);
					}
					cartstack_cartitems_cartRow = "div#lf_requestInformationFormFranchiseContainer div|class=cs_c:leadFormItems";
					
					cartstack_updatecart(_update);
				}
			});
		}
		
	})();
}

//(function(){var y = document.getElementsByTagName('script');var l=1;for(var i=0; i < y.length; i++){if (y[i].src == 'https://api.cartstack.com/js/cartstack_utility.js'){l=0;}}if(l){var s = document.createElement('script');s.type = 'text/javascript';s.async = true;s.src = 'https://api.cartstack.com/js/cartstack_utility.js';var x = document.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);}})();
//(function(){function cartstack_load(){var y = document.getElementsByTagName('script');var l=1;for(var i=0; i < y.length; i++){if (y[i].src == 'https://api.cartstack.com/js/cartstack.js'){l=0;}}if(l){var s = document.createElement('script');s.type = 'text/javascript';s.async = true;s.src = 'https://api.cartstack.com/js/cartstack.js';var x = document.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);}}if(cartstack_isconfirmation){cartstack_load();}else{var _interval=setInterval(function(){if(document.readyState==='complete'){clearInterval(_interval);cartstack_load();}},1000);}})();