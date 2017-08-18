console.log('Aert');

var submit_btn = document.getElementById('submit_btn');

submit_btn.onclick = function() {
	console.log('Submit Loaded!');
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
	    if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200){
					alert('User Created Successfully');
				}
				else if (request.status === 403){
				    alert('User not found');
				}
				else if (request.status === 500){
				    alert('Internal Error: something went wrong');
				}
	    }			
	}
	var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    request.open('POST', 'http://hameedkurla.imad.hasura-app.io/login', true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify({username,password}));
};