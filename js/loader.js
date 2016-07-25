// LOADER reside on `master`

/*
*
* Create and return a Custom Element
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

/*
*
* Variables
*
*/
var headElement		= document.getElementsByTagName('head')[0],
	section			= document.querySelector('section'),
	nav				= document.querySelector('nav p'),
	footer			= document.querySelector('footer p'),
	pagePath		= (window.location.hostname === '127.0.0.1') ?
		window.location.pathname.split('/').slice(4).join('/').slice(0, -1) :
		loc.pathname.split('/').slice(2).join('/'),
	localDebug		= cce('a', '', {href: 'https://starsystem.github.io/naledi'}),
	loc				= (window.location.hostname === '127.0.0.1') ? localDebug : window.location,
	urlSlash		= loc.pathname.split('/'),
	urlHash			= loc.hash.substring(1),
	repoOwner		= loc.host.split('.')[0],
	repoName		= urlSlash[1],
	repoFullname	= [repoOwner, repoName].join('/'),
	repoUrl			= ['https://github.com', repoFullname].join('/'),
	repoHome		= (window.location.hostname === '127.0.0.1') ?
		window.location.pathname.split('/').slice(0, 4).join('/') :
		['https://' + owner + '.github.io', repoName].join('/'),
	apiGitHub		= 'https://api.github.com',
	apiRepos		= [apiGitHub, 'repos'].join('/'),
	apiRepo			= [apiRepos, repoFullname].join('/'),
	rawStatic		= ['https://rawgit.com', repoFullname].join('/'),
	rawCdn			= ['https://cdn.rawgit.com', repoFullname].join('/'),
	logged			= (localStorage.getItem('naledi|token')) ? true : false,
	branchRef		= {},
	repos			= {};

// check status 401 and parse json
function dataHandler (response) {
	// Unauthorized or bad credential
	if (response.status === 401) {
		localStorage.removeItem('naledi|token');
		logged = false;
		console.log('401: unlogged');
	}
	// json parse
	return response.json();
}

// Error callback
function errore (e) {
	console.log('error: ' + e);
}

/*
*
* get Git Reference for a branch
*
*/
function getRef (branch, repo) {
	var b = branch || 'master';
	var r = repo || repoFullname;
	var options = {
		headers: {'Accept': 'application/vnd.github.v3+json'},
		cache: 'no-cache'
	};
	if (logged) options.headers.Authorization = 'token ' + localStorage.getItem('naledi|token');
	return fetch([apiRepos, r, 'git/refs/heads', b].join('/'), options)
		.then(dataHandler)
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
			// example {starsystem/naledi/master: "0ba93cd72ba2017f923bceb3c3a685deedbf5629"}
			branchRef[[r, b].join('/')] = ref;
			return ref;
		})
		.catch(errore);
}

// Append script to document.head
function appendScript (url) {
	var s = cce('script', '', {'src': url});
	headElement.appendChild(s);
}

// Append loader checking local-debug
function appendUpdater (ref) {
	var loaderUrl = [rawCdn, ref, 'js', 'updater.js'].join('/');
	if (window.location.hostname === '127.0.0.1') loaderUrl = window.location.pathname.split('/').slice(0, 4).join('/') + '/js/updater.js';
	return appendScript(loaderUrl);
}

/*
*
* INIT
*
*/

// get master reference and append updater script
getRef()
.then(appendUpdater)
.catch(errore);
