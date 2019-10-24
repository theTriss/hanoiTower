document.addEventListener('DOMContentLoaded', () => {
    
    let blockCounter = document.getElementById('complexity__select'),
        btnForBlock = document.querySelector('.btnForBlock'),
        btnReset = document.querySelector('#btnReset'),
        btnRestart = document.querySelector('#btnRestart'),
        townWithBlock = document.querySelectorAll('.townWithBlock'),
        wrapForBlock = document.querySelectorAll('.wrapForBlock'),
        soundEffectBtn = document.querySelector('.soundEffect'),
        counterMoves = document.querySelector('.moves__counter'),
        fieldsWithTime = document.querySelectorAll('.setting__timer > span'),
        soundEffect = true,
        timerID,
        arrWithParentsForReset = [],
        arrWithChildForReset = [],
        arrWithDragElements = [],
        arrWithSetting = [
//            {
//                width: '60px',
//                weight: 100,
//                color: 'red',
//                firstColor: '#8A2BE2',
//                secondColor: '#00FFFF'
//            },
//            {
//                width: '80px',
//                weight: 200,
//                color: 'blue',
//                firstColor: '#8A2BE2',
//                secondColor: '#FF00FF'
//            },
//            {
//                width: '100px',
//                weight: 300,
//                color: 'green',
//                firstColor: '#FF00FF',
//                secondColor: '#00BFFF'
//            },
//            {
//                width: '120px',
//                weight: 400,
//                color: 'red',
//                firstColor: '#FF7F50',
//                secondColor: '#FF1493'
//            },
//            {
//                width: '140px',
//                weight: 500,
//                color: 'blue',
//                firstColor: '#800080',
//                secondColor: '#FF6347'
//            },
//            {
//                width: '160px',
//                weight: 600,
//                color: 'green',
//                firstColor: '#00FF00',
//                secondColor: '#00FFFF'
//            },
//            {
//                width: '180px',
//                weight: 700,
//                color: 'blue',
//                firstColor: '#00FF7F',
//                secondColor: '#FF00FF'
//            },
//            {
//                width: '200px',
//                weight: 800,
//                color: 'green',
//                firstColor: '#00FA9A',
//                secondColor: '#FFFF00'
//            }
            {
                width: '60px',
                weight: 100,
                color: '#CD5C5C',
            },
            {
                width: '80px',
                weight: 200,
                color: '#FFA07A',
            },
            {
                width: '100px',
                weight: 300,
                color: '#F0E68C',
            },
            {
                width: '120px',
                weight: 400,
                color: '#6B8E23',
            },
            {
                width: '140px',
                weight: 500,
                color: '#87CEEB',
            },
            {
                width: '160px',
                weight: 600,
                color: '#4682B4',
            },
            {
                width: '180px',
                weight: 700,
                color: '#6A5ACD',
            },
            {
                width: '200px',
                weight: 800,
                color: '#483D8B',
            }
        ],
        arrWithBlock,
        opacityCoef = 0,
        celebrate = document.querySelector('.celebrate'),
        btnReplay = document.querySelector('.btnReplay'),
        btnClose = document.querySelector('.btnClose');

        btnRestart.disabled = true;
        btnReset.disabled = true;
    
    const restartGame = () => {
        
        let [hours, minutes, seconds] = fieldsWithTime;
        
        arrWithParentsForReset = [];
        arrWithChildForReset = [];
        
        btnRestart.disabled = true;
        btnReset.disabled = true;
        blockCounter.disabled = false;
        btnForBlock.disabled = false;
        
        wrapForBlock.forEach( elem => elem.innerHTML = '' );
        hours.innerHTML = '00:';
        minutes.innerHTML = '00:';
        seconds.innerHTML = '00';
        counterMoves.innerHTML = '0';
        
        blockCounter.selectedIndex = 0;
        
        clearTimeout(timerID);
        
    }
        
    const settingForBlock = () => {
        arrWithBlock = document.querySelectorAll('.block');
        arrWithBlock.forEach( ( elem, index ) => {
            let { width, weight, color } = arrWithSetting[index];
            elem.style.width = width;
            elem.setAttribute('data-weight', weight);
            elem.style.backgroundColor = color;
        } )
    }
    
    const removeElementsInArraysForReset = () => {
        arrWithParentsForReset.shift();
        arrWithChildForReset.shift();
    }
    
    const resetLastMove = () => {
        let parentElemen = arrWithParentsForReset[0],
            childElement = arrWithChildForReset[0];
        if( arrWithParentsForReset.length && parentElemen && parentElemen.firstElementChild ) {
            parentElemen.insertBefore(childElement, parentElemen.firstElementChild);
            removeElementsInArraysForReset();
        } else if( arrWithParentsForReset.length && parentElemen ) {
            parentElemen.appendChild( childElement );
            removeElementsInArraysForReset();
        } else return false;
        removeDrag();
        addDrag();
    }
    
    const addElementsInArraysForReset = ( parent, child ) => {
        arrWithParentsForReset.unshift(parent);
        arrWithChildForReset.unshift(child);
    }
    
    const addDrag = () => {
        Array.prototype.forEach.call( wrapForBlock, elem => { 
            let firstChild = elem.children[0];
            if( firstChild ) {
                arrWithDragElements.push( firstChild );
                firstChild.draggable = true;
            }
        } )
    }
    
    const removeDrag = () => {
        arrWithDragElements.forEach( elem => {
            elem.removeAttribute( 'draggable' );
        } )
        arrWithDragElements = [];
    }
    
    const checkWeightElement = ( apendElement, firstElement ) => {
        
        if( !firstElement || apendElement.getAttribute( 'data-weight' ) < firstElement.getAttribute( 'data-weight' ) ) return true;
        
        return false
    }
    
    function functionForEventDrop( event ) {

        let apendElem = arrWithBlock[ event.dataTransfer.getData( 'block' ) ],
            firstElement = this.firstElementChild.firstElementChild,
            isElementChild = Array.prototype.indexOf.call( this.firstElementChild.children, apendElem );
        
        if( apendElem && apendElem.getAttribute( 'draggable' ) && isElementChild == -1 && checkWeightElement( apendElem, firstElement )) {
            if( soundEffect ) audioEffect('music.mp3');
            counterMoves.textContent = ++counterMoves.textContent
            addElementsInArraysForReset( apendElem.parentElement, apendElem );
            this.firstElementChild.insertBefore( apendElem, firstElement );
            removeDrag();
            addDrag();
            
            if( wrapForBlock[2].children.length == blockCounter.value ) checkForWin();
        }
    }
    
    const dropEventForTown = () => {
        townWithBlock.forEach( elem => {
            elem.addEventListener( 'drop', functionForEventDrop );
            elem.addEventListener( 'dragover', event => event.preventDefault() )
        } )
    }
    
    const addEventDragForBlock = () => {
        arrWithBlock = document.querySelectorAll('.block');
        Array.prototype.forEach.call(arrWithBlock, (block, index) => {
            block.addEventListener('dragstart', function(event) {
                event.dataTransfer.setData('block', index);
            });
        })
    }
    
    const audioEffect = (src) => {
        let audio = new Audio();
        audio.src = src;
        audio.autoplay = true;
    }

    const replayGame = () => {
        celebrate.style.opacity = '0';
        celebrate.classList.add('celebrateHide');
        opacityCoef = 0;
        restartGame();
    }
    
    const closePage = () => {
        window.open('https://github.com/theTriss/myProjects', '_self', '');
    }
    
    const checkForWin = () => {
        
        clearTimeout(timerID);
        
        if( soundEffect ) audioEffect('win.mp3');
        
        celebrate.classList.remove('celebrateHide');

        requestAnimationFrame(opacityCoefForCelebrate);
        
    }
    
    const opacityCoefForCelebrate = () => {
        opacityCoef += 0.1;
        celebrate.style.opacity = opacityCoef;
        if( opacityCoef < 1 ) requestAnimationFrame(opacityCoefForCelebrate);
    }
    
    const timer = () => {
        let [ hours, minutes, seconds ] = fieldsWithTime,
            oldDate = Date.now()
            timerID = setTimeout( function timeCount() {
                let newDate = Date.now(),
                    milliseconds = newDate - oldDate,
                    hoursPassed = Math.floor(milliseconds / 1000 / 60 / 60),
                    minutesPassed = Math.floor(milliseconds / 1000 / 60),
                    secondsPassed = Math.floor(milliseconds / 1000);
                
                hours.innerHTML = checkIfZeroIsNeed(hoursPassed) + ':';
                minutes.innerHTML = checkIfZeroIsNeed(minutesPassed - hoursPassed * 60) + ':';
                seconds.innerHTML = checkIfZeroIsNeed(secondsPassed - minutesPassed * 60);
                
                if( true ) timerID = setTimeout( timeCount, 1000 )
            }, 0 )
    }
    
    const checkIfZeroIsNeed = ( currentValue ) => {
        if( currentValue < 10 ) return `0${currentValue}`
        return currentValue;
    }
    
    btnReset.addEventListener( 'click', resetLastMove );
    
    soundEffectBtn.addEventListener( 'click', function () {
        this.classList.toggle('soundEffect__false');
        soundEffect = !soundEffect;
    });
    
    btnForBlock.addEventListener('click', function addBlock () {
        timer();
        for( let i = 0; i < blockCounter.value; i++ ) {
            let block = document.createElement('div');
            block.classList.add('block');
            wrapForBlock[0].appendChild(block);
        }

        btnReset.disabled = false;
        btnRestart.disabled = false;
        
        blockCounter.disabled = true;
        btnForBlock.disabled = true;
        
        settingForBlock();
        addEventDragForBlock();
        addDrag();
        dropEventForTown();
    })
    
    btnRestart.addEventListener('click', restartGame);
    btnReplay.addEventListener('click', replayGame);
    btnClose.addEventListener('click',closePage);
    
})
