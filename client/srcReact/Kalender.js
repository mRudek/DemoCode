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


class KalenderEvents{
  constructor(){
    this.eventList = [];
    this.kalenderEvent={
      'eventYear': 0,
      'eventMonth': 0,
      'eventDay': 0,
      'eventText':"",
      'eventkey': ""
    }
  }

  addEvent(eventYear,eventMonth,eventDay,eventText){
    this.kalenderEvent.eventYear = eventYear;
    this.kalenderEvent.eventMonth = eventMonth;
    this.kalenderEvent.eventDay = eventDay;
    this.kalenderEvent.eventText = eventText;
    this.kalenderEvent.eventkey = eventText;
    //add to List
    this.eventList.push(this.kalenderEvent);
  }

  addTestEvents(){
    this.addEvent(2022,5,6 ,"EVENT 5 MAI");
    this.addEvent(2022,10,8,"EVENT 10 MAI");  
  }
}

class KalenderSub extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      tmpUpdateGUI: 0,
      dateToday: new Date(),
      choosenDate: new Date(),
      choosenYear: -1,
      choosenMonth: -1,
      weekDayFirstofMonth: -1,
      daysOfMonth: [1],
      weekdayName:["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
      monthNameList:["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"], //Januar = 0
      monthName:["Monat 0"],
      eventListKalenderAll: [], //enthaelt objecte von Klasse Kalendervent
      eventListKalender: [], //enthaelt objecte von Klasse Kalendervent nur fuer Monat x
      eventListChoosenDay: [],
      holiDays:[],
      clickedDayDate: "x"
    }
    this.jumpToLastMonth = this.jumpToLastMonth.bind(this);
    this.jumpToNextMonth = this.jumpToNextMonth.bind(this);
    this.addNewEventToKalender = this.addNewEventToKalender.bind(this);
    this.deleteEventFromKalender = this.deleteEventFromKalender.bind(this);
    this.openEventFromDay = this.openEventFromDay.bind(this);
    this.addNewEventToKalenderBtn = this.addNewEventToKalenderBtn.bind(this);
    //TESTEVENTS
    this.addTestEvents = this.addTestEvents.bind(this);
  }

  //TEST bei componentDidMount() entfernen
  addTestEvents(){
    let tmpEvent = new KalenderEvents();
    tmpEvent.addEvent(2022,5,20,"test Juni a20");
    this.state.eventListKalenderAll.push(tmpEvent.kalenderEvent);

    tmpEvent = new KalenderEvents();
    tmpEvent.addEvent(2022,6,4,"test Juli a4"); //Januar = 0, Juli = 6
    this.state.eventListKalenderAll.push(tmpEvent.kalenderEvent);

    tmpEvent = new KalenderEvents();
    tmpEvent.addEvent(2022,7,8,"test August a8");
    this.state.eventListKalenderAll.push(tmpEvent.kalenderEvent);

    tmpEvent = new KalenderEvents();
    tmpEvent.addEvent(2022,10,1,"TeEVENT ad1");
    this.state.eventListKalenderAll.push(tmpEvent.kalenderEvent);

    tmpEvent = new KalenderEvents();
    tmpEvent.addEvent(2022,4,30,"test Mai a30");
    this.state.eventListKalenderAll.push(tmpEvent.kalenderEvent);

    console.log("added 3 new Test Events: ", this.state.eventListKalenderAll[0].eventText);
    // this.filterMonthEventsForGUI();
  }

  //Feiertage laden und in this.state.holiDays abspeichern
  getHolidays(){
    let holidays;
    fetch('https://feiertage-api.de/api/?jahr=2022&nur_land=BW')
    .then(response => response.json())
    .then(data =>  holidays = data)
    .then(() => this.state.holiDays=holidays)
    .then(() => this.addHolidaysToKalender())       
    .catch(err => { console.log("Error im Fetch ",err); 
    });
    // console.log("Meine Daten: ", this.state.holiDays) //DEBUG
  }

  //gespeicherte Feiertage in class KalenderEvents umwandeln
  addHolidaysToKalender(){ 
    this.convertToKalenderEvents(this.state.holiDays);
    // console.log("Meine Feiertage im Kalender: ",this.state.holiDays) //DEBUG
  }

  convertToKalenderEvents(json_data){ //wichtege Methode
    let tmpEvents = [];
    let eventText = [];
    let eventDate = [];
    //---Plaziere JSON Objekte in Arrays
    eventText = Object.keys(json_data).map((key) =>
      key
    );    
    // console.log("my eventText ", eventText) //DEBUG
    eventDate = Object.keys(json_data).map((key) =>
    json_data[key].datum
    );
    // console.log("my eventDate ",eventDate) //DEBUG
    //---erstelle this.state.holiDays Array fuer weitere Verarbeitungen
    let newEventsLengt = eventDate.length;
    for(let i = 0; i < newEventsLengt; i++){
      let tmpKalenderEvent= new KalenderEvents();
      let eventYear = eventDate[i].substring(0,4);
      let eventMonth = eventDate[i].substring(5,7);
      let eventDay = eventDate[i].substring(8,10);
      tmpKalenderEvent.addEvent(eventYear,eventMonth,eventDay,eventText[i]);
      tmpEvents.push(tmpKalenderEvent.kalenderEvent);
    }
    // console.log("Final Ferien Events nach JSON: ", tmpEvents) //DEBUG
    this.state.holiDays = tmpEvents;
    //---Ferien Eventliste zum andrucken hinzufuegen
    newEventsLengt = this.state.holiDays.length;
    for(let i = 0; i < newEventsLengt; i++){
      let tmpKalenderEvent= new KalenderEvents();
      let eventYear = parseInt(this.state.holiDays[i].eventYear);
      let eventMonth = parseInt(this.state.holiDays[i].eventMonth);
      let eventDay = parseInt(this.state.holiDays[i].eventDay);
      let eventText = this.state.holiDays[i].eventText;
      tmpKalenderEvent.addEvent(eventYear,eventMonth-1,eventDay,eventText); //Monat - 1, da Monate bei 0 anfangen
      this.state.eventListKalenderAll.push(tmpKalenderEvent.kalenderEvent);
    }
    // console.log("Inahlt eventListKalenderAll: ", this.state.eventListKalenderAll); //DEBUG
    this.updateKalender(); //GUI Updaten
  }



  //-----------Kalender beim start mit Tagesdatum laden-----------------
  componentDidMount() {
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
  filterMonthEventsForGUI(){
    // console.log("AUSGABE this.state.eventListKalenderAll: ", this.state.eventListKalenderAll)
    //1) nimm alle Events / Termine fuer den gewaelten Monat
    for(let i = 0; i < this.state.eventListKalenderAll.length; i++){
      let choosenYear = this.state.choosenYear;
      let choosenMonth = this.state.choosenMonth;
      if(choosenYear == this.state.eventListKalenderAll[i].eventYear && choosenMonth == this.state.eventListKalenderAll[i].eventMonth){
        // console.log("event year",choosenYear ," event month ",choosenMonth ) //DEBUG
        this.state.eventListKalender.push(this.state.eventListKalenderAll[i]);
      }
    }
    //2) sobald mehr als 4 Events fuer Tag: mache Event 4 zu: + x weitere events
    //a1 uber pop un push raussortieren
    this.state.eventListKalender.sort(function(a, b){
      return a.eventDay - b.eventDay
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
    let tmp = this.state.eventListKalender; //debugzeile
  }

  deleteEventFromKalender(clickedDateEventList){
    let confirmText = "Termin: " + clickedDateEventList.eventText + " löschen?"
    if (confirm(confirmText)) {
      //loesche aus ListeAll
      let tmpeventListKalenderAll = this.state.eventListKalenderAll;
      let indexToDelete = [];
      indexToDelete = tmpeventListKalenderAll.findIndex(tmpeventListKalenderAll =>
            clickedDateEventList.eventDay == tmpeventListKalenderAll.eventDay &&
        clickedDateEventList.month == tmpeventListKalenderAll.month &&
        clickedDateEventList.eventYear == tmpeventListKalenderAll.eventYear &&  
        clickedDateEventList.eventText == tmpeventListKalenderAll.eventText
        );
      console.log("allEvents", this.state.eventListKalenderAll, "ChossenEvents ",clickedDateEventList, " selected event", indexToDelete , "deleted")
      this.state.eventListKalenderAll.splice(indexToDelete,1); //Event loeschen
      console.log("allEvents nachdem geloescht", this.state.eventListKalenderAll)
      //Update aktueller Monat
      this.updateKalender();
      //Update ausgewaelter Tag
      this.addNewEventToKalender(this.state.clickedDayDate)


    } else {
      //do nothing
    }
  }

  addNewEventToKalenderBtn(){
    let clickedDate = this.state.clickedDayDate;
    console.log("addNewEventToKalender ",clickedDate);
    let eventInput = window.prompt("Neues Event hinzufügen");
    console.log("new event: ", eventInput, " clicked Date ", clickedDate);
    if(eventInput != null && eventInput != ''){
      let tmpEvent = new KalenderEvents();
      tmpEvent.addEvent(2022,this.state.choosenMonth,clickedDate,eventInput);
      this.state.eventListKalenderAll.push(tmpEvent.kalenderEvent); //dauerhaft speichern
      this.state.eventListKalender.push(tmpEvent.kalenderEvent); //damit direkt angedruckt wird
      //Update GUI
      this.setState({tmpUpdateGUI: 1});
      this.setState({tmpUpdateGUI: 0});
      this.openEventsOfChosenDay(clickedDate);
    }
    // this.state.clickedDayDate = clickedDate;
    // console.log("debug addNewEventToKalender ade:",this.state.eventListKalender); // Debug
  }

  addNewEventToKalender(clickedDate){
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

  openEventsOfChosenDay(clickedDate){
    this.state.eventListChoosenDay = [];
    let tmpEventList = [];
    let tmpEventElementsLenght = this.state.eventListKalender.length;
    //Events aus Monat fuer ausgewaelten Tag auswaehlen
    for(let i = 0; i < tmpEventElementsLenght; i++){
      if(this.state.eventListKalender[i].eventDay == clickedDate){
        tmpEventList.push(this.state.eventListKalender[i]);
      }
    }
    this.state.eventListChoosenDay = tmpEventList;
        console.log("debug events all: ", tmpEventElementsLenght ,this.state.eventListKalender , "tmp ",tmpEventList, "tmp zum Adnsruck:",this.state.eventListChoosenDay); // Debug
    // console.log("debug events of chosen Day: ", tmpEventElementsLenght ,this.state.eventListKalender , tmpEventList); // Debug
    this.updateKalender();
  }

  openEventFromDay(clickedEventId){
    window.prompt(clickedEventId);
    console.log("event:_ " , clickedEventId, " _was clicked")
  }

  jumpToLastMonth(){
    console.log("last Month");
    this.state.choosenMonth = this.state.choosenMonth - 1; 
    this.updateKalender();
  }

  jumpToNextMonth(){
    console.log("next Month");
    this.state.choosenMonth = this.state.choosenMonth + 1; 
    this.updateKalender();
  }

  updateKalender(){
    this.state.eventListKalender = []; //delete old events
    this.filterMonthEventsForGUI();
    //Paramaeter Tagesdatum
    let date = this.state.choosenDate;
    let choosenMonth = this.state.choosenMonth;
    //Parameter Datum fuer Anzeige
    let monthDate = new Date(date.getFullYear(), choosenMonth , 1); 
    let firstOfMonth = new Date(date.getFullYear(), choosenMonth, 1);
    let lastOfMonth =  new Date(date.getFullYear(), choosenMonth + 1, 0);
    let weekDayFirst = firstOfMonth.getDay(); //Nur Wochentag 0 - 6; So - Sa
    let monthLengh = lastOfMonth.getDate();
    //**** Debug
    // console.log("Tagesdatum", date, " Wochentag ", date.getDay(), " MonatLänge ", date.getDate());  //Testausgabe
    // console.log("Datum ausgesucht monthDate ", monthDate, "monthLengh ", monthLengh, "erster Wochentag im Monat", weekDayFirst);
    // console.log("erster eines Monats firstOfMonth",firstOfMonth ,"erster Wochentag im Monat", weekDayFirst);
    //**** Algorithmus Monat ausfuellen
    //---fuelle ersten Tage im Monat mit Buffer
    let numberDaysMonth = [];
    //erste Tage, die nicht zum Monat gehoeren; bei weekDayFirst = 0 = Sonntag: fuege Puffertage hinzufuegen
    let pufferFirstDaysOfMonth = weekDayFirst;  
    if(weekDayFirst == 0){
      pufferFirstDaysOfMonth = 7;
    }
    for(let i = 1; i < pufferFirstDaysOfMonth; i++){ //fuelle Tage, die nicht zum Monat gehoeren auf
      let key = i * -1; //to Do,
      numberDaysMonth.push(key);
    } 
    // fuege Datumstage im Monat auf
    for(let i = 1; i <= monthLengh; i++){
      numberDaysMonth.push(i);
    }
    //Monatsname
    this.setState({daysOfMonth: [1]});
    this.setState({daysOfMonth: numberDaysMonth});
    let month = monthDate.getMonth();
    this.state.monthName = this.state.monthNameList[month];
  }
  //-----------render-----------------
  render() {
      return (
        <div id="page-container">
          {/* <div id="testBtns"> 
            <button onClick={() => this.addTestEvents()}> Add TestEvents </button>
          </div> */}
          <div id="chooseMonthBtns"> 
          <button onClick={() => this.jumpToLastMonth()}> vorheriger Monat </button>
          <button onClick={() => this.jumpToNextMonth()}> nächster Monat </button>
          </div>          
          <DateBox
            monthName = {this.state.monthName}  
            year = {this.state.choosenYear}   
            weekdayName = {this.state.weekdayName}  
            dateNumber = {this.state.daysOfMonth}
            eventListKalender = {this.state.eventListKalender}
            // dateElementClicked={ (clickedDate) => clickedDate > 0  ? this.addNewEventToKalender(clickedDate) : console.log("no")    }
            dateElementClicked={ (clickedDate) => clickedDate > 0  ? this.addNewEventToKalender(clickedDate) : console.log("no")    }
            // eventElementClicked = {(clickedEventFromDay) => this.openEventFromDay(clickedEventFromDay)}
            eventElementClicked = {(clickedEventFromDay) => ''}
            eventListChoosenDay = {this.state.eventListChoosenDay}
            clickedDayDate = {this.state.clickedDayDate}
            // choosenElementToDelete = {this.deleteEventFromKalender(1)}
            choosenElementToDelete = {(choosenEventObject) => this.deleteEventFromKalender(choosenEventObject)}
            // addNewEventToKalenderBtn = {() => this.addNewEventToKalenderBtn()}
            addNewEventToKalenderBtn = {() => this.addNewEventToKalenderBtn()}
          />
        </div>
      );
  }
}


//***************************************************/
//-----------Components-----------------
//-----------Kalender Monat links / Events rechts-----------------
const DateBox = ({year, monthName, weekdayName ,dateNumber, eventListKalender, dateElementClicked, eventElementClicked,eventListChoosenDay, clickedDayDate, choosenElementToDelete,
                  addNewEventToKalenderBtn}) => {
  return (
    <div id="kalender-container">
      <div  id="month-container">
        <div id="monthName-container">
          <div id="month-name"> {year} <br /> {monthName}</div>
        </div>
        <div id="weekdayName-container">
          <WeekDayBox data = {weekdayName} elementClicked={() =>''}/>
        </div>
        <div id="monthDateNumber-container">
          {/* <DayBox data = {dateNumber} elementClicked={(dateClicked) => console.log(dateClicked)}/> */}
          <DayBox 
          dateNumber = {dateNumber} 
          eventListKalender = {eventListKalender} 
          elementClicked={dateElementClicked} 
          eventElementClicked = {eventElementClicked}
          />
        </div>
      </div>
      <div id="eventList-container">
          Termine am Tag {clickedDayDate}
          <button id="addNewEventBtn" onClick={addNewEventToKalenderBtn}> neuen Termin hinzufügen </button>
          <EventListManagment 
            // data = {weekdayName}  
            data = {eventListChoosenDay}  
            // elementClicked={choosenElementToDelete}
            elementClicked={choosenElementToDelete}
          />
      </div>
    </div>
  );
}

//rechts Events andrucken
class EventListManagment extends React.Component {
  placeDays(props) {
      //DayElements
    const myObject = props.data
      // const listItems = (() =>
      //       <button className="day-container" id={"1"} key={"1"} onClick={() => props.click(1)} value={"1"} > 
      //       asd
      //       </button>
      //     );
    const listItems = myObject.map((myObject) =>
    <button className="day-container" id={myObject.eventText.toString()} key={myObject.eventkey.toString()} onClick={() => props.click(myObject)} value={myObject.eventText.toString()} > 
    {myObject.eventkey.toString()}
    </button>
    );

    return (
    <ul>{listItems}</ul>
    );
  }
  //-----------render Day Box-----------------
  render() {
      return (
          <this.placeDays data={this.props.data} click={this.props.elementClicked} /> 
      );      
  }
}




//----------links LV 1 Tagesbox
class DayBox extends React.Component {
  placeDays(props){
    //DayElements
      const numbers = props.dateNumber

      //Aufbereitung Eventlist von Objekt zu Array, um andrucke zu koennen
      const eventListObject = props.eventList
      //Array fuer Events im Monat = große ca. 50, da max 50 Tage angedruckt werden
      const eventListArray = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
      // const eventListArray = new Array(1).fill(null).map(()=>new Array(50));
      // console.log("testEventA eventListArray: ", eventListArray)
      // console.log("testEventA Objekt: ", eventListObject)
      //1: rufe Array fuer Tax x auf

      eventListObject.map( (eventDay) => {
        // let testEventDay = eventDay.eventDay;
        // console.log("testEventB Array: ", eventDay.eventText, " der TESTESR", testEventDay)
        // let a ={text: eventDay.eventText}
        // console.log("testEventObjekt a:", a)
        eventListArray[eventDay.eventDay].push(eventDay);
        // eventListArray.push(a);
        });
      // console.log("eventListArray 2D:", eventListArray[1])

      //Kalenderboxen
    const listItems = numbers.map((number) =>

      <div className="day-container">
        <div id="btn-Container" >
          <button className="dayNo" id={number.toString()} key={number.toString()} onClick={() => props.click(number)} value={number.toString()} >{number.toString()}</button> 
        </div>
        <div id="event-Container" >
        {/* <EventDayBox data = {["event a", "Event b", "Event c", "Event D"]} eventElementClicked={props.eventElementClicked}/>  */}
          <EventDayBox
          data = { typeof eventListArray[number] !== 'undefined'  ? eventListArray[number] : ["alter Monat"]} 
          eventElementClicked={props.eventElementClicked}
          // eventListToArray ={props.eventList}
          /> 
        </div>
      </div>
    );

    return (
    <ul>{listItems}</ul>
    );
  }
  //-----------render Day Box-----------------
  render() {
      return (
          <this.placeDays 
            dateNumber={this.props.dateNumber} 
            eventList = {this.props.eventListKalender} 
            // click={this.props.elementClicked}
            click={this.props.elementClicked}
            eventElementClicked = {this.props.eventElementClicked} 
          /> 
      );      
  }
}


//------------LV 2 EVENTS auf Tagesebene
class EventDayBox extends React.Component {
  placeDays(props) {
    //DayElements
      const eventNamer = props.data
//--------hier Code Events pro Tag
      // const test = props.eventListToArray
      // console.log("ganz unten auf lv Liste Events:", props.eventListToArray) //DEBUG
//--------hier Code Events pro Tag ENDE

      const listItems = eventNamer.map((eventNames) =>
            <button className="dayEvent-container" id={eventNames.toString()} key={eventNames.eventkey} onClick={() => props.click(eventNames)} value={eventNames.toString()} > 
              {eventNames.eventText} 
            </button>
      );
      return (
      <ul>{listItems}</ul>
      );
  }
  //-----------render eventName Box-----------------
  render() {
      return (
          <this.placeDays data={this.props.data} click={this.props.eventElementClicked} /> 
      );      
  }
}


//------------LV 1 Wochentage Namen
class WeekDayBox extends React.Component {
  placeDays(props) {
    //DayElements
      const numbers = props.data
      const listItems = numbers.map((number) =>
            // <button className="day-container" id={number.toString()} key={number.toString()} onClick={() => props.click(number)} value={number.toString()} > 
            <button className="day-container" id={number.toString()} key={number.toString()} value={number.toString()}>
            {number.toString()}
            </button>
      );
      return (
      <ul>{listItems}</ul>
      );
  }
  //-----------render Day Box-----------------
  render() {
      return (
          <this.placeDays data={this.props.data} click={this.props.elementClicked} /> 
      );      
  }
}

//***************************************************/
//-----------For HTML Output-----------------
const KalenderMain = () => {
    return (
        <div id="main-box-Get7">
        <KalenderSub />
        </div>
    );
}
   
ReactDOM.render(
  <KalenderMain />,
  document.getElementById('Kalender')
);

  