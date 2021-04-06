const input = document.querySelector('input')
const form = document.querySelector('form')

async function getData(){

    try{
        const data = await (await fetch(`https://api.github.com/users/${input.value}`)).json()  
        return data
    }catch (err){
        console.log(err)
    }
        
}

async function orderRepos(){
    const data = await (await fetch(`https://api.github.com/users/${input.value}/repos`)).json()
    const repos = data.map(repo => ({name: repo.name, html_url: repo.html_url, created_at: new Date(repo.created_at)}))
    const orderedRepos = repos.sort((a, b) => a.created_at < b.created_at ? 1 : -1)
    
    return orderedRepos
}

async function renderResult (){
    const data = await getData()
    const orderedRepos = await orderRepos()

    document.querySelector('main').innerHTML = `
    <div class="card">
            <div class="image-box">
                <img src="${data.avatar_url}" alt="profile image">
            </div>
            <div class="user-info">
                    <div class="name-link">
                        <div class="name">
                            <h2>${data.name}</h2>
                        </div>
                        <div class="link">
                            <a href="${data.html_url}" target="_blank"> ${data.html_url} </a>
                        </div>
                    </div>

                    <div class="fol-rep">
                        <div class="followers">
                            <h3> Followers: ${data.followers} </h3>
                        </div>
                        <div class="repositories">
                            <h3>Repositories: ${data.public_repos}</h3>
                        </div>
                    </div>
            </div>
            <div class="new-rep">
                <h2>Newest Repositories:</h2>
                <ul>
                    <li><a href="${orderedRepos[0].html_url}" target="_blank">${orderedRepos[0].name}</a></li>
                    <li><a href="${orderedRepos[1].html_url}" target="_blank">${orderedRepos[1].name}</a></li>
                    <li><a href="${orderedRepos[2].html_url}" target="_blank">${orderedRepos[2].name}</a></li>
                </ul>
            </div>
        </div>
    `
}

form.addEventListener('submit', function(e){
    e.preventDefault()
    renderResult()
})

