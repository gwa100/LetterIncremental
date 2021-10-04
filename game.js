var stat = new stats();
var pts = stat.pts;
function stats()
{
  this.pts = new OmegaNum(0);
}
function saveUser(Stats)
{
  setInterval(saveUser(stat),5000)
  localStorage.setItem("HJSGame",JSON.stringify(Stats))
}
function loadGame()
{
  stat = JSON.parse(localStorage.getItem("HJSGame"))
}
setTimeout(function(){loadGame()},0)
function add()
{
  setInterval(add(),1)
  pts = pts.add(1)
  pts = pts.pow(pts)
  document.getElementById("a_text").innerHTML = pts;
}
