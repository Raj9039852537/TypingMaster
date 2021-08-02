var word_string, words; 		//String = contains the words; Array (words) = contains the words split up in an array
var row1_string = ''; 			//contains the words to be entered in the 1st row
var i;
var word_pointer = 0; 			//marks the current word to be typed
var user_input_stream = ''; 	//collects all keystrokes made by the user
var row_counter = 0; 			//counts the number of line generated
var eingabe; 					//check variable => everything that is in the input field is cached and processed here (sometimes the keylist does not react quickly enough for the space, e.g. "hello w" is then transmitted, therefore further processing takes place first)
var start_time = 0;				//start time in milliseconds
var end_time = 0;				//end time in milliseconds
var setval = "";				//the variable for the timer / setInterval
var start_time_set = 0;			//Was the start time already set on the server using Ajax or not?
var line_height = 0;			//Interlace height
var error_wpm = 0;				//fallback if ajax call fails => user can still see his result
var error_keystrokes = 0;
var error_correct = 0;
var error_wrong = 0;
var backspace_counter = 0;
var key_counter = 0;
var _gaq = _gaq || [];
var keys = {};					//reads in the keys pressed, is used for Mac / Safari "Smart" reload
var input_key_value = 32;//$("#config_input_key").attr("value");
var $inputfield = $("#text_typed").removeClass('hidden');
var $end_early=$("#endtest");
var $row1 = $("#row1");
var $row1_span_wordnr;
var ended=false;
var started=false;
var old_diff=0;
var scrolldiff=0;
var startpos=0;
var last_scroll=0;
var original_placeholder="";
var eingabe;
$(document).ready(function(){
	cache_elements();
	restart();
	activate_keylistener();
	$('#emailModal').dialog({
		modal: true,
		autoOpen: false,
		display:"inline-block",
		title: "Enter Text to Practice",
		closeText:'',
		buttons: {
			"🖫 save": function() {
				eA=$('#eA').val();
				eA=eA.replace(/‍/g,"");
				eA=eA.replace(/  +/g," "); //replace multiple space
				eA=eA.replace(/”/g,'"');
				eA=eA.replace(/“/g,'"');
				eA=eA.replace(/’/g,"'");
				$('#emailPost2').submit();
				$(this).dialog("close");
			}
		}
	});
	// Show the modal form when clicked.
	$('#create').click(function() {
		$("#emailModal").dialog('open');
	});
	$('#endtest').click(function() {
		end_test();
	});

});
function changeText(){
	if($inputfield.val()!=""){ end_test();}
		$('.original').text(eA);
	cache_elements();
	$inputfield.slideDown();
	$workspace.slideDown();
	$('#time').slideDown();
	restart();
}
function encodeImageFileAsURL(){
	var input = document.getElementById("inputFileToLoad");
	file = input.files[0];
	fr = new FileReader();
	fr.onload = function receivedText() {
		document.getElementById("eA").value = fr.result;
	}
	fr.readAsText(file);
}
function timess(z){
	sec = z/1000;min = sec/60;
	min = floor
	return 
}
var current_position_diff=new Object();
var $workspace
var $current;
function cache_elements() {
	$workspace=$('.workspace');
	lines=$('.original').text().split("\n");
	words=[];tee='<span class="current"></span>';
	$(lines).each(function(i,e){
		words_in_this_line=e.split(" ");
		$(words_in_this_line).each(function(i,e){
			if(e.length>0){ words.push(e);tee+='<span wordnr="'+i+'" class="wordz">'+e+'</span> ';}
		});
	});
	tee+=' &nbsp;<br>			'
	$workspace.html(tee);
	$current=$('.current');
	var offset_current=$current.offset();
	var offset_workspace=$workspace.offset();
	current_position_diff.top=offset_current.top-offset_workspace.top;
	current_position_diff.left=offset_current.left-offset_workspace.left;
}

function restart() {
	// is called at the start and when you click "restart"
	// calls initialization functions and sets values ​​back to the start value
	word_string = '';
	words = '';
	row1_string = '';
	word_pointer = 0;
	user_input_stream = '';
	cd_started = 0;
	previous_position_top = 0;
	row_counter = 0;
	eingabe = '';
	start_time = 0;
	end_time = 0;
	start_time_set = 0;
	//just to count everything if the ajax-call fails
	error_wpm = 0;
	error_keystrokes = 0;
	error_correct = 0;
	error_wrong = 0;
	backspace_counter = 0;
	key_counter = 0;
	ended=false;
	started=false;
	scrolldiff=0;
	startpos=0;
	old_diff=0;
	last_scroll=0;
	$("#timer").text("1:00");
	$("#ajax-load").css('display', 'block');
	$("#reload-box").css('display', 'none');
	$("#row1").css('top', "1px");
	$("#timer").removeClass("off");
	$("#time").html("00:00").fadeIn();
	window.clearInterval(setval);
	setval = "";
	setTimeout(function() {
		$inputfield.val('').show().focus();
	}, 250);
	$workspace.slideDown();
	$('.results').slideUp();
	$('.highlight-wrong').removeClass('highlight-wrong');
	$('.highlight').removeClass('highlight');
	$('.wrong').removeClass('wrong');
	$('.correct').removeClass('correct');
	$row1.animate({scrollTop:0}, '2000', 'swing');
	lines=$('.original').text().split("\n");
	words=[];tee='<span class="current"></span>';
	$(lines).each(function(i,e){
		words_in_this_line=e.split(" ");
		$(words_in_this_line).each(function(i,e){
			if(e.length>0){ words.push(e);tee+='<span wordnr="'+i+'">'+e+'</span> ';}
		});
	});
	tee+=' &nbsp;<br>			'
	$workspace.html(tee);
	$end_early.slideDown();
	$('#total-count').text(words.length);
	$('#row1 span[wordnr="0"]').addClass('highlight');
//	if(startpos==0)
	startpos=$('#row1 span[wordnr="0"]').offset().top;
	if(original_placeholder!="") $('#text_typed').attr('placeholder',original_placeholder);
}
function end_test(){
	clearInterval(timer);
	ended=new Date();
	$inputfield.slideUp();
	$end_early.slideUp();
	$workspace.slideUp();
	$('#time').slideUp();
//	$('.keystrokes').html("");
	scrolldiff=0;
	completed=$(".correct").length+$(".wrong").length;
	$(".completed-count").html(completed+' done');
	//$current.html('');
	$('#saving-score-message').show();
	user_words=user_input_stream.split(' ');user_words.pop();
//	if($inputfield.val()!="") {user_words.push($inputfield.val());}
	x='<div class="workspace2">';
	for(i=0;i<user_words.length;i++){
		if(user_words[i]==words[i]) x+='<font class="correct">'+words[i]+' </font>'
		else x+='<font class="wrong">'+user_words[i]+' </font><font style="color:lime">['+words[i]+'] </font>'
	}
	x+='</div>';
	$('.results').slideDown();
	accuracy=(100*($('.workspace .correct').length/($('.workspace .correct').length+$('.workspace .wrong').length)));
	accuracy=Math.floor(accuracy)+"."+Math.round((accuracy-Math.floor(accuracy))*100);
	var wp=document.getElementsByClassName('keystrokes')[0].innerText.split(' ')[0]/60;
	wp=Math.floor(wp)+"."+Math.round((wp-Math.floor(wp))*100);
	res='<h3>Congratulations</h3><p>You finished this test in <strong>'+document.getElementById('time').innerText+'</strong> seconds with an accuracy of <strong>'+accuracy+'%</strong>.<br>\
		You typed <strong>'+key_counter+'</strong> keystrokes with <strong>'+backspace_counter+'</strong> corrections.\
		<strong>'+$('.workspace .correct').length+'</strong> words were correct and <strong>'+$('.workspace .wrong').length+'</strong> were wrong. 		\
		<table class="table scores-table"> <tr><td>Score</td><td style="background-color: #fcf8e3;">10</td>\
		<td title="time in minutes and seconds">Time</td><td style="background-color: #fcf8e3;">'+document.getElementById('time').innerText+'</td>\
		<th>WPM</th><td style="background-color: #fcf8e3;">'+document.getElementsByClassName('WPM')[0].innerText.split(' ')[0]+'</td>\
		<th title="Characters per second">CPS</th><td style="background-color: #fcf8e3;">'+wp+'</td> <!-- "CPS = wpm / 60 * 5" oder "CPS = wpm / 12" -->\
		<th>accuracy</th><td style="background-color: #fcf8e3;">'+accuracy+'</td>\
		</tr></table> '+x;
	$('.results').html(res).slideDown();
	return true;
}
function evaluate(){
	eingabe = $inputfield.val().split(" ");
	user_input_stream += eingabe[0]+" ";
	$row1_span_wordnr.removeClass('highlight-wrong');
	if(eingabe[0] == words[word_pointer]) {
		$row1_span_wordnr.removeClass('highlight').addClass('correct');
		error_correct++;
		error_keystrokes += words[word_pointer].length;
		error_keystrokes++; //for every SPACE
	}
	else {
		$row1_span_wordnr.removeClass('highlight').addClass('wrong');
		error_wrong++;
		error_keystrokes -= Math.round(words[word_pointer].length / 2);
	}	
}

//writing for inputs that are mane in #inputfield
function activate_keylistener() {
	var android_spacebar = 0;
	// restart with 'r'
	$(document).keydown(function(event){
		if(ended != false) { if(event.which==82) restart(); }
		//F5 pressed
		if(event.which==116) {
			clearInterval(timer);
			ended=new Date();
			restart();
			return false;
		}
	});
	// Android/mobile specific function to check if inputfield contains a space-char, as the keyup function doesn't work on Android+Chrome 
	$(window).on("touchstart", function(event) {
		$("input#inputfield").on("input", function( event ) {
			var value = $("input#inputfield").val();	
			if (value.indexOf(" ") != -1) {
				android_spacebar = 1;
			} else {
				android_spacebar = 0;
			}
		});
	});
		
	// last cpm logging
	var last_cpm=[];
	// on keypress
	$inputfield.keydown(function(e){
		bs =$('#backspace').prop('checked');
		// increase backspace-count
		if(e.which===8 && ! bs) return false;
		else if (e.which===8) backspace_counter++;
	})
	$inputfield.keyup(function(event) {
		paus1=new Date();
		if(!(event.which===16 || event.which===17 || event.which===18 || event.which===225)) key_counter++;
		//console.log(event.which);
		// lets start!
		if(!started && event.which!=116) {
			started=new Date();
			startpos=$('#row1 span[wordnr="'+word_pointer+'"]').offset().top;
			var lastest_cpm_schnitt=0;
			var max_cpm=0;
			timer=setInterval(function(){
				var now=new Date();
				var diff=now-started+old_diff;
				var seconds=Math.floor((diff/1000)%60);
				var minutes=Math.floor((diff/1000/60));
				if(seconds<10) seconds="0"+seconds;
				if(minutes<10) minutes="0"+minutes;
				//$('.workspace').text().length
				var cpm_str='';
				var current_text=user_input_stream+''+$inputfield.val();
				var cpm=Math.ceil((current_text.length/diff*1000)*60);
				last_cpm.push(cpm);
				var bg_red='rgba(255,0,0,.4);';
				var bg_darkred='rgba(255,0,0,.8);';
				var bg_green='rgba(0,255,0,.4);';
				var bg_darkgreen='rgba(0,255,0,.8);';
				var speed_bar="";
				if(last_cpm.length>30 && diff>1000) {
					var cpm_schnitt=0;
					var i = last_cpm.length;
					while (i--) { cpm_schnitt+=last_cpm[i]; }
					cpm_schnitt/=last_cpm.length;
					if(cpm_schnitt>max_cpm) max_cpm=cpm_schnitt;
					cpm_str=Math.round(cpm_schnitt);
					last_cpm.shift();
					var background=bg_green;
					if(lastest_cpm_schnitt!=0){
						if(lastest_cpm_schnitt>cpm_schnitt) background=bg_red;
						if(lastest_cpm_schnitt>cpm_schnitt+2) background=bg_darkred;
						if(lastest_cpm_schnitt<cpm_schnitt-2) background=bg_darkgreen;
					}
					lastest_cpm_schnitt=cpm_schnitt;
					speed_bar='<div style="width:100%; height:12px; border:1px solid rgba(0,0,0,.1);"><div style="background:'+background+' height:10px; width:'+Math.ceil((cpm_schnitt/max_cpm)*100)+'%;"></div></div>';
//console.log(cpm+" "+cpm_schnitt);
				}
				$("#total-count").html(words.length+' Total ');
				completed=$(".correct").length+$(".wrong").length;
				$(".completed-count").html(completed+' done');
				$("#time").html(minutes+":"+seconds);
				$('.keystrokes').html(''+cpm_str+' KPM');
				$('.speedo').html(speed_bar);
				var wpm=Math.ceil((completed/diff*1000)*60);
				//var wpm=Math.round(words.length/diff*10)/10*60;
				$('.WPM').html(wpm+' WPM');
				pause=new Date();
				if (pause-paus1>5000){
					clearInterval(timer);started=false;old_diff=diff-4000;$("#time").html("Paused");
				}
			}, 100);
		}
		// already finished?
		if(ended) return;
		// current word
		$row1_span_wordnr = $('#row1 span[wordnr="'+word_pointer+'"]');
		// space pressed, but empty input
		if(event.which == input_key_value && $inputfield.val() == ' ' || event.which==13 && $inputfield.val() == ' ') {
			$inputfield.val('');
		} 
		// space pressed
		else if (event.which == input_key_value || android_spacebar == 1 || event.which==13) //event.which == 32 => SPACE-Taste
		{
			if(original_placeholder=="") {
				original_placeholder=$('#text_typed').attr('placeholder');
				$('#text_typed').attr('placeholder','');
			}
			//evaluate
			evaluate();
	 		//process
	 		word_pointer++;
	 		// this was the last word?
		 	if(word_pointer==words.length) {
			 	end_test();
			}		
	 		else {
		 		$row1_span_wordnr = $('#row1 span[wordnr="'+word_pointer+'"]');
		 		$row1_span_wordnr.addClass('highlight');
				var scroll=$row1_span_wordnr.offset().top-startpos+$row1.scrollTop();
				//console.log("scroll: "+scroll);
				//console.log("last_scroll: "+last_scroll);
				if(scroll>last_scroll+5) {
					$row1.animate({scrollTop:scroll}, '2000', 'swing');
		 			last_scroll=scroll;
		 		}
		 		//erase
		 		$("#inputstream").text(user_input_stream);
		 		//$inputfield.val(eingabe[1]);
		 		if(eingabe[1]) {
		 			$current.html(eingabe[1]);
		 			$inputfield.val(eingabe[1]);
		 		}
		 		else {
		 			$current.html("");
		 			$inputfield.val("");
		 		}
		 	}
		}
		// typing process
		else {
			// check if user is typing the word incorrectly (then display it in red so that user can correct it directly)
			if($('.highlight').length>0) {
				var t=$('.highlight').offset().top+$('.highlight').height()-$(document).scrollTop()+5;
				//$('.hightlight').offset().top
				$current.text($inputfield.val()).css({
					'top':t,
					'left':$('.highlight').offset().left
				}).show();
			}
			// typing currently wrong or right?
			if($inputfield.val().replace(/\s/g, '') == words[word_pointer].substr(0, $inputfield.val().replace(/\s/g, '').length)) {
				$row1_span_wordnr.removeClass('highlight-wrong').addClass('highlight');
			}
			else {
				$row1_span_wordnr.removeClass('highlight').addClass('highlight-wrong');
			}
			// typing last word?
			if(word_pointer==words.length-1) {
				if(words[word_pointer].length==$inputfield.val().length) {
					evaluate(); // evaluate last word
					end_test();
				}
			}
		}
	});
}

