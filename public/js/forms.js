const { playerForm } = document.forms;
const { teamForm } = document.forms;





// playerForm.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const playerInput = playerForm.playerInput.value;
//   const playerSeasons = playerForm.playerSeason.value
//   const playerInApi = await fetch(`https://www.balldontlie.io/api/v1/players?search=${playerInput}`)
//   let player = await playerInApi.json()
//   player = player.data
//   const result = await fetch(`/player/stat/${player[0].id}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ player, season: playerSeasons })
//   })
//   const statPage = await result.text()
//   document.body.innerHTML = statPage
// });


teamForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const teamId = teamForm.teamSelect.value;
  const teamSeason = teamForm.teamSeason.value;
  const result = await fetch(`/teams/stat/change`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: teamId, season: teamSeason })
  })
  const season = teamSeason.substring(0,5)
  window.location.replace(`teams/stat/${teamId}?season=${season}`)
});
