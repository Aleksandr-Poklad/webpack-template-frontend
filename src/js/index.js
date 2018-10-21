// import $ from 'jquery';
import {$} from './components/mainMethods';

function f() {
	console.log($('.container'));
}
f();

function fun() {
	for(let i = 0; i < 5; i++){
		setTimeout(function () {
			console.log(i)
		},300)
	}
}
fun();