'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//------main app
//ToDo: nicht nur fuer Jahr 2022 = testen
//toDo: events anzeigen richtiger Monat = ok
//toDo: nur 3 Events; ab 4 ein + mit anzeige aller Events fuer den Tag
//ToDo: Events loeschen
//toDo: Manuele Events hinzufuegen, so dass diese bleiben
//toDo: Feiertage durch api importieren: https://feiertage-api.de/ = fertig
//toDo: Feiertage fuer jahr und Bundestag aussuchen; momentag nur feiertage BW 2022
//toDo: Button Add TestEvents macht komisches zeugs: nach 10 mal: Daten dauerhaft im Kalender

//1)Component: Liste aus allen Events andrucken OK
//2)Liste aus Click auf Datum erstellen
//3)loeschen der Events OK
//4) neues Event / Termin erstellen ok
//5) Terminliste uaf null setzen bei Monatswechsel
//6) fuer Jahre 2021 und 2023 etc
//7) Feiertage nicht löschbar machen
//8) events im Kalender nicht clickbar machen
//9)bei wechsel Monat Termine in TERMIN AM TAG wieder nullen


var KalenderEvents = function () {
  function KalenderEvents() {
    _classCallCheck(this, KalenderEvents);

    this.eventList = [];
    this.kalenderEvent = {
      'eventYear': 0,
      'eventMonth': 0,
      'eventDay': 0,
      'eventText': "",
      'eventkey': ""
    };
  }

  _createClass(KalenderEvents, [{
    key: 'addEvent',
    value: function addEvent(eventYear, eventMonth, eventDay, eventText) {
      this.kalenderEvent.eventYear = eventYear;
      this.kalenderEvent.eventMonth = eventMonth;
      this.kalenderEvent.eventDay = eventDay;
      this.kalenderEvent.eventText = eventText;
      this.kalenderEvent.eventkey = eventText;
      //add to List
      this.eventList.push(this.kalenderEvent);
    }
  }, {
    key: 'addTestEvents',
    value: function addTestEvents() {
      this.addEvent(2022, 5, 6, "EVENT 5 MAI");
      this.addEvent(2022, 10, 8, "EVENT 10 MAI");
    }
  }]);

  return KalenderEvents;
}();

var KalenderSub = function (_React$Component) {
  _inherits(KalenderSub, _React$Component);

  function KalenderSub(props) {
    _classCallCheck(this, KalenderSub);

    var _this = _possibleConstructorReturn(this, (KalenderSub.__proto__ || Object.getPrototypeOf(KalenderSub)).call(this, props));

    _this.state = {
      tmpUpdateGUI: 0,
      dateToday: new Date(),
      choosenDate: new Date(),
      choosenYear: -1,
      choosenMonth: -1,
      weekDayFirstofMonth: -1,
      daysOfMonth: [1],
      weekdayName: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
      monthNameList: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"], //Januar = 0
      monthName: ["Monat 0"],
      eventListKalenderAll: [], //enthaelt objecte von Klasse Kalendervent
      eventListKalender: [], //enthaelt objecte von Klasse Kalendervent nur fuer Monat x
      eventListChoosenDay: [],
      holiDays: [],
      clickedDayDate: "x"
    };
    _this.jumpToLastMonth = _this.jumpToLastMonth.bind(_this);
    _this.jumpToNextMonth = _this.jumpToNextMonth.bind(_this);
    _this.addNewEventToKalender = _this.addNewEventToKalender.bind(_this);
    _this.deleteEventFromKalender = _this.deleteEventFromKalender.bind(_this);
    _this.openEventFromDay = _this.openEventFromDay.bind(_this);
    _this.addNewEventToKalenderBtn = _this.addNewEventToKalenderBtn.bind(_this);
    //TESTEVENTS
    _this.addTestEvents = _this.addTestEvents.bind(_this);
    return _this;
  }

  //TEST bei componentDidMount() entfernen


  _createClass(KalenderSub, [{
    key: 'addTestEvents',
    value: function addTestEvents() {
      var tmpEvent = new KalenderEvents();
      tmpEvent.addEvent(2022, 5, 20, "test Juni a20");
      this.state.eventListKalenderAll.push(tmpEvent.kalenderEvent);

      tmpEvent = new KalenderEvents();
      tmpEvent.addEvent(2022, 6, 4, "test Juli a4"); //Januar = 0, Juli = 6
      this.state.eventListKalenderAll.push(tmpEvent.kalenderEvent);

      tmpEvent = new KalenderEvents();
      tmpEvent.addEvent(2022, 7, 8, "test August a8");
      this.state.eventListKalenderAll.push(tmpEvent.kalenderEvent);

      tmpEvent = new KalenderEvents();
      tmpEvent.addEvent(2022, 10, 1, "TeEVENT ad1");
      this.state.eventListKalenderAll.push(tmpEvent.kalenderEvent);

      tmpEvent = new KalenderEvents();
      tmpEvent.addEvent(2022, 4, 30, "test Mai a30");
      this.state.eventListKalenderAll.push(tmpEvent.kalenderEvent);

      console.log("added 3 new Test Events: ", this.state.eventListKalenderAll[0].eventText);
      // this.filterMonthEventsForGUI();
    }

    //Feiertage laden und in this.state.holiDays abspeichern

  }, {
    key: 'getHolidays',
    value: function getHolidays() {
      var _this2 = this;

      var holidays = void 0;
      fetch('https://feiertage-api.de/api/?jahr=2022&nur_land=BW').then(function (response) {
        return response.json();
      }).then(function (data) {
        return holidays = data;
      }).then(function () {
        return _this2.state.holiDays = holidays;
      }).then(function () {
        return _this2.addHolidaysToKalender();
      }).catch(function (err) {
        console.log("Error im Fetch ", err);
      });
      // console.log("Meine Daten: ", this.state.holiDays) //DEBUG
    }

    //gespeicherte Feiertage in class KalenderEvents umwandeln

  }, {
    key: 'addHolidaysToKalender',
    value: function addHolidaysToKalender() {
      this.convertToKalenderEvents(this.state.holiDays);
      // console.log("Meine Feiertage im Kalender: ",this.state.holiDays) //DEBUG
    }
  }, {
    key: 'convertToKalenderEvents',
    value: function convertToKalenderEvents(json_data) {
      //wichtege Methode
      var tmpEvents = [];
      var eventText = [];
      var eventDate = [];
      //---Plaziere JSON Objekte in Arrays
      eventText = Object.keys(json_data).map(function (key) {
        return key;
      });
      // console.log("my eventText ", eventText) //DEBUG
      eventDate = Object.keys(json_data).map(function (key) {
        return json_data[key].datum;
      });
      // console.log("my eventDate ",eventDate) //DEBUG
      //---erstelle this.state.holiDays Array fuer weitere Verarbeitungen
      var newEventsLengt = eventDate.length;
      for (var i = 0; i < newEventsLengt; i++) {
        var tmpKalenderEvent = new KalenderEvents();
        var eventYear = eventDate[i].substring(0, 4);
        var eventMonth = eventDate[i].substring(5, 7);
        var eventDay = eventDate[i].substring(8, 10);
        tmpKalenderEvent.addEvent(eventYear, eventMonth, eventDay, eventText[i]);
        tmpEvents.push(tmpKalenderEvent.kalenderEvent);
      }
      // console.log("Final Ferien Events nach JSON: ", tmpEvents) //DEBUG
      this.state.holiDays = tmpEvents;
      //---Ferien Eventliste zum andrucken hinzufuegen
      newEventsLengt = this.state.holiDays.length;
      for (var _i = 0; _i < newEventsLengt; _i++) {
        var _tmpKalenderEvent = new KalenderEvents();
        var _eventYear = parseInt(this.state.holiDays[_i].eventYear);
        var _eventMonth = parseInt(this.state.holiDays[_i].eventMonth);
        var _eventDay = parseInt(this.state.holiDays[_i].eventDay);
        var _eventText = this.state.holiDays[_i].eventText;
        _tmpKalenderEvent.addEvent(_eventYear, _eventMonth - 1, _eventDay, _eventText); //Monat - 1, da Monate bei 0 anfangen
        this.state.eventListKalenderAll.push(_tmpKalenderEvent.kalenderEvent);
      }
      // console.log("Inahlt eventListKalenderAll: ", this.state.eventListKalenderAll); //DEBUG
      this.updateKalender(); //GUI Updaten
    }

    //-----------Kalender beim start mit Tagesdatum laden-----------------

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.state.choosenDate = this.state.dateToday;
      this.state.choosenYear = this.state.dateToday.getFullYear();
      this.state.choosenMonth = this.state.dateToday.getMonth();
      //TESTCODE
      this.addTestEvents();
      //TESTCODE ENDE
      this.updateKalender();
      this.getHolidays();
    }

    //holle nur Events fuer ausgewaehlten Monat aus Liste aller Events

  }, {
    key: 'filterMonthEventsForGUI',
    value: function filterMonthEventsForGUI() {
      // console.log("AUSGABE this.state.eventListKalenderAll: ", this.state.eventListKalenderAll)
      //1) nimm alle Events / Termine fuer den gewaelten Monat
      for (var i = 0; i < this.state.eventListKalenderAll.length; i++) {
        var choosenYear = this.state.choosenYear;
        var choosenMonth = this.state.choosenMonth;
        if (choosenYear == this.state.eventListKalenderAll[i].eventYear && choosenMonth == this.state.eventListKalenderAll[i].eventMonth) {
          // console.log("event year",choosenYear ," event month ",choosenMonth ) //DEBUG
          this.state.eventListKalender.push(this.state.eventListKalenderAll[i]);
        }
      }
      //2) sobald mehr als 4 Events fuer Tag: mache Event 4 zu: + x weitere events
      //a1 uber pop un push raussortieren
      this.state.eventListKalender.sort(function (a, b) {
        return a.eventDay - b.eventDay;
      });
      console.log("sortiert ", this.state.eventListKalender);
      // let eventListKalenderlength = this.state.eventListKalender.length;
      // //element 0 und 1 falls vorhanden
      // let tmpeventDayA = this.state.eventListKalender;
      // let tmpeventDayB = [];
      // //erstes element pushen
      // tmpeventDayB.push(tmpeventDayA[0]);
      // let numberOfDayEventElements = 1;
      // console.log("tmpeventDayB start ",tmpeventDayB)
      // //fahre fort mit algorithmus ab element 2
      // for(let i = 0; i < eventListKalenderlength-1; i++){
      //   if(tmpeventDayA[i].eventDay == tmpeventDayA[i+1].eventDay ){
      //     numberOfDayEventElements++; //one more event on day X
      //     //wenn weniger als 4, dann Text
      //     if(numberOfDayEventElements < 3){
      //       tmpeventDayB.push(tmpeventDayA[i+1]);
      //       console.log("mehr als 4")
      //     }else{ //mehr als 3
      //       let tmp1 = this.state.eventListKalender; //debugzeile
      //       tmpeventDayB.push(tmpeventDayA[i+1]);
      //       // tmpeventDayB[i+1].eventText = "+ x weitere Events"
      //       console.log("no ", i+1,tmpeventDayB[i+1].eventText )
      //       let tmp2 = this.state.eventListKalender; //debugzeile
      //     }
      //   } else {
      //     tmpeventDayB.push(tmpeventDayA[i+1]);
      //     numberOfDayEventElements = 0; //reset
      //   }
      //   console.log("i ", i, " elements ",numberOfDayEventElements)
      // }

      // console.log("tmpeventDayB fertig ",tmpeventDayB) //Debugzeile
      // console.log("this.state.eventListKalender fertig ",this.state.eventListKalender) //Debugzeile
      var tmp = this.state.eventListKalender; //debugzeile
    }
  }, {
    key: 'deleteEventFromKalender',
    value: function deleteEventFromKalender(clickedDateEventList) {
      var confirmText = "Termin: " + clickedDateEventList.eventText + " löschen?";
      if (confirm(confirmText)) {
        //loesche aus ListeAll
        var tmpeventListKalenderAll = this.state.eventListKalenderAll;
        var indexToDelete = [];
        indexToDelete = tmpeventListKalenderAll.findIndex(function (tmpeventListKalenderAll) {
          return clickedDateEventList.eventDay == tmpeventListKalenderAll.eventDay && clickedDateEventList.month == tmpeventListKalenderAll.month && clickedDateEventList.eventYear == tmpeventListKalenderAll.eventYear && clickedDateEventList.eventText == tmpeventListKalenderAll.eventText;
        });
        console.log("allEvents", this.state.eventListKalenderAll, "ChossenEvents ", clickedDateEventList, " selected event", indexToDelete, "deleted");
        this.state.eventListKalenderAll.splice(indexToDelete, 1); //Event loeschen
        console.log("allEvents nachdem geloescht", this.state.eventListKalenderAll);
        //Update aktueller Monat
        this.updateKalender();
        //Update ausgewaelter Tag
        this.addNewEventToKalender(this.state.clickedDayDate);
      } else {
        //do nothing
      }
    }
  }, {
    key: 'addNewEventToKalenderBtn',
    value: function addNewEventToKalenderBtn() {
      var clickedDate = this.state.clickedDayDate;
      console.log("addNewEventToKalender ", clickedDate);
      var eventInput = window.prompt("Neues Event hinzufügen");
      console.log("new event: ", eventInput, " clicked Date ", clickedDate);
      if (eventInput != null && eventInput != '') {
        var tmpEvent = new KalenderEvents();
        tmpEvent.addEvent(2022, this.state.choosenMonth, clickedDate, eventInput);
        this.state.eventListKalenderAll.push(tmpEvent.kalenderEvent); //dauerhaft speichern
        this.state.eventListKalender.push(tmpEvent.kalenderEvent); //damit direkt angedruckt wird
        //Update GUI
        this.setState({ tmpUpdateGUI: 1 });
        this.setState({ tmpUpdateGUI: 0 });
        this.openEventsOfChosenDay(clickedDate);
      }
      // this.state.clickedDayDate = clickedDate;
      // console.log("debug addNewEventToKalender ade:",this.state.eventListKalender); // Debug
    }
  }, {
    key: 'addNewEventToKalender',
    value: function addNewEventToKalender(clickedDate) {
      // console.log("addNewEventToKalender ",clickedDate);
      // let eventInput = window.prompt("Neues Event hinzufügen");
      // console.log("new event: ", eventInput, " clicked Date ", clickedDate);
      // if(eventInput !=""){
      //   let tmpEvent = new KalenderEvents();
      //   tmpEvent.addEvent(2022,this.state.choosenMonth,clickedDate,eventInput);
      //   this.state.eventListKalenderAll.push(tmpEvent.kalenderEvent); //dauerhaft speichern
      //   this.state.eventListKalender.push(tmpEvent.kalenderEvent); //damit direkt angedruckt wird
      //   //Update GUI
      //   this.setState({tmpUpdateGUI: 1});
      //   this.setState({tmpUpdateGUI: 0});
      // }
      this.state.clickedDayDate = clickedDate;
      // console.log("debug addNewEventToKalender ade:",this.state.eventListKalender); // Debug
      this.openEventsOfChosenDay(clickedDate);
    }
  }, {
    key: 'openEventsOfChosenDay',
    value: function openEventsOfChosenDay(clickedDate) {
      this.state.eventListChoosenDay = [];
      var tmpEventList = [];
      var tmpEventElementsLenght = this.state.eventListKalender.length;
      //Events aus Monat fuer ausgewaelten Tag auswaehlen
      for (var i = 0; i < tmpEventElementsLenght; i++) {
        if (this.state.eventListKalender[i].eventDay == clickedDate) {
          tmpEventList.push(this.state.eventListKalender[i]);
        }
      }
      this.state.eventListChoosenDay = tmpEventList;
      console.log("debug events all: ", tmpEventElementsLenght, this.state.eventListKalender, "tmp ", tmpEventList, "tmp zum Adnsruck:", this.state.eventListChoosenDay); // Debug
      // console.log("debug events of chosen Day: ", tmpEventElementsLenght ,this.state.eventListKalender , tmpEventList); // Debug
      this.updateKalender();
    }
  }, {
    key: 'openEventFromDay',
    value: function openEventFromDay(clickedEventId) {
      window.prompt(clickedEventId);
      console.log("event:_ ", clickedEventId, " _was clicked");
    }
  }, {
    key: 'jumpToLastMonth',
    value: function jumpToLastMonth() {
      console.log("last Month");
      this.state.choosenMonth = this.state.choosenMonth - 1;
      this.updateKalender();
    }
  }, {
    key: 'jumpToNextMonth',
    value: function jumpToNextMonth() {
      console.log("next Month");
      this.state.choosenMonth = this.state.choosenMonth + 1;
      this.updateKalender();
    }
  }, {
    key: 'updateKalender',
    value: function updateKalender() {
      this.state.eventListKalender = []; //delete old events
      this.filterMonthEventsForGUI();
      //Paramaeter Tagesdatum
      var date = this.state.choosenDate;
      var choosenMonth = this.state.choosenMonth;
      //Parameter Datum fuer Anzeige
      var monthDate = new Date(date.getFullYear(), choosenMonth, 1);
      var firstOfMonth = new Date(date.getFullYear(), choosenMonth, 1);
      var lastOfMonth = new Date(date.getFullYear(), choosenMonth + 1, 0);
      var weekDayFirst = firstOfMonth.getDay(); //Nur Wochentag 0 - 6; So - Sa
      var monthLengh = lastOfMonth.getDate();
      //**** Debug
      // console.log("Tagesdatum", date, " Wochentag ", date.getDay(), " MonatLänge ", date.getDate());  //Testausgabe
      // console.log("Datum ausgesucht monthDate ", monthDate, "monthLengh ", monthLengh, "erster Wochentag im Monat", weekDayFirst);
      // console.log("erster eines Monats firstOfMonth",firstOfMonth ,"erster Wochentag im Monat", weekDayFirst);
      //**** Algorithmus Monat ausfuellen
      //---fuelle ersten Tage im Monat mit Buffer
      var numberDaysMonth = [];
      //erste Tage, die nicht zum Monat gehoeren; bei weekDayFirst = 0 = Sonntag: fuege Puffertage hinzufuegen
      var pufferFirstDaysOfMonth = weekDayFirst;
      if (weekDayFirst == 0) {
        pufferFirstDaysOfMonth = 7;
      }
      for (var i = 1; i < pufferFirstDaysOfMonth; i++) {
        //fuelle Tage, die nicht zum Monat gehoeren auf
        var key = i * -1; //to Do,
        numberDaysMonth.push(key);
      }
      // fuege Datumstage im Monat auf
      for (var _i2 = 1; _i2 <= monthLengh; _i2++) {
        numberDaysMonth.push(_i2);
      }
      //Monatsname
      this.setState({ daysOfMonth: [1] });
      this.setState({ daysOfMonth: numberDaysMonth });
      var month = monthDate.getMonth();
      this.state.monthName = this.state.monthNameList[month];
    }
    //-----------render-----------------

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return React.createElement(
        'div',
        { id: 'page-container' },
        React.createElement(
          'div',
          { id: 'chooseMonthBtns' },
          React.createElement(
            'button',
            { onClick: function onClick() {
                return _this3.jumpToLastMonth();
              } },
            ' vorheriger Monat '
          ),
          React.createElement(
            'button',
            { onClick: function onClick() {
                return _this3.jumpToNextMonth();
              } },
            ' n\xE4chster Monat '
          )
        ),
        React.createElement(DateBox, {
          monthName: this.state.monthName,
          year: this.state.choosenYear,
          weekdayName: this.state.weekdayName,
          dateNumber: this.state.daysOfMonth,
          eventListKalender: this.state.eventListKalender
          // dateElementClicked={ (clickedDate) => clickedDate > 0  ? this.addNewEventToKalender(clickedDate) : console.log("no")    }
          , dateElementClicked: function dateElementClicked(clickedDate) {
            return clickedDate > 0 ? _this3.addNewEventToKalender(clickedDate) : console.log("no");
          }
          // eventElementClicked = {(clickedEventFromDay) => this.openEventFromDay(clickedEventFromDay)}
          , eventElementClicked: function eventElementClicked(clickedEventFromDay) {
            return '';
          },
          eventListChoosenDay: this.state.eventListChoosenDay,
          clickedDayDate: this.state.clickedDayDate
          // choosenElementToDelete = {this.deleteEventFromKalender(1)}
          , choosenElementToDelete: function choosenElementToDelete(choosenEventObject) {
            return _this3.deleteEventFromKalender(choosenEventObject);
          }
          // addNewEventToKalenderBtn = {() => this.addNewEventToKalenderBtn()}
          , addNewEventToKalenderBtn: function addNewEventToKalenderBtn() {
            return _this3.addNewEventToKalenderBtn();
          }
        })
      );
    }
  }]);

  return KalenderSub;
}(React.Component);

//***************************************************/
//-----------Components-----------------
//-----------Kalender Monat links / Events rechts-----------------


var DateBox = function DateBox(_ref) {
  var year = _ref.year,
      monthName = _ref.monthName,
      weekdayName = _ref.weekdayName,
      dateNumber = _ref.dateNumber,
      eventListKalender = _ref.eventListKalender,
      dateElementClicked = _ref.dateElementClicked,
      eventElementClicked = _ref.eventElementClicked,
      eventListChoosenDay = _ref.eventListChoosenDay,
      clickedDayDate = _ref.clickedDayDate,
      choosenElementToDelete = _ref.choosenElementToDelete,
      addNewEventToKalenderBtn = _ref.addNewEventToKalenderBtn;

  return React.createElement(
    'div',
    { id: 'kalender-container' },
    React.createElement(
      'div',
      { id: 'month-container' },
      React.createElement(
        'div',
        { id: 'monthName-container' },
        React.createElement(
          'div',
          { id: 'month-name' },
          ' ',
          year,
          ' ',
          React.createElement('br', null),
          ' ',
          monthName
        )
      ),
      React.createElement(
        'div',
        { id: 'weekdayName-container' },
        React.createElement(WeekDayBox, { data: weekdayName, elementClicked: function elementClicked() {
            return '';
          } })
      ),
      React.createElement(
        'div',
        { id: 'monthDateNumber-container' },
        React.createElement(DayBox, {
          dateNumber: dateNumber,
          eventListKalender: eventListKalender,
          elementClicked: dateElementClicked,
          eventElementClicked: eventElementClicked
        })
      )
    ),
    React.createElement(
      'div',
      { id: 'eventList-container' },
      'Termine am Tag ',
      clickedDayDate,
      React.createElement(
        'button',
        { id: 'addNewEventBtn', onClick: addNewEventToKalenderBtn },
        ' neuen Termin hinzuf\xFCgen '
      ),
      React.createElement(EventListManagment
      // data = {weekdayName}  
      , { data: eventListChoosenDay
        // elementClicked={choosenElementToDelete}
        , elementClicked: choosenElementToDelete
      })
    )
  );
};

//rechts Events andrucken

var EventListManagment = function (_React$Component2) {
  _inherits(EventListManagment, _React$Component2);

  function EventListManagment() {
    _classCallCheck(this, EventListManagment);

    return _possibleConstructorReturn(this, (EventListManagment.__proto__ || Object.getPrototypeOf(EventListManagment)).apply(this, arguments));
  }

  _createClass(EventListManagment, [{
    key: 'placeDays',
    value: function placeDays(props) {
      //DayElements
      var myObject = props.data;
      // const listItems = (() =>
      //       <button className="day-container" id={"1"} key={"1"} onClick={() => props.click(1)} value={"1"} > 
      //       asd
      //       </button>
      //     );
      var listItems = myObject.map(function (myObject) {
        return React.createElement(
          'button',
          { className: 'day-container', id: myObject.eventText.toString(), key: myObject.eventkey.toString(), onClick: function onClick() {
              return props.click(myObject);
            }, value: myObject.eventText.toString() },
          myObject.eventkey.toString()
        );
      });

      return React.createElement(
        'ul',
        null,
        listItems
      );
    }
    //-----------render Day Box-----------------

  }, {
    key: 'render',
    value: function render() {
      return React.createElement(this.placeDays, { data: this.props.data, click: this.props.elementClicked });
    }
  }]);

  return EventListManagment;
}(React.Component);

//----------links LV 1 Tagesbox


var DayBox = function (_React$Component3) {
  _inherits(DayBox, _React$Component3);

  function DayBox() {
    _classCallCheck(this, DayBox);

    return _possibleConstructorReturn(this, (DayBox.__proto__ || Object.getPrototypeOf(DayBox)).apply(this, arguments));
  }

  _createClass(DayBox, [{
    key: 'placeDays',
    value: function placeDays(props) {
      //DayElements
      var numbers = props.dateNumber;

      //Aufbereitung Eventlist von Objekt zu Array, um andrucke zu koennen
      var eventListObject = props.eventList;
      //Array fuer Events im Monat = große ca. 50, da max 50 Tage angedruckt werden
      var eventListArray = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
      // const eventListArray = new Array(1).fill(null).map(()=>new Array(50));
      // console.log("testEventA eventListArray: ", eventListArray)
      // console.log("testEventA Objekt: ", eventListObject)
      //1: rufe Array fuer Tax x auf

      eventListObject.map(function (eventDay) {
        // let testEventDay = eventDay.eventDay;
        // console.log("testEventB Array: ", eventDay.eventText, " der TESTESR", testEventDay)
        // let a ={text: eventDay.eventText}
        // console.log("testEventObjekt a:", a)
        eventListArray[eventDay.eventDay].push(eventDay);
        // eventListArray.push(a);
      });
      // console.log("eventListArray 2D:", eventListArray[1])

      //Kalenderboxen
      var listItems = numbers.map(function (number) {
        return React.createElement(
          'div',
          { className: 'day-container' },
          React.createElement(
            'div',
            { id: 'btn-Container' },
            React.createElement(
              'button',
              { className: 'dayNo', id: number.toString(), key: number.toString(), onClick: function onClick() {
                  return props.click(number);
                }, value: number.toString() },
              number.toString()
            )
          ),
          React.createElement(
            'div',
            { id: 'event-Container' },
            React.createElement(EventDayBox, {
              data: typeof eventListArray[number] !== 'undefined' ? eventListArray[number] : ["alter Monat"],
              eventElementClicked: props.eventElementClicked
              // eventListToArray ={props.eventList}
            })
          )
        );
      });

      return React.createElement(
        'ul',
        null,
        listItems
      );
    }
    //-----------render Day Box-----------------

  }, {
    key: 'render',
    value: function render() {
      return React.createElement(this.placeDays, {
        dateNumber: this.props.dateNumber,
        eventList: this.props.eventListKalender
        // click={this.props.elementClicked}
        , click: this.props.elementClicked,
        eventElementClicked: this.props.eventElementClicked
      });
    }
  }]);

  return DayBox;
}(React.Component);

//------------LV 2 EVENTS auf Tagesebene


var EventDayBox = function (_React$Component4) {
  _inherits(EventDayBox, _React$Component4);

  function EventDayBox() {
    _classCallCheck(this, EventDayBox);

    return _possibleConstructorReturn(this, (EventDayBox.__proto__ || Object.getPrototypeOf(EventDayBox)).apply(this, arguments));
  }

  _createClass(EventDayBox, [{
    key: 'placeDays',
    value: function placeDays(props) {
      //DayElements
      var eventNamer = props.data;
      //--------hier Code Events pro Tag
      // const test = props.eventListToArray
      // console.log("ganz unten auf lv Liste Events:", props.eventListToArray) //DEBUG
      //--------hier Code Events pro Tag ENDE

      var listItems = eventNamer.map(function (eventNames) {
        return React.createElement(
          'button',
          { className: 'dayEvent-container', id: eventNames.toString(), key: eventNames.eventkey, onClick: function onClick() {
              return props.click(eventNames);
            }, value: eventNames.toString() },
          eventNames.eventText
        );
      });
      return React.createElement(
        'ul',
        null,
        listItems
      );
    }
    //-----------render eventName Box-----------------

  }, {
    key: 'render',
    value: function render() {
      return React.createElement(this.placeDays, { data: this.props.data, click: this.props.eventElementClicked });
    }
  }]);

  return EventDayBox;
}(React.Component);

//------------LV 1 Wochentage Namen


var WeekDayBox = function (_React$Component5) {
  _inherits(WeekDayBox, _React$Component5);

  function WeekDayBox() {
    _classCallCheck(this, WeekDayBox);

    return _possibleConstructorReturn(this, (WeekDayBox.__proto__ || Object.getPrototypeOf(WeekDayBox)).apply(this, arguments));
  }

  _createClass(WeekDayBox, [{
    key: 'placeDays',
    value: function placeDays(props) {
      //DayElements
      var numbers = props.data;
      var listItems = numbers.map(function (number) {
        return (
          // <button className="day-container" id={number.toString()} key={number.toString()} onClick={() => props.click(number)} value={number.toString()} > 
          React.createElement(
            'button',
            { className: 'day-container', id: number.toString(), key: number.toString(), value: number.toString() },
            number.toString()
          )
        );
      });
      return React.createElement(
        'ul',
        null,
        listItems
      );
    }
    //-----------render Day Box-----------------

  }, {
    key: 'render',
    value: function render() {
      return React.createElement(this.placeDays, { data: this.props.data, click: this.props.elementClicked });
    }
  }]);

  return WeekDayBox;
}(React.Component);

//***************************************************/
//-----------For HTML Output-----------------


var KalenderMain = function KalenderMain() {
  return React.createElement(
    'div',
    { id: 'main-box-Get7' },
    React.createElement(KalenderSub, null)
  );
};

ReactDOM.render(React.createElement(KalenderMain, null), document.getElementById('Kalender'));