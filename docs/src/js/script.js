const listSelectionArchons = document.querySelectorAll(".archon");

listSelectionArchons.forEach(archon=> {
    archon.addEventListener("click", ()=>{
        hideCardArchon();
    
const idArchonSelected = showCardArchonSelected(archon);

desactivateArchonOnList();
activateArchonSelectedOnList(idArchonSelected);
 
    })
})

function activateArchonSelectedOnList(idArchonSelected){
    const archonSelectedOnList = document.getElementById(idArchonSelected);
    archonSelectedOnList.classList.add("active");

}

function desactivateArchonOnList(){
    const archonActiveOnList = document.querySelector(".active");
    archonActiveOnList.classList.remove("active");
}

function showCardArchonSelected(archon){
    const idArchonSelected = archon.attributes.id.value;
    const idCardArchonToOpen = "card-" +idArchonSelected;
    const cardArchonToOpen = document.getElementById(idCardArchonToOpen);
    cardArchonToOpen.classList.add("open");
    return idArchonSelected;
}

function hideCardArchon(){
    const cardArchonOpen = document.querySelector(".open");
    cardArchonOpen.classList.remove("open");
}