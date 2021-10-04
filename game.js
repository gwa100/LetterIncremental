var stat = new stats();
var pts = stat.pts;
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
  stat = localStorage.getItem(JSON.parse("HJSGame"))
}
setTimeout(function(){loadGame()},0)
function add()
{
  setTimeout(function(){add},0)
  pts = pts.add(1)
}
