var loc						= window.location,
	repoOwner				= loc.host.split('.')[0],
	repoName				= loc.pathname.split('/')[1],
	rawGit					= 'https://rawgit.com', // cdn.rawgit for production
	scriptElement			= document.createElement('script');

scriptElement.src = (window.location.hostname === '127.0.0.1') ?
 	window.location.pathname.split('/').slice(0, 4).join('/') + '/js/loader.js' :
	[rawGit , repoOwner, repoName, 'master', 'js', 'loader.js'].join('/');

document.body.classList.add('request');
document.getElementsByTagName('head')[0].appendChild(scriptElement);
