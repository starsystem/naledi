/*
*
* cce(tag[, inner[, attributes]])
*
*/
function cce (tag, inner, attributes) {
	var element;
	if (document.createElement(tag)) element = document.createElement(tag); else return false;
	if (inner) {
		element.innerHTML = inner;
	}
	if (attributes && attributes.constructor === Object) {
		for (var key in attributes) {
			if (attributes.hasOwnProperty(key)) {
				element.setAttribute(key, attributes[key]);
			}
		}
	}
	return element;
}

// Variables
var localDebug		= cce('a', '', {href: 'https://starsystem.github.io/naledi'}),
		loc						= (window.location.hostname === '127.0.0.1') ? localDebug : window.location,
		urlSlash			= loc.pathname.split('/'),
		urlHash				= loc.hash.substring(1),
		pagePath			= urlSlash.slice(2).join('/'),
		repoOwner			= loc.host.split('.')[0],
		repoName			= urlSlash[1],
		repoFullname	= [repoOwner, repoName].join('/'),
		apiGitHub			= 'https://api.github.com',
		apiRepos			= [apiGitHub, 'repos'].join('/'),
		apiRepo				= [apiRepos, repoFullname].join('/'),
		rawStatic			= ['https://rawgit.com', repoFullname].join('/'),
		rawCdn				= ['https://cdn.rawgit.com', repoFullname].join('/'),
		branchRef			= {};

// Error callback
function errore (e) {
	console.log('error: ' + e);
}

// parse JSON
function jsonize (response) {
	return response.json();
}

// get Git Reference for a branch
function getRef (branch) {
	var b = branch || 'master';
	var options = {
		header: {'Accept': 'application/vnd.github.v3+json'},
		cache: 'no-cache'
	};
	return fetch([apiRepo, 'git/refs/heads', b].join('/'), options)
		.then(jsonize)
		.then(function (head) {
			// get ref
			return head.object.sha;
		})
		.catch(function () {
			// fallback ref
			return b;
		})
		.then(function (ref) {
			// store ref
			branchRef[b] = ref;
			return ref;
		})
		.catch(errore);
}

function appendScript (url) {
	var s = cce('script', '', {'src': url});
	document.getElementsByTagName('head')[0].appendChild(s);
}

function appendLoader (ref) {
	var loaderUrl = [rawCdn, ref, 'js/loader.js'].join('/');
	if (window.location.hostname === '127.0.0.1') loaderUrl = 'js/loader.js';
	return appendScript(loaderUrl);
}

document.body.classList.add('request');

getRef()
.then(appendLoader)
.catch(errore);
