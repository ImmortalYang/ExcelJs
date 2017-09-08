import $ from 'jquery';
import Waypoints from '../../../../node_modules/waypoints/lib/noframework.waypoints';
import smoothScroll from 'jquery-smooth-scroll';

class StickyHeader{
	constructor(){
		this.lazyImages = $(".lazyload");
		this.siteHeader = $(".site-header");
		this.pageSections = $(".page-section");
		this.headerLinks = $(".primary-nav a");
		this.headerTriggerElement = $(".large-hero__title");
		this.createHeaderWaypoint();
		this.createPageSectionWaypoints();
		this.addSmoothScrolling();
		this.refreshWaypoints();
	}

	refreshWaypoints(){
		//this.lazyImages.load(function(){
		//	Waypoint.refreshAll();
		//});
	}

	addSmoothScrolling(){
		this.headerLinks.smoothScroll();
	}

	createHeaderWaypoint(){
		var that = this;
		new Waypoint({
			element: this.headerTriggerElement[0],
			handler: function(){
				that.siteHeader.toggleClass("site-header--dark");
			}
		});
	}

	createPageSectionWaypoints(){
		var that = this;
		this.pageSections.each(function(){
			var currentPageSection = this;
			new Waypoint({
				element: currentPageSection,
				handler: function(direction){
					if(direction == "down"){
						that.headerLinks.removeClass("is-current-link");
						$(currentPageSection.getAttribute("data-matching-link")).addClass("is-current-link");
					}
				},
				offset: "18%"
			});
			new Waypoint({
				element: currentPageSection,
				handler: function(direction){
					if(direction == "up"){
						that.headerLinks.removeClass("is-current-link");
						$(currentPageSection.getAttribute("data-matching-link")).addClass("is-current-link");
					}
				},
				offset: "-40%"
			});
		});
	}
}

export default StickyHeader;