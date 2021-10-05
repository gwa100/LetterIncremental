var stat = new stats();
var points_a = stat.points_a;
var production_a = stat.production_a;
function stats()
{
  
  this.points_a = new OmegaNum(0)
  this.production_a = new OmegaNum(0)
  
  
}
function saveUser(Stats)
{
  setTimeout(saveUser,5000)
  localStorage.setItem("HJSGame",JSON.stringify(Stats))
}
function loadGame()
{
  stat = JSON.parse(localStorage.getItem("HJSGame"))
}
setTimeout(function(){loadGame()},0)
function add()
{
  setTimeout(add,1)
  points_a = points_a.add(1)
  document.getElementById("a_text").innerHTML = points_a.toFixed(3);
}
saveUser(stat)
add()

