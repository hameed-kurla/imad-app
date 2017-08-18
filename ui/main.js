
console.log('Loaded!');

var margin=0;  //Moving Maddi Eg
var counter=10; //Counter Eg
var imgElement = document.getElementById('img');
var btnElement = document.getElementById('counter');
var spanElement = document.getElementById('count');
//var interval = setInterval(refreshCount,100000);
//updateCounter();

function updateCounter() {
	// Request the counter
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200){
					counter= request.responseText;					
					spanElement.innerHTML = counter.toString();
				}
		}
		
	}
	
	request.open('GET', 'http://localhost:80/counter', true);
	request.send(null);
}

function refreshCount(){
	var request = new XMLHttpRequest();
	console.log('LoadedRef!');
	request.onreadystatechange = function() {
		if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200){
					counter= request.responseText;					
					spanElement.innerHTML = counter.toString();
				}
		}
		
	}
	
	request.open('GET', 'http://localhost:80/getcount', true);
	request.send(null);
}

function moveRight(){
	margin = margin + 1;
	//console.log(margin);
	img.style.marginTop= margin + 'px';
	
}

imgElement.onclick = function() {
	var interval = setInterval(moveRight,100);
	//img.style.marginLeft='10px';

}

btnElement.onclick = function(){
	updateCounter();
}

var submit_btn = document.getElementById('submit');
var users = document.getElementById('users');
var user_row = document.getElementById('user_row');
var user_list=users.innerHTML;

submit_btn.onclick = function() {
	console.log('asLoaded!');
	name=(document.getElementById('name').value);
	email=(document.getElementById('email').value);
	phone=(document.getElementById('mobile').value);
	address=(document.getElementById('address').value);
	console.log(user_list);
	user_list=user_list+"<tr onclick='showRowIndex(this)'><td>" + name + "</td><td>" + email + "</td><td>" + phone + "</td><td>" + address + "</td></tr>";
	users.innerHTML = user_list;
}

function showRowIndex(row){
	console.log('rwasLoaded!');
	x=document.getElementById("users").rows[row.rowIndex].cells;
	console.log(row.rowIndex);
	console.log(x[0].innerHTML);
}