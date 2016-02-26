// responsive table
$(document).ready(function(){var switched=false;var updateTables=function(){if(($(window).width()<767)&&!switched){switched=true;$("table.responsive").each(function(i,element){splitTable($(element));});return true;}
else if(switched&&($(window).width()>767)){switched=false;$("table.responsive").each(function(i,element){unsplitTable($(element));});}};$(window).load(updateTables);$(window).bind("resize",updateTables);function splitTable(original)
{original.wrap("<div class='table-wrapper' />");var copy=original.clone();copy.find("td:not(:first-child), th:not(:first-child)").css("display","none");copy.removeClass("responsive");original.closest(".table-wrapper").append(copy);copy.wrap("<div class='pinned' />");original.wrap("<div class='scrollable' />");}
function unsplitTable(original){original.closest(".table-wrapper").find(".pinned").remove();original.unwrap();original.unwrap();}});


// 0 - main, 1 - walkthrough, 2 - default
// id can't have an underscore
function Calendar(id, ttype, varname) {
  this.varname = varname;
  this.id = id;
  this.ttype = ttype;
  this.root = $("#" + id);
  this.currentDay = new Date();
  this.currentDay.setDate(this.currentDay.getDate() - this.currentDay.getDay() + 1);
  this.cvals;

  this.mode = 1; // edit mode;
  if (ttype == 0) {
    this.mode = 0; // view mode;
  }

  var ams = [7, 8, 9, 10, 11];
  var pms = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  var root = $("#" + id);
  
  this.clear = function() {
    this.cvals = [];
    for (var i = 0; i < 7; i++) {
      this.cvals.push([]);
      for (var j = 0; j < (ams.length + pms.length) * 2; j++) {
        this.cvals[i].push(0);
      }
    }
  }

  function addDays(d, num) {
    var dd = new Date(d);
    dd.setDate( dd.getDate() + num);
    return dd;
  }
  
  function getTrId(hour, isHalf, isAm) {
    return id + "_col" + hour + ((isHalf) ? "h" : "") + ((isAm) ? "a" : "p") + "m";
  }

  function getTDid(hour, isHalf, d, isAm) {
    return "cell_" + id + "_" + d.getDay() + "_" + hour + ((isHalf) ? "h" : "") + ((isAm) ? "a" : "p");
  }

  function getTD(hour, isHalf, d, isAm) {
    var dd = addDays(new Date(), 1);
    var past = (dd.valueOf() - d.valueOf() >= 0) ? true : false ;
    var idtag = "id='" + getTDid(hour, isHalf, d, isAm) + "'";
    var cval2 = 0;
    if (isAm) {
      for (var i = 0; i < ams.length; i++) {
        if (ams[i] == hour) {
          cval2 = i * 2 + ((isHalf)?1:0);
          break;
        }
      }
    } else {
      for (var i = 0; i < pms.length; i++) {
        if (pms[i] == hour) {
          cval2 = ams.length * 2 + i * 2 + ((isHalf)?1:0);
          break;
        }
      }
    }
    if (past && ttype != 2) {
      return "<td " + idtag + " cval1='" + (d.getDay() - 1) + "' cval2='" + cval2 + "' class='stdCalCell lockedCell'></td>";
    } else {
      return "<td " + idtag + " cval1='" + (d.getDay() - 1) + "' cval2='" + cval2 + "' class='stdCalCell fillableCell'></td>";
    }
  }

  function getEmptyTD(extra) {
    return "<td class='emptyCell " + extra + "'></td>";
  }

  this.nextWeek = function() {
    this.currentDay.setDate(this.currentDay.getDate() + 7);
    this.loadWeek(this.currentDay);
  }

  this.lastWeek = function() {
    this.currentDay.setDate(this.currentDay.getDate() - 7);
    this.loadWeek(this.currentDay);
  }

  this.currentWeek = function() {
    var today = new Date();
    today.setDate(today.getDate() - today.getDay() + 1);
    this.loadWeek(today);
  }

  function clearCell(hour, isHalf, d, isAm) {
    var currtd = $("#" + getTDid(hour, isHalf, d, isAm));
    var dd = addDays(new Date(), 1);
    var past = (dd.valueOf() - d.valueOf() >= 0) ? true : false ;
    if (past) {
      currtd.removeClass("fillableCell");
      currtd.addClass("lockedCell");
    } else {
      currtd.removeClass("lockedCell");
      currtd.addClass("fillableCell");
    }
  }

  this.loadWeek = function(d) {
    this.currentDay = d;
    $(".weekIndicator" + id).text(this.currentDay.toLocaleDateString());
    d = new Date(this.currentDay);
    for (var j = 0; j < 7; j++) {
      $("#th_" + id + "_" + d.getDay()).html(d.toDateString().substr(0,3) + "<br>" + d.getDate());
      
      for (var i = 0; i < ams.length; i++) {
        clearCell(ams[i], false,  d, true);
        clearCell(ams[i], true, d, true);
      }

      for (var i = 0; i < pms.length; i++) {
        clearCell(pms[i], false, d, false);
        clearCell(pms[i], true, d, false);
      }
      d = addDays(d, 1);
    }
  }

  this.editMode = function() {
    this.mode = 1;
    $(".ed1, .ed3, .ed4").addClass("clickable");
    $(".ed1").attr("onclick", this.varname + ".useDefaults()");
    $(".ed1").text("use weekly defaults");
    $(".ed2").attr("onclick", this.varname + ".setDefaults()");
    $(".ed2").text("save week as default");
    $(".ed3").attr("onclick", this.varname + ".clear()");
    $(".ed3").text("clear this week");
    $(".ed4").attr("onclick", this.varname + ".interactMode()");
    $(".ed4").text("interact mode");
  }

  this.interactMode = function() {
    this.mode = 0;
    $(".ed1, .ed3, .ed4").removeClass("clickable");
    $(".ed1").attr("onclick", "");
    $(".ed1").text("");
    $(".ed2").attr("onclick", this.varname + ".editMode()");
    $(".ed2").text("edit mode");
    $(".ed3").attr("onclick", "");
    $(".ed3").text("");
    $(".ed4").attr("onclick", "");
    $(".ed4").text("");
  }



  this.addCol = function addCol(day, month, year) {
    var d = new Date(month + "/" + day + "/" + year);
    
    var currtr = $("#" + id + "_coltrh");
    var thtags = ""
    if (d.getDate() == (new Date()).getDate()) {
      thtags = "class='current_" + this.id + "'";
    }
    currtr.append("<th " + thtags + "  id='th_" + id + "_" + d.getDay() + "'>" + d.toDateString().substr(0,3) + "<br>" + ((ttype < 2) ? day : "&nbsp;") + "</th>");
    for (var i = 0; i < ams.length; i++) {
      currtr = $("#" + getTrId(ams[i], false, true));
      currtr.append(getTD(ams[i], false, d, true));
      currtr = $("#" + getTrId(ams[i], true, true));
      currtr.append(getTD(ams[i], true, d, true));
    }
    for (var i = 0; i < pms.length; i++) {
      currtr = $("#" + getTrId(pms[i], false, false));
      currtr.append(getTD(pms[i], false, d, false));
      currtr = $("#" + getTrId(pms[i], true, false));
      currtr.append(getTD(pms[i], true, d, false));
    }
  }

  this.addOptionsCol = function (day, month, year) {
    var d = new Date(month + "/" + day + "/" + year);
    
    var currtr = $("#" + id + "_coltrh");
    
    currtr.append("<th class='calOptionTH'>Week of<br><span class='weekIndicator" + id + "'>" + this.currentDay.toLocaleDateString() + "</span></th>");
    // next week, last week, current week, use default, edit default
    currtr = $("#" + getTrId(ams[0], false, true));
    currtr.append("<td class='emptyCell clickable' onclick='" + this.varname + ".lastWeek()'>view last week</td>");
    currtr = $("#" + getTrId(ams[0], true, true));
    currtr.append("<td class='emptyCell clickable' onclick='" + this.varname + ".nextWeek()'>view next week</td>");
    currtr = $("#" + getTrId(ams[1], false, true));
    currtr.append("<td class='emptyCell clickable' onclick='" + this.varname + ".currentWeek()'>view current week</td>");
    currtr = $("#" + getTrId(ams[1], true, true));

    if (this.mode == 1) { // edit mode
      currtr = $("#" + getTrId(ams[1], true, true));
      currtr.append("<td class='emptyCell clickable ed1' onclick='" + this.varname + ".useDefaults()'>use weekly defaults</td>");
      currtr = $("#" + getTrId(ams[2], false, true));
      currtr.append("<td class='emptyCell clickable ed2' onclick='" + this.varname + ".setDefaults()'>save week as default</td>");
      currtr = $("#" + getTrId(ams[2], true, true));
      currtr.append("<td class='emptyCell clickable ed3' onclick='" + this.varname + ".clear()'>clear this week</td>");
    } else { // view mode
      currtr = $("#" + getTrId(ams[1], true, true));
      currtr.append(getEmptyTD("ed1"));
      currtr = $("#" + getTrId(ams[2], false, true));
      currtr.append("<td class='emptyCell clickable ed2' onclick='" + this.varname + ".editMode()'>edit mode</td>");
      currtr = $("#" + getTrId(ams[2], true, true));
      currtr.append(getEmptyTD("ed3"));
    }

    if (this.ttype == 0 && this.mode == 1) { // switch to interactable
      currtr = $("#" + getTrId(ams[3], false, true));
      currtr.append(getEmptyTD());
      currtr = $("#" + getTrId(ams[3], true, true));
      currtr.append("<td class='emptyCell clickable ed4' onclick='" + this.varname + ".interactMode()'>interact mode</td>");
    } else {
      currtr = $("#" + getTrId(ams[3], false, true));
      currtr.append(getEmptyTD());
      currtr = $("#" + getTrId(ams[3], true, true));
      currtr.append(getEmptyTD("ed4"));
    }

    for (var i = 4; i < ams.length; i++) {
      currtr = $("#" + getTrId(ams[i], false, true));
      currtr.append(getEmptyTD());
      currtr = $("#" + getTrId(ams[i], true, true));
      currtr.append(getEmptyTD());
    }
    for (var i = 0; i < pms.length; i++) {
      currtr = $("#" + getTrId(pms[i], false, false));
      currtr.append(getEmptyTD());
      currtr = $("#" + getTrId(pms[i], true, false));
      currtr.append(getEmptyTD());
    }
  }

  this.addSaveCol = function (day, month, year) {
    var d = new Date(month + "/" + day + "/" + year);
    
    var currtr = $("#" + id + "_coltrh");
    
    currtr.append("<th class='calOptionTH'>Default<br><span class='weekIndicator" + id + "'>Calendar</span></th>");
    // next week, last week, current week, use default, edit default
    currtr = $("#" + getTrId(ams[0], false, true));
    currtr.append("<td class='emptyCell clickable' onclick='" + this.varname + ".clear()'>clear all</td>");
    currtr = $("#" + getTrId(ams[0], true, true));
    currtr.append("<td class='emptyCell clickable' onclick='" + this.varname + ".saveDefault()'>save</td>");
    for (var i = 1; i < ams.length; i++) {
      currtr = $("#" + getTrId(ams[i], false, true));
      currtr.append(getEmptyTD());
      currtr = $("#" + getTrId(ams[i], true, true));
      currtr.append(getEmptyTD());
    }
    for (var i = 0; i < pms.length; i++) {
      currtr = $("#" + getTrId(pms[i], false, false));
      currtr.append(getEmptyTD());
      currtr = $("#" + getTrId(pms[i], true, false));
      currtr.append(getEmptyTD());
    }
  }

  this.handlers = function() {
    var self = this;
    $("#" + id + " td").click(function(e) {
      var t = $("#" + $(e.target).attr("id"));
      if (self.mode == 1) { // edit mode
        if (t.hasClass("fillableCell")) {
          var cval1 = parseInt($(e.target).attr("cval1"));
          var cval2 = parseInt($(e.target).attr("cval2"));
          if (self.cvals[cval1][cval2] == 0) {
            // tis empty
            if (self.cvals[cval1][cval2 - 1] == 0 && self.cvals[cval1][cval2 + 1] == 0 ) {

              // add two

              t.text("searching...");
              t.toggleClass("freeCell");
            } else {
              // merge

            }
          }
          /*
          if (!$(e.target).hasClass("freeCell")) {
            $(e.target).text("searching...");
          } else {
            $(e.target).text("");
          }
          $(e.target).toggleClass("freeCell");
          */
        } else if (t.hasClass("lockedCell")) {
          alert("We need at least two days from today to plan a meetup for you.");
        }
      } else { // view mode

      }
      
    });
  }


  function init(thisx) {
    root.append("<tr id='" + id + "_coltrh'><th class='tableFirstCol'><a class='clickable' onclick='showHelp()'>Help</a><br>&nbsp;</th></tr>");
    for (var i = 0; i < ams.length; i++) {
      root.append("<tr id='" + getTrId(ams[i], false, true) + "'><td class='tableFirstCol'>" + ams[i] + " AM</td></tr>");
      root.append("<tr id='" + getTrId(ams[i], true, true) + "'><td></td></tr>");
    }
    for (var i = 0; i < pms.length; i++) {
      root.append("<tr id='" + getTrId(pms[i], false, false) + "'><td class='tableFirstCol'>" + pms[i] + " PM</td></tr>");
      root.append("<tr id='" + getTrId(pms[i], true, false) + "'><td></td></tr>");
    }

    var today = new Date();
    today.setDate(today.getDate() - today.getDay() + 1); // set to the beginning of the week

    if (ttype < 2) {
      thisx.addOptionsCol(today.getDate(), today.getMonth() + 1, today.getYear() + 1900);
    } else {
      thisx.addSaveCol(today.getDate(), today.getMonth() + 1, today.getYear() + 1900);
    }

    for (var i = 0; i < 7; i++) {
      thisx.addCol(today.getDate(), today.getMonth() + 1, today.getYear() + 1900);
      today = addDays(today, 1);
    }

    if (ttype < 2) {
      thisx.addOptionsCol(today.getDate(), today.getMonth() + 1, today.getYear() + 1900);
    } else {
      thisx.addSaveCol(today.getDate(), today.getMonth() + 1, today.getYear() + 1900);
    }
    thisx.clear();
    thisx.handlers();

  }

  this.pageEntered = function() {
    $('.scrollable').scrollLeft(0);
    if (ttype != 2) {
      var scrollamt = $(".current_" + this.id).offset().left - 60;
      console.log(scrollamt);
      $('.scrollable').scrollLeft(scrollamt);
    }


    
  }

  init(this);
 
}
