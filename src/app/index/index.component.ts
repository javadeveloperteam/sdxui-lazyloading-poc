import { Component, OnInit } from '@angular/core';
import { Helpers } from '../helpers/helpers';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    $(document).ready(function () {
      $(".open-left").click(function (e) {
        e.stopPropagation();
        openLeftBar();
      });

      $("#sidebar-menu a").click(function (e) {
        e.stopPropagation();
        menuItemClick(e);
      });
      $("#btn-fullscreen").on('click', function () {
        toggle_fullscreen(document);
      });
      //$("#sidebar-menu ul li.has_sub a.active").parents("li:last").children("a:first").addClass("active").trigger("click");
      changeptype();
      initscrolls();
      initMenus();
    });

    function openLeftBar() {
      $("#wrapper").toggleClass("enlarged");
      $("#wrapper").addClass("forced");

      if ($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")) {
        $("body").removeClass("fixed-left").addClass("fixed-left-void");
      } else if (!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")) {
        $("body").removeClass("fixed-left-void").addClass("fixed-left");
      }

      if ($("#wrapper").hasClass("enlarged")) {
        $(".left ul").removeAttr("style");
      } else {
        $(".subdrop").siblings("ul:first").show();
      }

      toggle_slimscroll(".slimscrollleft");
      $("body").trigger("resize");
    }
    function toggle_slimscroll(item) {
      if ($("#wrapper").hasClass("enlarged")) {
        //$(item).css("overflow","inherit").parent().css("overflow","inherit");
        $(item).siblings(".slimScrollBar").css("visibility", "hidden");
      } else {
        //$(item).css("overflow","hidden").parent().css("overflow","hidden");
        $(item).siblings(".slimScrollBar").css("visibility", "visible");
      }
    }
    function menuItemClick(e) {
      if (!$("#wrapper").hasClass("enlarged")) {
        if ($(e.currentTarget).parent().hasClass("has_sub")) {
          e.preventDefault();
        }
        if (!$(e.currentTarget).hasClass("subdrop")) {
          // hide any open menus and remove all other classes
          $("ul", $(e.currentTarget).parents("ul:first")).slideUp(350);
          $("a", $(e.currentTarget).parents("ul:first")).removeClass("subdrop");
          $("#sidebar-menu .pull-right i").removeClass("mdi-minus").addClass("mdi-plus");

          // open our new menu and add the open class
          $(e.currentTarget).next("ul").slideDown(350);
          $(e.currentTarget).addClass("subdrop");
          $(".pull-right i", $(e.currentTarget).parents(".has_sub:last")).removeClass("mdi-plus").addClass("mdi-minus");
          $(".pull-right i", $(e.currentTarget).siblings("ul")).removeClass("mdi-minus").addClass("mdi-plus");
        } else if ($(e.currentTarget).hasClass("subdrop")) {
          $(e.currentTarget).removeClass("subdrop");
          $(e.currentTarget).next("ul").slideUp(350);
          $(".pull-right i", $(e.currentTarget).parent()).removeClass("mdi-minus").addClass("mdi-plus");
        }
      }
    }
    function toggle_fullscreen(document) {
      var $this = this;
      var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
      if (fullscreenEnabled) {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
          launchFullscreen(document.documentElement);
        } else {
          exitFullscreen(document);
        }
      }
    }
    function launchFullscreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
    function exitFullscreen(document) {
      if (document.exitFullscreen) {
        exitFullscreen(document);
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }

    function changeptype() {
      let w = 0, h = 0, dw = 0, dh = 0;
      w = $(window).width();
      h = $(window).height();
      dw = $(document).width();
      dh = $(document).height();

      if ($.browser.mobile === true) {
        $("body").addClass("mobile").removeClass("fixed-left");
      }

      if (!$("#wrapper").hasClass("forced")) {
        if (w > 1024) {
          $("body").removeClass("smallscreen").addClass("widescreen");
          $("#wrapper").removeClass("enlarged");
        } else {
          $("body").removeClass("widescreen").addClass("smallscreen");
          $("#wrapper").addClass("enlarged");
          $(".left ul").removeAttr("style");
        }
        if ($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")) {
          $("body").removeClass("fixed-left").addClass("fixed-left-void");
        } else if (!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")) {
          $("body").removeClass("fixed-left-void").addClass("fixed-left");
        }

      }
      toggle_slimscroll(".slimscrollleft");
    }

    function initMenus() {
      let userRole = Helpers.getUserRole();
      if (userRole == 'User') {
        hideAllMenus();
        let menuList = localStorage.getItem('menuList');
        if (menuList != null) {
          let menuJson = JSON.parse(menuList);
          for (let i = 0; i < menuJson.length; i++) {
            $('#' + menuJson[i]).show();
          }
        }
      }

    }

    function hideAllMenus() {
     // $('#DASHBOARD').hide();
      $('#PROFILE').hide();

      // SDX MESSENGER
      $('#SDXMESSENGER').hide();
      $('#USERS').hide();
      $('#CONFIGURATION').hide();
      $('#DEPARTMENT').hide();
      $('#DESTINATION').hide();
      $('#GROUP').hide();
      $('#SENDMESSAGE').hide();
      $('#SCHEDULE').hide();

      // SDX INTELLIGENCE
      $('#SDXINTELLIGENCE').hide();
      $('#APPLICATION').hide();
	  $('#listid').hide();
	  $('#EVENTV').hide();
      $('#ASSET').hide();
	  $('#LOCATION').hide();
      $('#POLICY').hide();
      $('#CLIENTADAPTER').hide();
      $('#MESSAGEBLOCKING').hide();

      // SDXSPALSHER
      $('#SDXSPLASHER').hide();
      $('#NOTIFICATIONSTATUS').hide();
      $('#EVENTSTATUS').hide();

    }
    function initscrolls() {
      if ($.browser.mobile !== true) {
        //SLIM SCROLL
        $('.slimscroller').slimscroll({
          height: 'auto',
          size: "5px"
        });

        $('.slimscrollleft').slimScroll({
          height: 'auto',
          position: 'right',
          size: "5px",
          color: '#7A868F',
          wheelStep: 5
        });
      }
    }
    $(document).ready(function () {
      $("#sidebar-menu a").each(function () {

        if (this.href == window.location.href || this.href+'/add' == window.location.href || 
		this.href+'/calendarview' ==  window.location.href || this.href+'/editApplication' ==  window.location.href || 
		this.href+'/editEventVariable' ==  window.location.href || this.href+'/add' ==  window.location.href || 
		this.href+'/edit' ==  window.location.href ) {
		  //alert(window.location.href);
			//alert(this.href+'/add');
          if ($(this).attr('data-pos') == 'sub-nav') {
            $(this).parent().parent().parent().parent().prev().addClass('active');
            $(this).parent().parent().parent().parent().prev().click();
            $(this).parent().parent().prev().addClass("active");
            $(this).parent().parent().prev().click();
            return;
          }
          $(this).addClass("active");
          $(this).parent().addClass("active"); // add active to li of the current link
          $(this).parent().parent().prev().addClass("active"); // add active class to an anchor
         
          $(this).parent().parent().prev().click(); // click the item to make it drop

        }
      });
      $("#sidebar-menu a").click(function () {
        if (!$(this).parents().hasClass("has_sub")) {
          $(".has_sub a").removeClass("active");
        }
      });
      $("#sidebar-menu .has_sub .list-unstyled a").click(function () {
        if ($(this).parents().hasClass("has_sub")) {
          $(".has_sub > a").removeClass("active");
          $(this).parents().children(".subdrop").addClass("active");
        }
      });
    });
  }

  navigateProfilePage(url:any){
    this.router.navigateByUrl('/index', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
    });
  }

}
