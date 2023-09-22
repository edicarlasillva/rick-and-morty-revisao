const charactersList = document.getElementById('charactersList')
const searchCharactersByName = document.getElementById('searchCharactersByName')

const prevPage = document.getElementById('prevPage') // Página anterior
const nextPage = document.getElementById('nextPage') // Próxima página

let response
let currentPage = 1

let isLoading = false

async function loadCharacters(page = 1, name = '') {
  try {
    isLoading = true

    const params = {
      name,
      page
    }

    response = await api.get('/character', { params })

    // Desabilita os botões durante a requisição
    prevPage.disabled = true
    nextPage.disabled = true

    // Limpar o HTML 
    charactersList.innerHTML = ''

    console.log(response.data)

    response.data.results.forEach(character => {
      // Criar elemento card
      const characterCard = document.createElement('div')
      characterCard.classList.add('characters-card')

      // Criar elemento imagem
      const characterImage = document.createElement('img')
      characterImage.classList.add('characters-image')
      characterImage.src = character.image

      const statusClass = character.status === 'Alive' ? 'status-alive' : 'status-dead'

      // Criar elemento h2 -> nome do personagem
      const characterName = document.createElement('h2')
      characterName.textContent = character.name
      characterName.classList.add(statusClass)

      characterCard.appendChild(characterImage)
      characterCard.appendChild(characterName)

      charactersList.appendChild(characterCard)

      // prevPage.disabled = !response.data.info.prev
      // nextPage.disabled = !response.data.info.next

      prevPage.disabled = response.data.info.prev ? false : true
      nextPage.disabled = response.data.info.next ? false : true
    })

  } catch (error) {
    console.log("Erro ao buscar personagens.", error)
  } finally {
    isLoading = false
  }
}

loadCharacters()

// Event listener para buscar personagens por nome
searchCharactersByName.addEventListener('input', () => {
  currentPage = 1
  loadCharacters(currentPage, searchCharactersByName.value)
})

// Event Listener para a página anterior
prevPage.addEventListener('click', () => {
  if (currentPage > 1 && !isLoading) {
    currentPage--
    loadCharacters(currentPage)
  }
})

nextPage.addEventListener('click', () => {
  if (currentPage < response.data.info.pages && !isLoading) {
    currentPage++
    loadCharacters(currentPage)
  }
})