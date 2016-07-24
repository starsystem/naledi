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

// Resolve branch ref api url
function branchRefUrl (branch) {
	var b = branch || 'master';
	return [apiRepo, 'git/refs/heads', b].join('/');
}

// append javascript in document.head
function appendScript (url, timestamp) {
	if (timestamp) {
		url += (url.indexOf('?') < 0) ? '?time=' : '&time=';
		url += new Date().getTime();
	}
	var s = cce('script', '', {'src': url});
	document.getElementsByTagName('head')[0].appendChild(s);
}

// Store branch ref
function storeRef (r) {
	if (r.meta.status > 199 && r.meta.status < 400) {
		var branch = r.data.ref.split('/').pop();
		branchRef[branch] = r.data.object.sha;
		return true;
	}
	return false;
}

function appendLoader (r) {
	var loaderUrl = [rawStatic, 'master/js/loader.js'].join('/');
	if (storeRef(r)) loaderUrl = [rawCdn, r.data.object.sha, 'js/loader.js'].join('/');
	if (window.location.hostname === '127.0.0.1') loaderUrl = 'js/loader.js';
	return appendScript(loaderUrl);
}

// Request master ref (with timestamp)
document.body.classList.add('request');
appendScript([branchRefUrl(), 'callback=appendLoader'].join('?'), 1);
