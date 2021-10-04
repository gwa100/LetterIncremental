function stats()
{
  this.pts = new OmegaNum(0);
}
function saveUser(Stats)
{
  localStorage.setItem("HJSGame",JSON.stringify(Stats))
}
function loadGame()
{
  stat = localStorage.getItem(JSON.parse(stat),"HJSGame")
}
var stat = new stats();
setTimeout(function(){loadGame()},0)
