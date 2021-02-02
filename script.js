
if (window.screen.availWidth < 400) {
	document.getElementsByTagName('link')[0].href = "styleformobile.css"; 
	document.getElementsByClassName('timer-info')[0].style.display = "none";
}
else{
	document.getElementsByTagName('link')[0].href = "style.css"; 
}

var count = document.getElementsByClassName('count');
count[0].style.color = "green";
count[1].style.color = "red";

var app = angular.module("myapp" , []);

app.service('ser' ,['$http', function($http){
	this.arr = function(str){
		var lastfoundindex = 0;
		var arr = [] , x = 0 , largestword , i=0 , temp;
		function spaces(str){
			var spaceCount = 0, lastfoundspace = 0, i;
			for ( i = 0; i < str.lastIndexOf(' ') ; i++) {
					if (str.indexOf(' ' , lastfoundspace + 1) > lastfoundspace) {
						spaceCount++;
						lastfoundspace = str.indexOf(' ' , lastfoundspace + 1);
					}
					if (str.indexOf(' ') == str.lastIndexOf(' ') ) {
						break;
					}        
			}
			return spaceCount;
		}
		function seperateWords(str) {
				function extrtword(str , lastfoundindex) {
					if (i==0) {
						return str.slice(  lastfoundindex , str.indexOf(' ', lastfoundindex + 1)  );
					} else {
						if ( i == spaces(str) ) {
							return str.slice(  lastfoundindex + 1 );
						} else {
							return str.slice(  lastfoundindex + 1 , str.indexOf(' ', lastfoundindex + 1)  );
						}
					}
				}
				var word = extrtword(str , lastfoundindex);  
				lastfoundindex = str.indexOf(' ' , lastfoundindex + 1);
				return word;
			}
			for ( i = 0; i <= spaces(str) ; i++) {      
				arr.push( seperateWords(str) );  
			}
		return arr;
	};

	this.readTextFile = function (file) {
		var request = new XMLHttpRequest();
		var allText = "";
		request.open("GET" , file , false);
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				if (request.status === 200 || request.status == 0) {
					allText = request.responseText;
				}
			}
		}
		request.send(null);
		return allText;
	};

	this.subset = function (s1, s2) {
		if (s1 == "") {
			return false;
		}
		var i;
		var tf;
		for ( i = 0; i < s1.length; i++) {
			if (s1[i] != s2[i]) {
				return tf = false;
			}
		}
		return true;
	};

}]);


app.controller('myctrl' , ['$scope' , 'ser' , '$interval', function ($scope, ser , $interval) {	
	$scope.time = 60;
	$scope.hidedesc = false;
	$scope.tf = true;
	$scope.rightCount = 0;
	$scope.wrongCount = 0;
	var i = 1; // array traverser
	var k = 0; // array slicer
	var z = 0; // used in $scope.check function
	var j;
	var str = ser.readTextFile('paragraph.txt');
	var  firstTime = 0;

	var spns = document.getElementsByClassName('words');

	
	$scope.words = ser.arr(str).slice(k, k+10);
	// this is the function that is going to change our para in view when user enters SPACE;
	var change = function () {
		j = i-1;
		
			
			if (i%10 == 0) {
				//this if updates the first and last element of span tags

				
				k+=10;
				if (k == 200) {
					$scope.words = ['Congragulations,', 'You', 'completed', 'the', 'test!!'];
					return;
				}

				$scope.words = 	ser.arr(str).slice(k, k+10);
				
				i=1;
			
				spns[i-1].style.fontSize = '45px';
				spns[i-1].style.paddingBottom = '13px';

				spns[9].style.fontSize = '33px';
				spns[9].style.paddingBottom = '0px';

			} else {
				//this else updates any other element of span tags
				spns[i].style.fontSize = '45px';
				spns[i].style.paddingBottom = '13px';
			
				i++;
				
				spns[j].style.fontSize = '33px';
				spns[j].style.paddingBottom = '0px';
			}
	};

	var rollBack = function () {
			if (i==1) return;
			
			i--;
			z--;
			var j = i-1;
			spns[j].style.fontSize = '45px';
			spns[j].style.paddingBottom = '13px';
			spns[j].style.color = 'green';
	
			spns[i].style.fontSize = '33px';
			spns[i].style.paddingBottom = '0px';
			spns[i].style.color = 'white';
		

	}

	var correct = function (str1 , str2) {
		(str1 === str2)? $scope.rightCount++ : $scope.wrongCount++;
	}

	

	var myInterval = function () {

		var stopTimer = function () {
			$interval.cancel(promise);
		};

		var promise = $interval(function () {
			var time = document.getElementById('time');
			$scope.time--;
			if ($scope.time == -1) {
				console.log($scope.rightCount + " " + $scope.wrongCount);
				document.getElementsByClassName('alert')[0].style.display = "flex";
				stopTimer();
			}
			else if($scope.time == 10){
				time.style.color = "red";
				time.style.fontWeight = "bold";
			}
		} , 1000);
	};

	
	
	

	//this is the function which keeps eye on our input
	$scope.getkeys = function(event){
		firstTime++;
		if (firstTime == 1) {
			myInterval();
		}
		if(event.keyCode == 32){
			if ($scope.txt !== spns[z].innerHTML) {
				spns[z].style.color = "red";
			}
			correct($scope.txt , spns[z].innerHTML);
			change();
			
			// var z is useful in scope.check function
			(z==9)? z = 0 : z++;
			
			$scope.txt = undefined;
		}	
	};

	$scope.bckspce = function (event) {
		if (event.keyCode == 8) {
			if ($scope.txt == undefined) {
				console.log('$scope.txt is undefined');
			}
			else if ($scope.txt.length == 0 ) {
					rollBack();
			}
		}
		
	}	

	$scope.check = function(txt) {
		$scope.tf = ser.subset(txt , $scope.words[z]);
		$scope.hidedesc = true;
		
		if (z==0) {
		

			//this for loop is to set the span tag back white
			for (let a = 0; a < 9; a++) {
				if (a==0) {
					spns[9].style.color = 'white';
					continue;
				}
				else{
					spns[a].style.color = 'white';
				}
			}
		}

			if ($scope.tf == true) {
				spns[z].style.color = 'green';
			} else if($scope.tf == false) {
				if ($scope.txt == "") {
					spns[z].style.color = 'white';
				}
				else{
					spns[z].style.color = 'red';
				}
			}
	};


} ]);
		