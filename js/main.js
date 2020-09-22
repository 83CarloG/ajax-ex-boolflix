// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

$(document).ready(function	() {
	serchMoviesClick();
	serchMoviesEnter();
});
// Funzioni
// Funzione per la renderizzazione della pagina
function renderMovie	(movies) {
	$('#list-movies li').remove();
	// Handlebars
	var source = document.getElementById('movie-template').innerHTML;
	var template = Handlebars.compile(source);
	//  Print evry files to endpoint
	for (var i = 0; i < movies.length; i++) {
		// Prepariamo html
		var html = template(movies[i]);
		// Inseriamo il template nel id
		$('#list-movies').append(html);
	}
}
// Funzione per la ricerca dei titoli con il bottone cerca
function serchMoviesClick () {
	$('.btn').on('click', function	() {
		var input = $('.serch').val();
		// Chiamata Ajax
		$.ajax({
			url: 'https://api.themoviedb.org/3/search/movie',
			type: 'GET',
			data: {
				api_key: 'c423a47df89e015bd0c2e2130db1be10',
				query: input,
				language: 'it-IT'
			},
			success: function (data) {
				renderMovie(data.results);
				$('.serch').val('');
			},
			error: function (err) {
				console.log('Errore: ' + err);
			}
		});
	});
}
// Funzione per la ricerca dei titoli con  il tasto invio
function serchMoviesEnter () {
	$('.serch').on('keydown', function	(e) {
		if (e.which === 13) {
			var input = $('.serch').val();
			// Chiamata Ajax
			$.ajax({
				url: 'https://api.themoviedb.org/3/search/movie',
				type: 'GET',
				data: {
					api_key: 'c423a47df89e015bd0c2e2130db1be10',
					query: input,
					language: 'it-IT'
				},
				success: function (data) {
					renderMovie(data.results);
					$('.serch').val('');
				},
				error: function (err) {
					console.log('Errore: ' + err);
				}
			});
		}
	});
}
