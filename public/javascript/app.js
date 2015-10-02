/*

the comment is below is when we Posted things on the web. You didnt have to comment it out if it was written in a function like our getShows function below.

//Making a post requeest to Firebase
//Part 1: Create the request
var req = new XMLHttpRequest();

//Part 2: Open the request
//at the end of your url, you need to add .json
req.open("POST", "https://mytvshows.firebaseio.com/.json", true);

//Part 3: onload
req.onload = function(){
  //do this once we get a response
  console.log("sent successful!");
};

//Part 4: send the request
req.send(JSON.stringify({title: "Games of Throne", years:"2003-End of Time" ,rating:"9.34"}));
*/
var shows = [];

function getShows(){
  var req = new XMLHttpRequest();
  //in line below, the ASYNC defaults to true if we dont put anything.
  req.open("GET", "https://mytvshows.firebaseio.com/.json");
  req.onload = function(){
    if( 200 < this.status < 400){
      var res = JSON.parse(this.response);
      var elemString = "";
      shows.length =0; //empties the array
      for (var prop in res) {
        res[prop]._id = prop; //_id is an arbitrary name. Can be anything else. Using this cause similar to what will learn in week 3.
        shows.push(res[prop]);
      elemString +='<li>'+ res[prop].title + ':' + res[prop].years + '|'+ res[prop].rating + ' <button class="btn btn-warning" onclick="startEdit('+(shows.length-1)+')">Edit</button></li>';
      }
      document.getElementById('tvShows').innerHTML = elemString;
    }
    else {
      console.error(this.response);
    }
  }
  req.send();
}
getShows();

function startEdit(index){
$('#editTitle').val(shows[index].title);
$('#editYears').val(shows[index].years);
$('#editRating').val(shows[index].rating);
$('#editSubmitButton').html('<button onclick="saveEdit('+index+')" class="btn btn-primary">Save Changes</button>');
  $('#myModal').modal('toggle');
}

function saveEdit(index){
var title=$('#editTitle').val();
var years=$('#editYears').val();
var rating=$('#editRating').val();
var show = new Show(title, years, rating);

$.ajax({url:'https://mytvshows.firebaseio.com/'+ shows[index]._id+'/.json', type: 'PUT', data:JSON.stringify(show)
}).success(function(res){
  //res = this.response;
  getShows();
})

$('#myModal').modal('toggle');
}

function Show(title, years, rating){
  this.title = title;
  this.years = years;
  this.rating = rating;
}

function saveTVShow(){
  var title = document.getElementById('tvTitle').value;
  var years = document.getElementById('tvYears').value;
  var rating = document.getElementById('tvRating').value;

  var show = new Show(title, years, rating);

  var req = new XMLHttpRequest();
  req.open('POST', 'https://mytvshows.firebaseio.com/.json');
  req.onload = function(){
    getShows();
  }
  req.send(JSON.stringify(show));
}

function startDelete() {
  var elemString ="";
  for (var i=0; i< shows.length; i++){
  elemString +='<li class=form-inline>' + shows[i].title + ':' + shows[i].years + '|'+ shows[i].rating + '&nbsp&nbsp<input type="checkbox" value ="false" class="form-control" style="display: inline-block;" id="'+shows[i]._id+'"</li>';
}
$('#tvShows').html(elemString);
$('#buttonsGoHere').html('<button class="btn btn-success" onclick="saveDelete()">Save</button><button class="btn btn-danger" onclick="cancel()">Cancel</button>')
}

function cancel() {
  getShows();
  $('#buttonsGoHere').html('');
}

var delCount;
var boxes; // these are to help us have scope. //delCount says the index of the box we are currently deleting. //boxes is keeping track of every checkbox that is checked
function saveDelete(){

  boxes =$(':checkbox:checked');
  if (boxes.length > 0) {
    deleteShow(boxes[0].id);
  }
}

//Using $.ajax() --> creating a request, open a request and send a request (step 1,2, and 4) in one line
function deleteShow(id) { //recursive functions: calling itself.
  $.ajax({ url:'https://mytvshows.firebaseio.com/'+id+'/.json', type: "DELETE"}).success(function(){
delCount +=1;
if(delCount < boxes.length) {
  deleteShow(boxes[delCount].id);
}
else {
  getShows();
}
  })
}

//google API only has post requests
// put says fully replace the object, patch says go in and modify these properties
//now we're gonna work on EDIT
// we're gonna use a modal to save time --> getbootstrap
// start by putting a button in getShows()
