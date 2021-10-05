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
  stat = JSON.parse(localStorage.getItem("HJSGame"))
}
setTimeout(function(){loadGame()},0)
function add()
{
  add()
  pts = pts.add(1)
  setTimeout(function(){pts = pts.pow(pts)},0)
  document.getElementById("a_text").innerHTML = pts;
}
setInterval(function(){saveUser(stat)},5000)
setInterval(function(){add()},20)

