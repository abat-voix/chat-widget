// Создаем и настраиваем контейнер для iframe
const containerId = 'smart-assistant-chat-widget'
let appContainer = document.getElementById(containerId)

if (!appContainer) {
  appContainer = document.createElement('div')
  appContainer.id = containerId
  document.body.appendChild(appContainer)

  // Создаем iframe
  const iframe = document.createElement('iframe')
  iframe.id = 'smart-assistant-chat-widget-iframe'
  iframe.style.position = 'fixed'
  iframe.style.bottom = '160px'
  iframe.style.right = '25px'
  iframe.style.width = '600px'
  iframe.style.height = `${window.innerHeight * 0.8}px`
  iframe.style.zIndex = '99999'
  iframe.style.border = 'none'
  iframe.style.display = 'none'

  // Устанавливаем источник iframe
  iframe.src = chrome.runtime.getURL('iframe.html')

  // Добавляем iframe в контейнер
  appContainer.appendChild(iframe)

  // Создаем кнопку для управления видимостью контейнера
  const toggleButton = document.createElement('button')
  toggleButton.style.position = 'fixed'
  toggleButton.style.bottom = '100px'
  toggleButton.style.right = '45px'
  toggleButton.style.zIndex = '100001'
  toggleButton.style.width = '60px'
  toggleButton.style.height = '60px'
  toggleButton.style.backgroundColor = '#ef0f33'
  toggleButton.style.color = '#fff'
  toggleButton.style.border = 'none'
  toggleButton.style.borderRadius = '50%'
  toggleButton.style.cursor = 'pointer'
  toggleButton.style.display = 'flex'
  toggleButton.style.alignItems = 'center'
  toggleButton.style.justifyContent = 'center'
  toggleButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)'

  // Добавляем иконку в кнопку
  const icon = document.createElement('img')
  const showIconSrc = chrome.runtime.getURL('icons/chat-outline.png')
  const hideIconSrc = chrome.runtime.getURL('icons/close.png')
  icon.src = showIconSrc
  icon.style.width = '30px'
  icon.style.height = '30px'
  toggleButton.appendChild(icon)

  // Добавляем обработчик событий для кнопки
  toggleButton.addEventListener('click', () => {
    if (iframe.style.display === 'none') {
      iframe.style.display = 'block'
      icon.src = hideIconSrc
    } else {
      iframe.style.display = 'none'
      icon.src = showIconSrc
    }
  })

  // Добавляем кнопку на страницу
  appContainer.appendChild(toggleButton)
}
