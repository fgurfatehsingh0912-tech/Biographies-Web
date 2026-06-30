// ============================================================================
// 1. DATA SOURCE ARRAY
// ============================================================================
const biographies = [
    { name: 'A. P. J. Abdul Kalam', gender: 'male', bio: 'Gurfateh Singh', link: 'apj.html'},
    { name: 'Manmohan Singh', gender: 'male', bio: 'Gurfateh Singh', link: 'Manmohan_Singh.html'},
    { name: "John Smith", gender: "male", bio: "Gurfateh Singh", link: 'John_Smith.html'},
    { name: "Sarah Jenkins", gender: "male", bio: "Gurfateh Singh", link: 'Sarah_Jenkins.html'},
    { name: "Michael Chen", gender: "male", bio: "Gurfateh Singh", link:'Micheal_Chen.html'},
    { name: "Emma Wilson", gender: "female", bio: "Emily Johnson", link: 'Emma_Wilson.html' }
];

// ============================================================================
// 2. BIOGRAPHY CARD GENERATION ENGINE
// ============================================================================
function displayBios() {
    const bioContent = document.getElementById('bioContent');
    const searchInput = document.getElementById('searchInput');
    const activeFilter = document.querySelector('.filter-opt:checked');

    if (!bioContent) return;

    const searchText = searchInput ? String(searchInput.value).toLowerCase().trim() : '';
    const activeGender = activeFilter ? activeFilter.value : 'all';

    bioContent.innerHTML = '';

    const filtered = biographies.filter(person => {
        const matchesGender = activeGender === 'all' || person.gender === activeGender;
        const matchesSearch = person.name.toLowerCase().includes(searchText) || 
                              person.bio.toLowerCase().includes(searchText);
        return matchesGender && matchesSearch;
    });

    if (filtered.length === 0) {
        bioContent.innerHTML = `<div class="col-12 text-center text-light mt-5"><p>No biographies found matching "${escapeHtml(searchText)}".</p></div>`;
        return;
    }

    filtered.forEach(person => {
        const cardHtml = `
            <div class="col-md-4 bio-card">
                <div class="card shadow-sm h-100 bg-dark text-light border-secondary">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <h5 class="card-title">${escapeHtml(person.name)}</h5>
                            <p class="card-text">${escapeHtml(person.bio)}</p>
                        </div>
                        <form action="${escapeHtml(person.link)}" class="mt-3">
                            <button type="submit" class="gemini-perfect-button">
                                <div class="btn-glow-container"></div>
                                <span class="btn-text">Read Biography</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        bioContent.insertAdjacentHTML('beforeend', cardHtml);
    });

    setTimeout(addTrackingToButtons, 15);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================================
// 3. INERTIA LAG PHYSICS ENGINE (LERP + EDGE-LOCKING)
// ============================================================================
function addTrackingToButtons() {
    const buttons = document.querySelectorAll('.gemini-perfect-button');
    
    buttons.forEach(button => {
        if (button.dataset.trackingInitialized === "true") return;
        button.dataset.trackingInitialized = "true";

        // Find our isolated color container layout box node
        const glowContainer = button.querySelector('.btn-glow-container');
        if (!glowContainer) return;

        let state = {
            targetX: 0, targetY: 0,
            currentX: 0, currentY: 0
        };

        const initialRect = button.getBoundingClientRect();
        state.targetX = initialRect.width / 2;
        state.targetY = initialRect.height / 2;
        state.currentX = state.targetX;
        state.currentY = state.targetY;

        button.addEventListener('mousemove', (e) => {
            const currentRect = button.getBoundingClientRect();
            const mouseX = e.clientX - currentRect.left;
            const mouseY = e.clientY - currentRect.top;

            state.targetX = mouseX;

            // EDGE-LOCKING: Locks the vertical track center directly onto the border bounds
            if (mouseY < currentRect.height / 2) {
                state.targetY = 0; 
            } else {
                state.targetY = currentRect.height; 
            }
        });

        // HIGH FREQUENCY PHYSICS ENGINE ANIMATION LOOP
        function updateCoordinatesLoop() {
            // Eases position values frame-by-frame to generate that smooth fluid lag (0.07 fraction)
            state.currentX += (state.targetX - state.currentX) * 0.07;
            state.currentY += (state.targetY - state.currentY) * 0.07;

            // IMPORTANT: Inject variables into the isolated container element instead of the main button wrapper
            glowContainer.style.setProperty('--x', `${state.currentX}px`);
            glowContainer.style.setProperty('--y', `${state.currentY}px`);

            requestAnimationFrame(updateCoordinatesLoop);
        }
        
        requestAnimationFrame(updateCoordinatesLoop);
    });
}

// ============================================================================
// 4. WINDOW DATA INITIALIZATION SYSTEM
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-opt');

    if (searchInput) {
        searchInput.addEventListener('input', displayBios);
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('change', displayBios);
    });

    displayBios();
});
