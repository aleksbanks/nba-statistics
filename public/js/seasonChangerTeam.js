document.addEventListener('submit', async (e) => {
  if (e.target.classList.contains('seasonChange')) {
    e.preventDefault()
    const { seasonForm } = document.forms;
    const season = seasonForm.teamSeason.value
    const id = seasonForm.teamSeason.dataset.id
    const resultPage = await fetch('/teams/stat/change', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ season, id })

    })
    const newPage = await resultPage.text()
    const main =  document.querySelector('main')
    main.innerHTML = newPage
  }
})
