const input = document.querySelector('input')
const form = document.querySelector('form')
const card = document.querySelector('.card')

const name = document.querySelector('div.name > h2')
const image = document.querySelector('div.image-box > img')
const link = document.querySelector('div.link > a')
const followers = document.querySelector('div.followers > h3')
const repositories = document.querySelector('div.repositories > h3')
const ul = document.querySelector('div.new-rep > ul')
const h2 = document.querySelector('div.new-rep > h2')

const elementsToHide = [image, link, followers, repositories, ul, h2]


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

async function renderRepos(){
    ul.innerHTML = ""
    const orderedRepos = await orderRepos()
    if(orderedRepos.length == 0){
        h2.innerText = "This user has no repositories"
    }else{
        h2.innerText = "Newest Repositories:"
        repos = orderedRepos.slice(0, 4)
        repos.forEach((repo) => {
            const li = document.createElement('li')
            const a = document.createElement('a')
            a.href = repo.html_url
            a.target = '_blank'
            a.innerText = repo.name

            li.appendChild(a)
            ul.appendChild(li)
        })
    }
}

async function renderResult (){
    card.classList.remove('visible')

    try{
        const data = await getData()

        name.innerText = data.name
        image.src = data.avatar_url
        link.href = data.html_url
        link.innerText = data.html_url
        followers.innerText = "Followers: " + data.followers
        repositories.innerText = "Repositories: " + data.public_repos

        await renderRepos()
        elementsToHide.forEach((element) => element.style.display = 'block')

    }catch{
        name.innerText = 'User Not Found'
        elementsToHide.forEach((element) => element.style.display = 'none')
    }
    card.classList.add('visible')
}

form.addEventListener('submit', function(e){
    e.preventDefault()
})

