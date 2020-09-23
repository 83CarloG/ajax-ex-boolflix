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
$(document).ready(function	() {
	serchMoviesClick('.btn', '.serch');
	serchMoviesKey('.serch', 13);
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
		// Prepariamo il contenuto dell'Html
		var context = movies[i];
		// Manipolo l'oggetto
		context.vote_average = voteToStars(movies[i].vote_average);


		var html = template(context);
		// Inseriamo il template nell' id #list-movies
		$('#list-movies').append(html);
	}
}
// Funzione per la ricerca dei titoli con il bottone cerca
function serchMoviesClick (bottone, campoInput) {
	$(bottone).click(function	() {
		var input = $(campoInput).val();
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
				$(campoInput).val('');
			},
			error: function (err) {
				console.log('Errore: ' + err);
			}
		});
	});
}
// Funzione per la ricerca dei titoli con  il tasto invio
function serchMoviesKey (campoInput, e) {
	$(campoInput).keyup(function	(e) {
		if (e.which === 13) {
			var input = $(campoInput).val();
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
					$(campoInput).val('');
				},
				error: function (err) {
					console.log('Errore: ' + err);
				}
			});
		}
	});
}

// Funzione per trasformare un numero in stelle
function voteToStars(vote) {
	var voteStar = Math.ceil(vote / 2);

	var fullStar = "<i class='fas fa-star'></i>";
	var emptyStar = "<i class='far fa-star'></i>";
	var voteTotal = '';
	for (var i = 0; i < voteStar; i++) {
		voteTotal += fullStar;
	}
	for (var i = 0; i < (5 - voteStar); i++) {
		voteTotal += emptyStar;
	}

	return voteTotal;
}
