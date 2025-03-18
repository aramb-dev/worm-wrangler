/* Fusilli.js by An - Distributed under MIT License - github.com/AnTheMaker/Fusilli.js */

const modalStyles = `
.modal{
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,.6);
  justify-content: center;
  align-items: center;
  user-select: none;
  z-index: 999;
}
.modal.open{
  display: flex;
}
.modal_box{
  background: white;
  color: black;
  margin: 7px;
  padding: 18px 20px;
  border-radius: 8px;
  width: 450px;
  min-height: 200px;
  max-width: 100%;
  max-height: calc(100% - 20px);
  overflow: auto;
  box-sizing: border-box;
  z-index: 99;
  user-select: auto;
  pointer-events: auto;
}
.modal_close{
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  cursor: pointer;
  font-size: 170%;
  z-index: 999;
}
`;

window.addEventListener('load', function(){
  var modalStyleSheet = document.createElement('style');
  modalStyleSheet.type = 'text/css';
  modalStyleSheet.innerText = modalStyles;
  document.head.appendChild(modalStyleSheet);

  var modals = [...document.getElementsByClassName('modal')];
  modals.forEach(function(modal){
    modal_box = modal.querySelector('.modal_box');
    modal.addEventListener('click', function(e){
      closeModal(modal);
    });
    modal_box.addEventListener('click', function(e){
      e.stopPropagation();
    });
  });
});

function openModal(modal){
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
}
function closeModal(modal){
  modal.setAttribute('aria-hidden', 'true');
  modal.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
    const victoryModal = document.getElementById('victory_modal');
    const closeVictoryModal = document.getElementById('close_victory_modal');
    const restartButton = document.getElementById('restart_button');
    const homeModalButton = document.getElementById('home_modal_button');

    closeVictoryModal.addEventListener('click', () => closeModal(victoryModal));
    restartButton.addEventListener('click', () => {
        closeModal(victoryModal);
        // Add logic to restart the game
    });
    homeModalButton.addEventListener('click', () => {
        closeModal(victoryModal);
        window.location.href = '../index.html';
    });
});