import { useEffect, useState } from "react"
import BlankCandy from "./images/blank.png"
import BlueCandy from "./images/blue-candy.png"
import GreenCandy from "./images/green-candy.png"
import PurpleCandy from "./images/purple-candy.png"
import RedCandy from "./images/red-candy.png"
import OrangeCandy from "./images/orange-candy.png"
import YellowCandy from "./images/yellow-candy.png"
import Scoreboard from "./components/Scoreboard"

const width = 8
const candyColors = [
	BlueCandy,
	GreenCandy,
	PurpleCandy,
	RedCandy,
	OrangeCandy,
	YellowCandy
]
const App = () => {
	const [currentColorArrangement, setCurrentColorArrangement] = useState([])
	const [squareBeingDragged, setSquareBeingDragged] = useState(null)
	const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
	const [score, setScore] = useState(0)
	const checkForColumnOfThree = () => {
		for(let i = 0; i < 47; i++){
			const columnOfThree = [i, i + width, i + width * 2]
			const decidedColor = currentColorArrangement[i]

			if(columnOfThree.every(square => currentColorArrangement[square] === decidedColor)){
				columnOfThree.forEach(square => currentColorArrangement[square] = BlankCandy)
				return true
			}
		}
		return false
	}

	const checkForRowOfFour = () => {
		for(let i = 0; i < 64; i++){
			const rowOfFour = [i, i + 1, i + 2, i + 3]
			const decidedColor = currentColorArrangement[i]
			const invalid = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,61,62,63]
			if(invalid.includes(i)) continue

			if(rowOfFour.every(square => currentColorArrangement[square] === decidedColor)){
				rowOfFour.forEach(square => currentColorArrangement[square] = BlankCandy)
				return true
			}
		}
		return false
	}

	const checkForRowOfThree = () => {
		for(let i = 0; i < 64; i++){
			const rowOfThree = [i, i + 1, i + 2]
			const decidedColor = currentColorArrangement[i]
			const invalid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,62,63]
			if(invalid.includes(i)) continue

			if(rowOfThree.every(square => currentColorArrangement[square] === decidedColor)){
				rowOfThree.forEach(square => currentColorArrangement[square] = BlankCandy)
				return true
			}
		}
		return false
	}

	const checkForColumnOfFour = () => {
		for(let i = 0; i < 47; i++){
			const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
			const decidedColor = currentColorArrangement[i]

			if(columnOfFour.every(square => currentColorArrangement[square] === decidedColor)){
				columnOfFour.forEach(square => currentColorArrangement[square] = BlankCandy)
				return true
			}
		}
		return false
	}

	const moveIntoSquareBelow = () => {
		for(let i = 0; i < 64 - width; i++){
			const firstRow = [0,1,2,3,4,5,6,7]
			const isFirstRow = firstRow.includes(i)
			if(isFirstRow && currentColorArrangement[i] === BlankCandy){
				currentColorArrangement[i] = candyColors[Math.floor(Math.random() * candyColors.length)]
			}
			if(currentColorArrangement[i + width] === BlankCandy){
				currentColorArrangement[i + width] = currentColorArrangement[i]
				currentColorArrangement[i] = BlankCandy
			}
		}
	}

	const dragStart = (e) => {
		setSquareBeingDragged(e.target)
	}

	const dragEnd = () => {
		const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))
		const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
		
		currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
		currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')
		
		const validGroups = [
			squareBeingDraggedId - 1,
			squareBeingDraggedId - width,
			squareBeingDraggedId + width,
			squareBeingDragged + 1
		]
		const isValid = validGroups.includes(squareBeingReplacedId)
		const isColumnOfFour = checkForColumnOfFour()
		const isColumnOfThree = checkForColumnOfThree()
		const isRowOfFour = checkForRowOfFour()
		const isRowOfThree = checkForRowOfThree()
		
		if(squareBeingReplacedId && 
			isValid && 
			(isColumnOfFour || isColumnOfThree || isRowOfFour || isRowOfThree)){
			setSquareBeingDragged(null)
			setSquareBeingReplaced(null)
			setScore(score+1)
		} else{
			currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
			currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
			setCurrentColorArrangement([...currentColorArrangement])
		}
	}
	
	const dragDrop = (e) => {
		setSquareBeingReplaced(e.target)
	}
	const createBoard = () => {
		const randomColorArrangement = []
		for(let i = 0; i < width * width; i++){
			const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
			randomColorArrangement.push(randomColor)
		}
		setCurrentColorArrangement(randomColorArrangement)
	}
	useEffect(() => {
		createBoard()
	}, [])

	useEffect(() => {
		const timer = setInterval(()=>{
			checkForColumnOfFour()
			checkForColumnOfThree()
			checkForRowOfFour()
			checkForRowOfThree()
			moveIntoSquareBelow()
			setCurrentColorArrangement([...currentColorArrangement])
		}, 200)
		return () => clearInterval(timer)
	}, [checkForColumnOfFour, checkForColumnOfThree, checkForRowOfFour, checkForRowOfThree])

	return (
		<div className="app">
			<Scoreboard  score={score}/>
			<div className="game">
				{currentColorArrangement.map((candyColor, index) => (
					<img 
						key={index}
						src={candyColor}
						data-id={index}
						draggable={true}
						onDragStart={(e)=>dragStart(e)}
						onDragOver={(e)=> e.preventDefault()}
						onDragEnter={(e)=>e.preventDefault()}
						onDragLeave={(e)=>e.preventDefault()}
						onDrop={dragDrop}
						onDragEnd={dragEnd}
					/>
				))}
			</div>
		</div>
  );
}

export default App;
