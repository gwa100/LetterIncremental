var stats = {
alphabet:{a:{a_points: new OmegaNum(0),a_production: new OmegaNum(0)}}
}
function saveUser(Stats)
{
  setTimeout(saveUser,5000)
  localStorage.setItem("HJSGame",JSON.stringify(Stats))
}
function loadGame()
{
  stats = JSON.parse(localStorage.getItem("HJSGame"))
}
setTimeout(function(){loadGame()},0)
function add()
{ 
  setTimeout(add,1)
  stats.alphabet.a.a_points = stats.alphabet.a.a_points.add(1)
  document.getElementById("a_text").innerHTML = stats.alphabet.a.a_points.toFixed(3);
}
saveUser(stat)
add()

