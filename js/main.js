/*
#Milestone 1
	Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
	Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
	Titolo
	Titolo Originale
	Lingua
	Voto
*/
/*
#Milestone 2:
	Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
	Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
	Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
	Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
	Qui un esempio di chiamata per le serie tv:
	https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs
*/
/*
#Milestone 3:
	In questa milestone come prima cosa aggiungiamo la copertina del film o della serie al nostro elenco.
	Ci viene passata dall’API solo la parte finale dell’URL, questo perché poi potremo generare da quella porzione di URL tante dimensioni diverse.
	Dovremo prendere quindi l’URL base delle immagini di TMDB: https://image.tmdb.org/t/p/ per poi aggiungere la dimensione che vogliamo generare (troviamo tutte le dimensioni possibili a questo link: https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400) per poi aggiungere la parte finale dell’URL passata dall’API.
	Esempio di URL che torna la copertina di PEPPA PIG:
	https://image.tmdb.org/t/p/w185/tZgQ76hS9RFIwFyUxzctp1Pkz0N.jpg
*/
$(document).ready(function	() {
	const boolflix = {
		serchClick: serchClick('.serch__btn', '.serch__input'),
		serchKey: serchKey('.serch__input', 13)
	};
});
// FUNZIONI
// Funzione per la renderizzazione della pagina
function render	(input, type) {
	console.log(input.length)
	// Handlebars
	var source = $('#movie-serie-template').html();
	var template = Handlebars.compile(source);
	//  Print evry files to endpoint
	// input.length ? console.log('ok') : $('.type-series').remove();
	for (var i = 0; i < input.length; i++) {
		// Prepariamo il contenuto dell'Html
		var context = input[i];
		// Manipolo l'oggetto
		context.vote_average = voteToStars(input[i].vote_average);
		context.original_language = flag(input[i].original_language);
		context.poster_path = insertImage(context.poster_path);
		console.log(context.poster_path)
		var html = template(context);
		// Inseriamo il template nell' id #list-movies o #list-series
		if (type === 'movie') {
			$('.list-movies').append(html);
		} else {
			$('.list-series').append(html);
		}
	}
}
// Chiamata Ajax per ricerca film o serie
function callAjaxData (serchString, type) {
	$.ajax({
		url: 'https://api.themoviedb.org/3/search/' + type,
		type: 'GET',
		data: {
			api_key: 'c423a47df89e015bd0c2e2130db1be10',
			query: serchString,
			language: 'it-IT'
		},
		success: function (data) {
			if (data.total_results) {
				render(data.results, type);
			} else {
				console.log(data.total_results)
				notFound(type);
			}

		},
		error: function (err) {
			console.log('Errore: ' + err);
		}
	});
}
// Funzione per notifica 0 risultati
function notFound (type) {
	var source = $('#not-found-template').html();
	var template = Handlebars.compile(source);
	var html = template();
	if (type === 'movie') {
		$('.list-movies').append(html);
	} else {
		$('.list-series').append(html);
	}
}
// Funzione per la ricerca dei titoli dei film con il bottone cerca
function serchClick (bottone, campoInput) {
	$(bottone).click(function	() {
		var input = $(campoInput).val();
		resetSerch();
		// Chiamata Ajax
		callAjaxData(input, 'movie');
		callAjaxData(input, 'tv');
	});
}
// Funzione per la ricerca dei titoli dei film con  il tasto invio(o altro)
function serchKey (campoInput, e) {
	$(campoInput).keyup(function	(e) {
		if (e.which === 13) {
			var input = $(campoInput).val();
			resetSerch();
			// Chiamata Ajax
			callAjaxData(input, 'movie');
			callAjaxData(input, 'tv');
		}
	});
}
// Funzione per trasformare un numero in stelle
function voteToStars	(vote) {
	var voteStar = Math.ceil(vote / 2);
	var fullStar = '<i class="star fas fa-star"></i>';
	var emptyStar = '<i class="star far fa-star"></i>';
	var voteTotal = '';
	for (var i = 0; i < voteStar; i++) {
		voteTotal += fullStar;
	}
	for (i = 0; i < (5 - voteStar); i++) {
		voteTotal += emptyStar;
	}
	return voteTotal;
}
// Funzione per inserire le bandiere - si ringrazia il sito countryflags.io
function flag	(lang) {
	if (lang === '') {
		return 'Lingua non presente';
	} else if (lang === 'en')	{
		return ('<img src=https://www.countryflags.io/' + 'gb' + '/shiny/16.png>');
	} else {
		return ('<img src=https://www.countryflags.io/' + lang + '/shiny/16.png>');
	}
}
// Funzione per inserire l'immagine
function insertImage (image) {
	if (image === null) {
		image = 'img/no_poster.png';
	} else {
		image = 'https://image.tmdb.org/t/p/w342/' + image;
	}
	return image;
}
// Funzione di reset campo input e risultati
function resetSerch ()	{
	$('.list .item').remove();
	$('.serch__input').val('');
}
