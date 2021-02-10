# Game-Leaderboard
## An API to post game results and get player rankings of each game.

### Features exposed :
- Users can register and login using phone number and password to request list of games available.
- Users can request game leaderboard containing the user ranking of a particular game.
- Users update their profile with details like Name, Age, Location and Email and Password.
- Users cannot update their phone numbers.

- Admin can create games
- Admin can post the game results between two players. Payload should be **{IdUser1,IdUser2,ScoreUser1,ScoreUser2,IdGame}**
