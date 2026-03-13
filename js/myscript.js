// Login functions (fixed)
function handleLogin() {
    const username = document.querySelector('#loginModal input[type="text"]').value;
    const email = document.querySelector('#loginModal input[type="email"]').value;
    const password = document.querySelector('#loginModal input[type="password"]').value;

    if (email === 'usuario@gmail.com' && password === 'usuario' && username === 'usuario') {
        document.querySelector('.navbar .btn-primary').style.display = 'none';
        const userImage = document.createElement('img');
        userImage.src = 'resources/img/channels4_profile.jpg';
        userImage.style.width = '40px';
        userImage.style.height = '40px';
        userImage.style.borderRadius = '50%';
        userImage.alt = 'Usuario';
        userImage.title = 'Usuario logueado';
        document.querySelector('.navbar').appendChild(userImage);
        closeLoginModal();
    } else {
        alert('Credenciales incorrectas');
    }
}

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
}

// Existing recommendation
function showRecommendedPC(type) {
    let recommendedPC = '';
    switch(type) {
        case 'Estudiante':
            recommendedPC = '<h5>Recomendación: PC de Entrada</h5>';
            break;
        case 'Diseñador 3D':
            recommendedPC = '<h5>Recomendación: PC Gama Media</h5>';
            break;
        case 'Arquitecto':
            recommendedPC = '<h5>Recomendación: PC Gama Alta</h5>';
            break;
        case 'Programador':
            recommendedPC = '<h5>Recomendación: PC Gama Media</h5>';
            break;
        case 'Photoshop':
            recommendedPC = '<h5>Recomendación: PC Gama Alta</h5>';
            break;
    }
    const recDiv = document.getElementById('recommendedPC');
    if (recDiv) {
        recDiv.innerHTML = recommendedPC;
    }
}

// Chatbot logic - ENHANCED with more options
let chatHistory = [];

const pcRecommendations = {
    basica: {
        name: 'PC Básica / Todo Incluido',
        price: '$9,000 approx',
        specs: 'Ryzen/i3, 8GB RAM, gráficos integrados, 500GB SSD',
        use: 'Office, web, estudio básico',
        link: 'store.html#gama-baja'
    },
    baja: {
        name: 'PC Gamer de Entrada / Baja',
        price: '$9,000 - $12,500',
        specs: 'Ryzen 5/i3, 8-16GB RAM, GTX 1650/Vega, 500GB-1TB SSD',
        use: 'Estudio, gaming ligero (Fortnite, LoL)',
        link: 'store.html#gama-baja'
    },
    media: {
        name: 'PC Gamer Gama Media',
        price: '$22,000 - $32,000',
        specs: 'i5/Ryzen 5/7, 32GB RAM, RTX 3060/4070, 1TB SSD',
        use: 'Gaming 1080p/1440p (Valorant, Cyberpunk med), diseño, código',
        link: 'store.html#gama-media'
    },
    alta: {
        name: 'PC Gamer Gama Alta',
        price: '$45,000 - $80,000',
        specs: 'i9/Ryzen 9, 64GB+ RAM, RTX 4080/4090, 2TB+ SSD',
        use: 'Gaming 4K ultra, Blender/Photoshop pro, render',
        link: 'store.html#gama-alta'
    },
    ultra: {
        name: 'PC Ultra Gama Alta',
        price: '$80,000+',
        specs: 'i9-14900K/Ryzen 9, 128GB DDR5, RTX 4090, 4TB+',
        use: 'Streaming 4K, edición pro, VR máxima',
        link: 'store.html#ultra'
    }
};

function openChatModal() {
    document.getElementById('chatModal').style.display = 'block';
    document.getElementById('chatToggle').style.opacity = '0.5';
}

function closeChatModal() {
    document.getElementById('chatModal').style.display = 'none';
    document.getElementById('chatToggle').style.opacity = '1';
}

function toggleChat() {
    const modal = document.getElementById('chatModal');
    if (modal.style.display === 'block') {
        closeChatModal();
    } else {
        openChatModal();
    }
}

function clearChat() {
    const messagesDiv = document.getElementById('chatMessages');
    messagesDiv.innerHTML = '<div class="message bot-message"><strong>Asistente:</strong> ¡Hola! Soy el asistente de PowerRig. ¿Qué PC te recomiendo? Dime tu presupuesto (bajo/medio/alto) o para qué la usarás (gaming, estudio, diseño, etc.).</div>';
    chatHistory = [];
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function addMessage(text, isUser = false) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.innerHTML = `<strong>${isUser ? 'Tú' : 'Asistente'}:</strong> ${text}`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    chatHistory.push({ isUser, text });
}

function getRecommendation(userInput) {
    const inputLower = userInput.toLowerCase().replace(/[$\s,]/g, '');

    // Commands
    if (inputLower === '/help' || inputLower === 'ayuda') return 'help';
    if (inputLower === '/clear' ) return 'clear';

    // Budget numbers
    const budgetNum = parseFloat(inputLower.match(/(\d+)/)?.[0] || 0);
    if (budgetNum > 0) {
        if (budgetNum < 15000) return 'basica';
        if (budgetNum < 25000) return 'baja';
        if (budgetNum < 40000) return 'media';
        return 'alta';
    }

    // Games
    if (inputLower.includes('fortnite') || inputLower.includes('lol') || inputLower.includes('valorant') || inputLower.includes('cs')) return 'baja';
    if (inputLower.includes('cyberpunk') || inputLower.includes('gta') || inputLower.includes('rdr2') || inputLower.includes('4k')) return 'alta';

    // Software
    if (inputLower.includes('office') || inputLower.includes('word') || inputLower.includes('básico')) return 'basica';
    if (inputLower.includes('blender') || inputLower.includes('render') || inputLower.includes('arquitect')) return 'alta';
    if (inputLower.includes('photo') || inputLower.includes('ps')) return 'media';

    // Compare
    if (inputLower.includes('compar') || inputLower.includes('diferencia')) return 'compare';

    // Budget/use
    if (inputLower.includes('bajo') || inputLower.includes('baja') || inputLower.includes('entrada') || inputLower.includes('estudian')) return 'baja';
    if (inputLower.includes('medio') || inputLower.includes('media') || inputLower.includes('program') || inputLower.includes('diseño')) return 'media';
    if (inputLower.includes('alto') || inputLower.includes('alta') || inputLower.includes('gaming') || inputLower.includes('juego')) return 'alta';
    if (inputLower.includes('ultra') || inputLower.includes('top')) return 'ultra';

    if (inputLower.includes('qué pc') || inputLower.includes('que pc') || inputLower.includes('recomienda')) return 'askBudget';

    return 'unknown';
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const userText = input.value.trim();
    if (!userText) return;

    addMessage(userText, true);
    input.value = '';

    let rec = getRecommendation(userText);
    let botResponse = '';

    switch (rec) {
        case 'help':
            botResponse = 'Opciones:<br>- Presupuesto: bajo/medio/alto, $10000, $30000<br>- Juegos: fortnite (baja), cyberpunk (alta)<br>- Software: office (básica), blender (alta)<br>- /clear: limpiar chat';
            break;
        case 'clear':
            clearChat();
            return;
        case 'compare':
            botResponse = 'Comparación rápida:<br><strong>Baja:</strong> Gaming ligero ($10k)<br><strong>Media:</strong> 1440p sólido ($30k)<br><strong>Alta:</strong> 4K ultra ($60k+)';
            break;
        case 'askBudget':
            botResponse = '¡Genial! Dime: presupuesto (bajo/$15k/medio), uso (gaming fortnite/blender/estudio), o /help para más.';
            break;
        case 'unknown':
            botResponse = 'Dime más detalles: presupuesto, juegos (ej: fortnite), software, o /help. 😊';
            break;
        default:
            if (pcRecommendations[rec]) {
                const pc = pcRecommendations[rec];
                botResponse = `👌 <strong>${pc.name}</strong> (${pc.price})<br>🎯 Para: ${pc.use}<br>⚙️ Specs: ${pc.specs}<br><a href="${pc.link}" style="color: #ffc107;" target="_blank">→ Ver en Tienda</a>`;
            }
    }

    setTimeout(() => addMessage(botResponse), 300);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('chatToggle').addEventListener('click', toggleChat);
});

