const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const thisDay = new Date();
const thisYear = thisDay.getFullYear();
const seasons = [];
for (let i = thisYear; i > 2017; i--) {
  seasons.push(`${i - 1} - ${i}`)
}

// главная страниц
router.get('/', async (req, res) => {

  const teamsInApi = await fetch(`http://data.nba.net/prod/v1/${thisYear}/teams.json`)
  let teams = await teamsInApi.json()
  teams = teams.league.standard;

  const calenderApi = await fetch(`http://data.nba.net/prod/v1/current/standings_all.json`);
  let calendar = await calenderApi.json()
  const standings = calendar.league.standard.teams;
  res.render('index', { seasons, teams, standings, thisYear })
});

// страница со всеми игроками
router.get('/players', async (req, res) => {
  const players = await fetch(`http://data.nba.net/prod/v1/${thisYear}/players.json`)
  const allPlayersApi = await players.json()
  const allPlayers = allPlayersApi.league.standard

  res.render('allPlayers', { players: allPlayers })
});

// страница статистики конкретного игрока c поиска
router.post('/player/stat/:id', async (req, res) => {
  let { player, season } = req.body;
  const { id } = req.params;

  const playerStatsApi = await fetch(`https://www.balldontlie.io/api/v1/season_averages?season=${season}&player_ids[]=${id}`)
  let playerStat = await playerStatsApi.json()
  playerStat = playerStat.data[0]

  let playerStatGames = await fetch(`https://www.balldontlie.io/api/v1/stats?season[]=${season}&player_ids[]=${id}`)
  playerStatGames = await playerStatGames.json();
  playerStatGames = playerStatGames.data

  player = player[0]
  res.render('playersStat', { player, season, playerStat, playerStatGames })
  // res.redirect(`/player/stat/${id}`, { player, season, playerStat, playerStatGames })
});


router.put('/player/stat/edit', async (req, res) => {

  let { id, season } = req.body;
  season = Number(season.substring(0, 5))
  const players = await fetch(`http://data.nba.net/prod/v1/${thisYear}/players.json`)
  const allPlayersApi = await players.json()
  const allPlayers = allPlayersApi.league.standard
  let player = allPlayers.filter((player) => player.personId === id)
  player = player[0];
  const playerpro = await fetch(` http://data.nba.net/prod/v1/${season}/players/${id}_profile.json`)
  const playerProfile = await playerpro.json()
  const playerStatSeason = playerProfile.league.standard.stats.latest
  const playerStatCareer = playerProfile.league.standard.stats.careerSummary
  res.render('playersStat', { player, playerStatSeason, seasons, layout: false })
});

router.get('/player/stat/:id', async (req, res) => {
  const { id } = req.params;
  const players = await fetch(`http://data.nba.net/prod/v1/${thisYear}/players.json`)
  const allPlayersApi = await players.json()
  const allPlayers = allPlayersApi.league.standard
  let player = allPlayers.filter((player) => player.personId === id)
  player = player[0];
  const playerpro = await fetch(` http://data.nba.net/prod/v1/${thisYear}/players/${id}_profile.json`)
  const playerProfile = await playerpro.json()
  const playerStatSeason = playerProfile.league.standard.stats.latest
  const playerStatCareer = playerProfile.league.standard.stats.careerSummary
  res.render('playersStat', { player, playerStatSeason, seasons })
});

// страница со всеми командами
router.get('/teams', async (req, res) => {
  const teamsInApi = await fetch(`http://data.nba.net/prod/v1/${thisYear}/teams.json`)
  let teams = await teamsInApi.json()
  teams = teams.league.standard;
  res.render('allTeams', { teams })
});


// страница статистики конкретной команде
router.put('/teams/stat/change', async (req, res) => {

  let { id, season } = req.body;
  season = Number(season.substring(0, 5))
  console.log(season);

  const teamLeadersApi = await fetch(`http://data.nba.net/prod/v1/${season}/teams/${id}/leaders.json`)
  const players = await fetch(`http://data.nba.net/prod/v1/${season}/players.json`)

  const allPlayersApi = await players.json()
  const allplayers = allPlayersApi.league.standard
  const teamPlayers = allplayers.filter((player) => player.teamId === id)


  const leadersApi = await teamLeadersApi.json();
  const leaders = leadersApi.league.standard;
  delete leaders["seasonStageId"]
  const keys = Object.keys(leaders)
  for (let j = 0; j < keys.length; j++) {
    const playerId = leaders[keys[j]][0].personId
    leaders[keys[j]] = leaders[keys[j]][0]
    for (let i = 0; i < teamPlayers.length; i++) {
      if (playerId === teamPlayers[i].personId) {

        leaders[keys[j]].name = `${teamPlayers[i].firstName} ${teamPlayers[i].lastName}`
      }
    }
  }
  const teamsInApi = await fetch(`http://data.nba.net/prod/v1/${season}/teams.json`)
  let teams = await teamsInApi.json()
  teams = teams.league.standard;
  let team = teams.filter((team) => team.teamId === id)
  team = team[0]
  res.render('teamsStat', { team, teamPlayers, leaders, seasons, layout: false })
});



router.get('/teams/stat/:id', async (req, res) => {
  const { id } = req.params;
  if (!req.query.season) {
    req.query.season = 2020
  }
  const teamLeadersApi = await fetch(`http://data.nba.net/prod/v1/${req.query.season}/teams/${id}/leaders.json`)
  const players = await fetch(`http://data.nba.net/prod/v1/${req.query.season}/players.json`)

  const allPlayersApi = await players.json()
  const allplayers = allPlayersApi.league.standard
  const teamPlayers = allplayers.filter((player) => player.teamId === id)

  const leadersApi = await teamLeadersApi.json();
  const leaders = leadersApi.league.standard;
  delete leaders["seasonStageId"]
  const keys = Object.keys(leaders)
  for (let j = 0; j < keys.length; j++) {
    const playerId = leaders[keys[j]][0].personId
    leaders[keys[j]] = leaders[keys[j]][0]
    for (let i = 0; i < teamPlayers.length; i++) {
      if (playerId === teamPlayers[i].personId) {

        leaders[keys[j]].name = `${teamPlayers[i].firstName} ${teamPlayers[i].lastName}`
      }
    }
  }
  const teamsInApi = await fetch(`http://data.nba.net/prod/v1/${req.query.season}/teams.json`)
  let teams = await teamsInApi.json()
  teams = teams.league.standard;
  let team = teams.filter((team) => team.teamId === id)
  team = team[0]
  console.log(leaders);
  res.render('teamsStat', { team, teamPlayers, leaders, seasons })
});



// страница о сайте 
router.get('/about', (req, res) => {
  res.render('about')
});


module.exports = router;
