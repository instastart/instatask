// responsive table
$(document).ready(function(){var switched=false;var updateTables=function(){if(($(window).width()<767)&&!switched){switched=true;$("table.responsive").each(function(i,element){splitTable($(element));});return true;}
else if(switched&&($(window).width()>767)){switched=false;$("table.responsive").each(function(i,element){unsplitTable($(element));});}};$(window).load(updateTables);$(window).bind("resize",updateTables);function splitTable(original)
{original.wrap("<div class='table-wrapper' />");var copy=original.clone();copy.find("td:not(:first-child), th:not(:first-child)").css("display","none");copy.removeClass("responsive");original.closest(".table-wrapper").append(copy);copy.wrap("<div class='pinned' />");original.wrap("<div class='scrollable' />");}
function unsplitTable(original){original.closest(".table-wrapper").find(".pinned").remove();original.unwrap();original.unwrap();}});

var lastupper = null;

var ams = [7, 8, 9, 10, 11];
var pms = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function toDateString(d) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var date = d;
  var day = date.getDate();
  if (day == 1) {
    day += "st";
  } else if (day == 2) {
    day += "nd";
  } else {
    day += "th";
  }

  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return monthNames[monthIndex] + ' ' + day + ', ' + year;
}

function Cell(id, d, cval2, upper) {
  this.id = id;
  this.date = d;
  this.cval2 = cval2;
  this.upper = upper;
  this.lower = null;

  this.taken = false;

  this.state = 0;

  this.eventId = "";
  this.location = "Foodworx";
  this.people = ["Adre Marie", "Oleg Uptkin", "Obiwan Konobi", "Ana Wong"];
  this.peopleId = ['56c6dceaa5af6ef519a38fea', '56c6e27d54d51c271be170ac', '56c73e24a9e62c5a2351df75', '56c6fa28e034b5fc1c3870cc'];

  this.setLower = function(lower) {
    this.lower = lower;
  }


  this.getDateString = function() {
    return toDateString(this.date);
  }

  this.getTimeString = function() {
    if (cval2 < ams.length * 2) {
      return ams[Math.floor(cval2 / 2)] + ":" + ((cval2 % 2 == 1)?"30":"00") + " am";
    } else {
      return pms[Math.floor(cval2 / 2 - ams.length)] + ":" + ((cval2 % 2 == 1)?"30":"00") + " pm";
    }
  }

  this.getTimeEndString = function() {
    var ccval2 = cval2 + 1;
    
    if (cval2 < ams.length * 2) {
      return ams[Math.floor(ccval2 / 2)] + ":" + ((ccval2 % 2 == 1)?"30":"00") + " am";
    } else {
      if (pms[Math.floor(ccval2 / 2 - ams.length)]) {
        return pms[Math.floor(ccval2 / 2 - ams.length)] + ":" + ((ccval2 % 2 == 1)?"30":"00") + " pm";
      } else {
        return "11:00 pm";
      }
    }
  }
}

// 0 - main, 1 - walkthrough, 2 - default
// id can't have an underscore
function Calendar(id, ttype, varname) {
  this.varname = varname;
  this.id = id;
  this.ttype = ttype;
  this.root = $("#" + id);
  this.currentDay = new Date();
  this.currentDay.setDate(this.currentDay.getDate() - this.currentDay.getDay() + 1); // start of the week

  this.nextDay = new Date();
  this.startDay = new Date();

  this.cvals;

  this.tcells = {};

  this.mode = 1; // edit mode;
  if (ttype == 0) {
    this.mode = 0; // view mode;
  }

  var root = $("#" + id);
  
  this.clear = function() {
    var availabletimes = $("#" + this.id + " .teal.topDiv.emode");

    for (var i = 0; i < availabletimes.length; i++) {
      var t = $( availabletimes[i] ).parent();
      var curr = this.tcells[t.attr("id")];
      while (curr && curr.taken) {
        this.unshade(curr);
        curr = curr.lower; 
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

  this.getTDid = function (day, cval2) {

    return "cell_" + this.id + "_" + day.toLocaleDateString().replace(/\//g, "_") + "_" + cval2;
  }

  function getThid(day, month, year) {
    return "th_" + id + "_" + day + "_" + month + "_" + year;
  }

  function isPast(d) {
    var dd = addDays(new Date(), 1);
    return (dd.valueOf() - d.valueOf() >= 0) ? true : false ;
  }

  function getCval2(hour, isHalf, d, isAm) {
    var past = isPast(d);
    
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
    return cval2;
  }

  function getCval1(d) {
    return (d.getDay() == 0) ? 6 : d.getDay() - 1;
  }

  this.getTD = function(hour, isHalf, d, isAm) {
    var past = isPast(d);
    
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
    var idn = this.getTDid(d, cval2);
    var idtag = "id='" + idn + "'";
    var halfClass = (isHalf) ? "halfCell" : "fullCell" ;
    var content = "<div class='celldiv1 halfDiv imode'></div><div class='celldiv2 halfDiv imode'></div>";
    content += "<div class='celldiv1 halfDiv emode'></div><div class='celldiv2 halfDiv emode'></div>";

    this.tcells[ idn ] = new Cell(idn, d, cval2, lastupper);
    if (lastupper) {
      lastupper.lower = this.tcells[ idn ];
    }
    lastupper = this.tcells[ idn ];
    oclick = " onclick=\"" + this.varname + ".cellClicked('" + idn + "')\" ";
    if (past && ttype != 2) {
      return "<td " + idtag + oclick + " cval2='" + cval2 + "' class='stdCalCell lockedCell " + halfClass + "'>" + content + "</td>";
    } else {
      return "<td " + idtag + oclick + " cval2='" + cval2 + "' class='stdCalCell fillableCell " + halfClass + "'>" + content + "</td>";
    }
  }

  function getEmptyTD(extra) {
    return "<td class='emptyCell " + extra + "'></td>";
  }

/*
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

  
  function clearCell(cval1, cval2, d) {
    var currtd = $("#" + getTDid(d, cval2));
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
    this.clear();
    this.currentDay = d;
    var dstring = this.currentDay.toLocaleDateString()
    $(".weekIndicator" + id).text(dstring);
    d = new Date(this.currentDay);
    for (var j = 0; j < 7; j++) {
      $("#th_" + id + "_" + d.getDay()).html(d.toDateString().substr(0,3) + "<br>" + d.getDate());
      

      var cval2, cval2;
      for (var i = 0; i < ams.length; i++) {
        cval1 = getCval1(ams[i], false,  d, true);
        cval2 = getCval2(ams[i], false,  d, true);
        clearCell(cval1, cval2, d);
        cval1 = getCval1(ams[i], true,  d, true);
        cval2 = getCval2(ams[i], true,  d, true);
        clearCell(cval1, cval2, d);
      }

      for (var i = 0; i < pms.length; i++) {
        cval1 = getCval1(pms[i], false, d, false);
        cval2 = getCval2(pms[i], false, d, false);
        clearCell(cval1, cval2, d);
        cval1 = getCval1(pms[i], true, d, false);
        cval2 = getCval2(pms[i], true, d, false);
        clearCell(cval1, cval2, d);
      }
      d = addDays(d, 1);

    }

    $.post("/cal", {"week": dstring, "def": (this.ttype == 2)}, function(data) {
      if (data.error) {
        console.log(error);
      } else {
        console.log(data);
        for (var i = 0; i < data.cals.length; i++) {
          var t = $("#" + getTDid(data.cals[i].day, data.cals[i].cval2));
          t.addClass("freeCell");
          t.text("searching...");
        } 
      }
      
    });
  }
  */

  this.editMode = function() {
    this.mode = 1;
    $("#" + this.id + " .halfRow").show();

    if (this.ttype == 0) {
      $("#interactButton, #" + this.id + " .emode").show();
      $("#editButton, #" + this.id + " .imode").hide();
    } else {
      $("#" + this.id + " .emode").show();
      $("#" + this.id + " .imode").hide();
    }
    

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

  this.interactMode = function(dontalert) {
    this.mode = 0;
    //HOAHACK
    if (ttype == 0) {
      $("#mainArea").scrollTop("0");
    }
    
    $("#interactButton, #" + this.id + " .emode").hide();
    $("#editButton, #" + this.id + " .imode").show();

    $("#" + this.id + " .halfRow").hide();

    $(".ed1, .ed3, .ed4").removeClass("clickable");
    $(".ed1").attr("onclick", "");
    $(".ed1").text("");
    $(".ed2").attr("onclick", this.varname + ".editMode()");
    $(".ed2").text("edit mode");
    $(".ed3").attr("onclick", "");
    $(".ed3").text("");
    $(".ed4").attr("onclick", "");
    $(".ed4").text("");



    if (!dontalert) {
      this.clearServerCalendar();
      // this.saveCalendar();
      // alert("Thanks for inputting your free times! Please wait until 2 days before a free time to see if we found friends for you to grab food with.");
    }
  }

  this.findCellEnd = function(cell) {
    var curr = cell;
    while (curr.lower && curr.lower.taken) {
      curr = curr.lower;
    }
    return curr;
  }

  this.findCellStart = function(cell) {
    var curr = cell;
    while (curr.upper && curr.upper.taken) {
      curr = curr.upper;
    }
    return curr;
  }

  this.clearServerCalendar = function() {
    var dd = addDays(new Date(), 1);
    var de = new Date(this.nextDay);
    de.setDate(de.getDate() - 1);
    var self = this;
    $.post("/cal", {
      "remove": true,
      "daystart": dd.toString(),
      "dayend": de.toString(),
      "def": (this.ttype == 2) ? true : false
    }, function(data) {
      if (data.success) {
        self.saveCalendar();
      } else {
        alert(data.error);
      }
    });
  }

  this.saveCalendar = function() {
    var availabletimes = $("#" + this.id + " .teal.topDiv.emode");
    // console.log(availabletimes);

    for (var i = 0; i < availabletimes.length; i++) {
      var t = $( availabletimes[i] ).parent();
      if (this.tcells[t.attr("id")].taken) {
        var cellend = this.findCellEnd(this.tcells[t.attr("id")]);
        $.post("/cal", {
          "set": true,
          "cval2start": this.tcells[t.attr("id")].cval2 ,
          "cval2end": cellend.cval2,
          "cval1": getCval1(this.tcells[t.attr("id")].date),

          "day": this.tcells[t.attr("id")].date.toString(),
          "def": (this.ttype == 2) ? true : false
        }, alertError);
      }
    }
  }

  this.addCol = function (day, month, year) {
    var d = new Date(month + "/" + day + "/" + year);
    var currtr = $("#" + id + "_coltrh");
    var thtags = ""
    if (d.getDate() == (new Date()).getDate()) {
      thtags = "class='current_" + this.id + "'";
    }
    var startHalf = d.toDateString().substr(4,3) + "<br>";
    if (this.ttype == 2) {
      startHalf = "";
    }
    var toAppend = "<th " + thtags + "  id='" + getThid(day, month, year) + "'>" + startHalf + d.toDateString().substr(0,3) + ((ttype < 2) ? " " + day : "") + "</th>";
    currtr.append(toAppend);
    $("#" + id + "_coltrhh").append(toAppend);
    for (var i = 0; i < ams.length; i++) {
      currtr = $("#" + getTrId(ams[i], false, true));
      currtr.append(this.getTD(ams[i], false, d, true));
      currtr = $("#" + getTrId(ams[i], true, true));
      currtr.append(this.getTD(ams[i], true, d, true));
    }
    for (var i = 0; i < pms.length; i++) {
      currtr = $("#" + getTrId(pms[i], false, false));
      currtr.append(this.getTD(pms[i], false, d, false));
      currtr = $("#" + getTrId(pms[i], true, false));
      currtr.append(this.getTD(pms[i], true, d, false));
    }
    lastupper = null;

    if (this.mode == 1) {
      $("#" + this.id + " .emode").show();
      $("#" + this.id + " .imode").hide();
    } else {
      $("#" + this.id + " .emode").hide();
      $("#" + this.id + " .imode").show();
    }
    // this.handlers();
  }

  function alertError(data) {
    if (data.success) {

    } else {
      alert(data.error);
    }
  }

  /*
   * Two element blob, remove whole thing,
   * Three element: top, remove top only, bot, remove bot only, middle - remove whole thing
   * Four element: top, remove top only, top2 - remove top 2, bot2 - remove bot2, bot -remove bot
   * five element: middle - remove middle only. See 4 element.
   */
  this.filledTap = function(tid) {
    var t = $("#" + tid);
    var countup = 0;
    var curr = this.tcells[tid];
    while (curr.upper && curr.upper.taken) {
      curr = curr.upper;
      countup ++;
    }
    var countdown = 0;
    var curr = this.tcells[tid];
    while (curr.lower && curr.lower.taken) {
      curr = curr.lower;
      countdown ++;
    }

    this.unshade(this.tcells[tid]);
    if (countup == 1) {
      this.unshade(this.tcells[tid].upper);
    }
    if (countdown == 1) {
      this.unshade(this.tcells[tid].lower);
    }

    /*
    $.post("/cal", {
      "remove": true,
      "cval1": cval1,
      "cval2": cval2,
      "week": $($(".weekIndicator" + self.id)[0]).text(),
      "def": (this.ttype == 2) ? true : false
    }, alertError);
    t.toggleClass("freeCell");
    */
  }

  this.unshade = function(obj) {
    var t = $("#" + obj.id);
    t.find(".emode.celldiv1").removeClass("teal");
    t.find(".emode.celldiv2").removeClass("teal");

    t.find(".emode.celldiv1").removeClass("topDiv");
    t.find(".emode.celldiv1").text("");

    var te;
    if (obj.cval2 % 2 == 1) { // half
      te = $("#" + obj.upper.id);
      te.find(".imode.celldiv2").removeClass("teal");
      te.find(".imode.celldiv1").attr("onclick", "");
      te.find(".imode.celldiv2").removeClass("topDiv");
      te.find(".imode.celldiv2").text("");
    } else { // pure
      te = t;
      te.find(".imode.celldiv1").removeClass("teal");
      te.find(".imode.celldiv1").attr("onclick", "");
      te.find(".imode.celldiv1").removeClass("topDiv");
      te.find(".imode.celldiv1").text("");
    }

    obj.state = 0;
    obj.taken = false;

    if (obj.lower && obj.lower.taken) {
      this.shade(obj.lower, true);
    }
  }

  // preconditions: if isEvent, then obj.location and obj.people.length must be updated before clicked
  this.shade = function(obj, withavailable, withEnd, isEvent) {
    if (!obj) {
      return;
    }
    var t = $("#" + obj.id);
    var past = isPast(obj.date);
    var cclass = "teal";
    var label = "available";
    var endLabel = "";
    var cclickable = " clickable"; 
    var conclick = this.varname + ".calClick('" + obj.id + "')";
    if (isEvent) {
      cclass = "orange";
      label = obj.location;
      endLabel = obj.people.length + " " + "<img src='images/personicon.png' class='personicon'>";
      conclick = this.varname + ".calEventClick('" + obj.id + "')";
      obj.state = 1;
    } else if (past) {
      cclass = "gray";
      label = "no meetup found";
      conclick = this.varname + ".calNMClick('" + obj.id + "')";
      obj.state = 0;
    } else {
      obj.state = 0;
    }
    t.find(".emode.celldiv1").addClass(cclass);
    t.find(".emode.celldiv2").addClass(cclass);

    if (withavailable) {
      t.find(".emode.celldiv1").addClass("topDiv");
      t.find(".emode.celldiv1").text(label);
    } else if (withEnd) {
      t.find(".emode.celldiv2").addClass("botDiv");
      t.find(".emode.celldiv2").html(endLabel);
    } else {
      t.find(".emode.celldiv1").removeClass("topDiv");
      t.find(".emode.celldiv1").text("");
    }

    var te;
    if (obj.cval2 % 2 == 1) { // half
      te = $("#" + obj.upper.id);
      te.find(".imode.celldiv2").addClass(cclass + cclickable);
      te.find(".imode.celldiv2").attr("onclick", conclick);
      if (withavailable) {
        te.find(".imode.celldiv2").addClass("topDiv");
        te.find(".imode.celldiv2").text(label);
      } else if (withEnd) {
        te.find(".imode.celldiv2").addClass("botDiv");
        te.find(".imode.celldiv2").html(endLabel);
      } else {
        te.find(".imode.celldiv2").removeClass("topDiv");
        te.find(".imode.celldiv2").text("");
      }
    } else { // pure
      te = t;
      te.find(".imode.celldiv1").addClass(cclass + cclickable);
      te.find(".imode.celldiv1").attr("onclick", conclick);
      if (withavailable) {
        te.find(".imode.celldiv1").addClass("topDiv");
        te.find(".imode.celldiv1").text(label);
      } else if (withEnd) {
        te.find(".imode.celldiv1").addClass("botDiv");
        te.find(".imode.celldiv1").html(endLabel);
      } else {
        te.find(".imode.celldiv1").removeClass("topDiv");
        te.find(".imode.celldiv1").text("");
      }
    }

    obj.taken = true;
  }

  /*
   * If nothing on top and bottom: new hour
   * If something on top and bottom: merge two time zones
   * If something only on top, merge with top
   * If soemthing only on bottom, merge only with bottom
   */
  this.emptyTap = function(tid) {
    console.log("empty");
    var t = $("#" + tid);
    if (this.tcells[tid].upper && this.tcells[tid].upper.taken) {
      if (this.tcells[tid].lower && this.tcells[tid].lower.taken) {
        // both taken
        this.shade(this.tcells[tid], false);
        this.shade(this.tcells[tid].lower, false);
      } else {
        // only upper
        this.shade(this.tcells[tid], false);
      }
    } else {
      if (this.tcells[tid].lower && this.tcells[tid].lower.taken) {
        // only lower
        this.shade(this.tcells[tid], true);
        this.shade(this.tcells[tid].lower, false);
      } else {
        // neither
        this.shade(this.tcells[tid], true);
        if (this.tcells[tid].lower.lower && this.tcells[tid].lower.lower.taken) {
          this.shade(this.tcells[tid].lower, false);
          this.shade(this.tcells[tid].lower.lower, false);
        } else {
          this.shade(this.tcells[tid].lower, false);
        }
      }
    }

    /*
    if (!this.tcells[tid].upper.taken && !this.tcells[tid].lower.taken ) {
      // add two
      t.text("searching...");
      $.post("/cal", {
        "set": true,
        "cval1": cval1,
        "cval2": cval2,
        "week": $($(".weekIndicator" + self.id)[0]).text(),
        "def": (this.ttype == 2) ? true : false
      }, alertError);
      t.toggleClass("freeCell");
    } else {

    }*/
  }

  this.handlers = function() {
    var self = this;
    /*
    $("#" + id + " td").click(function(e) {
      var t = $(e.target).parent();
      var tid = t.attr("id");
      if (self.mode == 1) { // edit mode
        if (t.hasClass("fillableCell")) {
          var cval2 = parseInt($(e.target).attr("cval2"));
          if ( self.tcells[tid].taken ) { // cell has value, clear cell
            self.filledTap(tid);
          } else { // tis empty
            self.emptyTap(tid);
          } 
        } else if (t.hasClass("lockedCell")) {
          alert("We need at least two days from today to plan a meetup for you.");
        }
      } else { // view mode

      }
      
    });
    */
  }

  this.cellClicked = function(tid) {

    var t = $("#" + tid);
    if (this.mode == 1) { // edit mode
      if (t.hasClass("fillableCell")) {
        if ( this.tcells[tid].taken ) { // cell has value, clear cell
          this.filledTap(tid);
        } else { // tis empty
          this.emptyTap(tid);
        } 
      } else if (t.hasClass("lockedCell")) {
        alert("We need at least two days from today to plan a meetup for you.");
      }
    } else { // view mode

    }
  }

  this.calClick = function(tid) {
    var obj = this.tcells[tid];

    showModal(1);

    $(".stdModalHide").hide();

    $("#eventModalTitle").text("Time Available");

    $("#eventModal_date").text(obj.getDateString());
    $("#eventModal_time").text(this.findCellStart(obj).getTimeString() + " - " + this.findCellEnd(obj).getTimeEndString());
    var d = new Date(obj.date);
    d.setDate(d.getDate() - 1);
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    $("#eventModal_notes").text("You will be notified about a meetup for this available time before " + days[d.getDay()] + ", " + toDateString(d) );
    // alert("You will be notified about a meetup for this available time in the afternoon of " + obj.date.toString());
    
  }

  this.calNMClick = function(tid) {
    var obj = this.tcells[tid];

    showModal(1);

    $(".stdModalHide").hide();

    $("#eventModalTitle").text("No Meetup Scheduled");

    $("#eventModal_date").text(obj.getDateString());
    $("#eventModal_time").text(this.findCellStart(obj).getTimeString() + " - " + this.findCellEnd(obj).getTimeEndString());
    var d = new Date(obj.date);
    d.setDate(d.getDate() - 1);
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    $("#eventModal_notes").text("");
    $("#nm_note").show();
    // alert("You will be notified about a meetup for this available time in the afternoon of " + obj.date.toString());
  }

  function init(thisx) {
    var inner = "&nbsp;";
    if (thisx.ttype < 2) {
      inner += "<br>&nbsp;";
    }
    root.append("<tr id='" + id + "_coltrh'><th class='lefttopcorner tableFirstCol'>" + inner + "</th></tr>");
    $("#" + id + "Header").append("<tr id='" + id + "_coltrhh'><th class='lefttopcorner tableFirstCol'>" + inner + "</th></tr>");

    var even = true;
    for (var i = 0; i < ams.length; i++) {
      var toAdd = (even) ? "evenRow" : "oddRow" ;
      root.append("<tr id='" + getTrId(ams[i], false, true) + "' class='" + toAdd + "'><td class='tableFirstCol'>" + ams[i] + " AM</td></tr>");
      root.append("<tr id='" + getTrId(ams[i], true, true) + "' class='halfRow " + toAdd + "'><td></td></tr>");
      even = !even;
    }
    for (var i = 0; i < pms.length; i++) {
      var toAdd = (even) ? "evenRow" : "oddRow" ;
      root.append("<tr id='" + getTrId(pms[i], false, false) + "' class='" + toAdd + "'><td class='tableFirstCol'>" + pms[i] + " PM</td></tr>");
      root.append("<tr id='" + getTrId(pms[i], true, false) + "' class='halfRow " + toAdd + "'><td></td></tr>");
      even = !even;
    }

    if (thisx.ttype < 2) {
      var today = new Date();
      if (ttype == 0) {
        today.setDate(today.getDate() - 7 + 1); // set to the beginning of the week
      }
      thisx.startDay = new Date(today);

      for (var i = 0; i < 35; i++) {
        thisx.addCol(today.getDate(), today.getMonth() + 1, today.getYear() + 1900);
        today = addDays(today, 1);
      }

      thisx.nextDay = today;
    } else {
      var today = new Date("Sun Jan 21 2216 21:51:13 GMT-0800 (PST)");
      //today.setDate(today.getDate() + (6 - today.getDay()) + 73001); // set to the beginning of the week
      thisx.startDay = new Date(today);

      for (var i = 0; i < 7; i++) {
        thisx.addCol(today.getDate(), today.getMonth() + 1, today.getYear() + 1900);
        today = addDays(today, 1);
      }

      thisx.nextDay = today;
    }

    if (ttype == 0) {
      thisx.showEditButton();
    }

    thisx.clear();
    thisx.handlers();

    // thisx.currentWeek();
    if (thisx.ttype == 0) {
      thisx.interactMode(true);
    } else {

      thisx.editMode();
    }
    
    thisx.loadVisable();
  }

  this.addDefaults = function() {
    self = this;

    var se = new Date("Sun Jan 21 2216 21:51:13 GMT-0800 (PST)");
    se.setDate(se.getDate() - 1);
    var de = new Date("Sun Jan 21 2216 21:51:13 GMT-0800 (PST)");
    de.setDate(de.getDate() + 10);


    $.post("/cal", {"get":true, "daystart": se.toString(), "dayend": de.toString(), "def": true}, function(data) {
      if (data.error) {
        $("#homeScreen").show();
        //console.log(data.error);
      } else {
        var curr = new Date();
        curr.setDate(curr.getDate() + 2);
        for (var k = 1; k < parseInt($("#" + self.id + "NumDays").val()); k++) {
          for (var i = 0; i < data.cals.length; i++) {
            if (data.cals[i].cval1 == curr.getDay()) { // add this day
              for (var j = data.cals[i].cval2start; j <= data.cals[i].cval2end; j++) {
                self.shade(self.tcells[ self.getTDid(new Date(curr), j) ], j == data.cals[i].cval2start);
              }
            }
            
          } 
          curr.setDate(curr.getDate() + 1);
        }
      }
      if (self.mode == 0) {
        self.clearServerCalendar();
      }

      $("#" + self.id + "DefaultButton").text("ADDED");
      $("#" + self.id + "DefaultButton").attr("disabled", "true");
    });
  }

  this.defaultDaysChanged = function() {
    $("#" + this.id + "DefaultButton").text("ADD");
    $("#" + this.id + "DefaultButton").removeAttr("disabled");
  }

  this.loadVisable = function() {
    self = this;
    var se = new Date(this.startDay);
    se.setDate(se.getDate() - 1);
    var de = new Date(this.nextDay);
    de.setDate(de.getDate() - 1);
    $.post("/cal", {"get":true, "daystart": se.toString(), "dayend": de.toString(), "def": (this.ttype == 2)}, function(data) {
      if (data.error) {
        $("#homeScreen").show();
        //console.log(data.error);
      } else {
        for (var i = 0; i < data.cals.length; i++) {
          for (var j = data.cals[i].cval2start; j <= data.cals[i].cval2end; j++) {
            self.shade(self.tcells[ self.getTDid(new Date(data.cals[i].day), j) ], j == data.cals[i].cval2start);
          }
        } 
      }
      
    });
  }

  this.loadAnotherWeek = function() {
    var today = this.nextDay;

    var todaybq = new Date(today);
    todaybq.setDate(todaybq.getDate() - 1);
    for (var i = 0; i < 7; i++) {
      this.addCol(today.getDate(), today.getMonth() + 1, today.getYear() + 1900);
      today = addDays(today, 1);
    }
    this.nextDay = today;


    self = this;
    $.post("/cal", {"get":true, "daystart": todaybq.toString(), "dayend": this.nextDay.toString(), "def": (this.ttype == 2)}, function(data) {
      if (data.error) {
        console.log(error);
      } else {
        console.log(data);
        
        for (var i = 0; i < data.cals.length; i++) {
          for (var j = data.cals[i].cval2start; j <= data.cals[i].cval2end; j++) {

            self.shade(self.tcells[ self.getTDid(new Date(data.cals[i].day), j) ], j == data.cals[i].cval2start);
          }
        } 
      }
      
    });
  }

  this.showEditButton = function() {

  }

  this.pageEntered = function() {
    var s = $('.scrollable #' + this.id).parent();
    s.scrollLeft(0);
    if (ttype != 2) {
      var scrollamt = $(".current_" + this.id).offset().left - 60;
      s.scrollLeft(scrollamt);
    } else {
      // default calendar
      $("#" + this.id + "_backButton").hide();
      this.clear();
    }


    this.initScrollSync();

    this.loadVisable();
  }

  this.initScrollSync = function () {
    var s = $('.scrollable #' + this.id).parent();

    s.attr("onscroll", this.varname + ".checkForward()");
    $('.scrollable #' + this.id + "Header").parent().attr("onscroll", this.varname + ".checkForward(true)");
    
  }

  this.next = function() {
    var s = $('.scrollable #' + this.id).parent();
    var ol = s.scrollLeft()
    s.scrollLeft(0);
    s.scrollLeft( ol  + $(window).width() - 60 );

    this.checkForward();
  }

  this.scrollMutex = false;

  // makes sure as enough forward.
  this.checkForward = function(alt) {
    if (!this.scrollMutex) {
      this.scrollMutex = true;
      var s = $('.scrollable #' + this.id).parent();
      if (alt) {
        s = $('.scrollable #' + this.id + "Header").parent();
      }
      var se = s[0];
      if (s.scrollLeft() >= se.scrollWidth - (se.clientWidth * 2) && this.ttype < 2 ) {
        this.loadAnotherWeek();
      } else {
        if (s.scrollLeft() + $(window).width() >= s[0].scrollWidth - 10) {
          $("#" + this.id + "_nextButton").hide();
        } else {
          $("#" + this.id + "_nextButton").show();
        }
      }
      if (s.scrollLeft() <= 10) {
        $("#" + this.id + "_backButton").hide();
      } else {
        $("#" + this.id + "_backButton").show();
      }
      var sh = $('.scrollable #' + this.id + "Header").parent();
      if (alt) {
        sh = $('.scrollable #' + this.id).parent();
      }
      var she = s[0];
      sh.scrollLeft(s.scrollLeft());


    }
    this.scrollMutex = false;
  }

  this.back = function() {
    var s = $('.scrollable #' + this.id).parent();
    var ol = s.scrollLeft()
    s.scrollLeft(0);
    s.scrollLeft( ol - ($(window).width() - 60) );
  }

  init(this);
 
}


/*

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
*/
