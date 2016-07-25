// UPDATER reside on `master`

/*
* supplentary variables
*/
var userType, // false = guest, true = owner
		repoType, // false = user, true = organization
		userButton = (logged) ?
			cce('a', 'Logout', {href: './logout', class: 'float-right'}) :
			cce('a', 'Login', {href: './login', class: 'float-right'});

/*
*
* get Repository
*
*/
function getRepo (repository) {
	var r = repository || repoFullname;
	var options = {
		headers: {'Accept': 'application/vnd.github.v3+json'},
		cache: 'no-cache'
	};
	if (logged) options.headers.Authorization = 'token ' + localStorage.getItem('naledi|token');
	return fetch([apiRepos, r].join('/'), options)
		.then(dataHandler)
		.then(function (d) {
			// store repo
			// example {starsystem/naledi: Object}
			repos[r] = d;
			return d;
		})
		.catch(errore);
}

function checkTypes (repo) {
	userType = (logged && repo.permission && repo.permission.admin) ? true : false;
	repoType = (repo.owner.type == 'Organization') ? true : false;
	return repo;
}

function setMenu (repo) {
	if (pagePath !== 'login' && pagePath !== 'logout') nav.appendChild(userButton);
	footer.appendChild(cce('a', 'Repository', {href: repoUrl}));
	return repo;
}

function printName (repo) {
	document.body.classList.remove('request');
	section.appendChild(cce('h1', repo.name));
}

getRepo()
.then(checkTypes)
.then(setMenu)
.then(printName)
.catch(errore);
