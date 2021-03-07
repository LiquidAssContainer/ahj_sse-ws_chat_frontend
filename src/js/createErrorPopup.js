export default function createErrorPopup(message) {
  const popup = document.createElement('div');
  popup.className = 'error-popup';
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 3000);
}
