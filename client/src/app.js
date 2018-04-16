/* Projet - Le co* du stagiaire 
~ Lisez le README.md pour plus d'informations ~
*/

import gameServer from './gameServer'

const seedURL = './seeds/seed1.seed'
const updateTime = 1000

/**
 * Create a grid of a specific seed
 * x = width of the grid | y = height of the grid
**/
function createElements(size) {
    // for (let y=0; y!=size.height; y++) {
    //     const singleLineOfCells = document.createElement("div")
    //     for(let x=0; x!=size.width;x++) {
    //         const singleCell = document.createElement("div")
    //         singleCell.id = "cell-"+y+"#"+x
    //         singleCell.classList.add("defaultCell")
    //         singleLineOfCells.appendChild(singleCell)
    //     }
    //     singleLineOfCells.classList.add("singleRow-"+y)
    //     document.getElementById("grid").appendChild(singleLineOfCells)
    // }
    document.getElementById("grid").style.gridTemplateColumns = "repeat("+size.width+", 1fr)"
    for (let y=0; y!=size.height; y++) {
        for(let x=0; x!=size.width;x++) {
            const singleCell = document.createElement("div")
            singleCell.id = "cell-"+y+"#"+x
            singleCell.classList.add("defaultCell")
            document.getElementById("grid").appendChild(singleCell)
        }
    }
}

/**
 * Update the cells in each interval
 * x = width of the grid | y = height of the grid
**/
gameServer.onMessage = (message) => {
    const data = JSON.parse(message.data)
    const [height, width] = [data.height, data.width]
    console.log(data.cells[0][0])
    for (const y in data.cells) {
        for (const x in data.cells[y]) {
            var singleCell = data.cells[y][x].alive
            if(data.cells[y][x].alive === true)
                document.getElementById("cell-"+y+"#"+x).classList.add("cellIsAlive")
            else
                document.getElementById("cell-"+y+"#"+x).classList.remove("cellIsAlive")
        }
    }

}

gameServer
    .loadSeed(seedURL)
    .then((seed) => {
        console.log("Initialise the game with a  new seed :")
        createElements({ "height": seed.split("\n").length, "width": seed.split("\n")[0].length })
        gameServer.init(seed)
    })
    .catch((error) => {
        console.error(error)
    })
const interval = setInterval(() => {
    gameServer.next()
}, updateTime)
