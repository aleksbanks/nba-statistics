document.addEventListener('submit', async (e) => {
  if (e.target.classList.contains('seasonChange')) {
    e.preventDefault()
    const { seasonFormPlayer } = document.forms;
    const season = seasonFormPlayer.playerSeason.value
    const id = seasonFormPlayer.playerSeason.dataset.id
    console.log(id);
    const resultPage = await fetch('/player/stat/edit', {
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
